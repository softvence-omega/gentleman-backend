import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import ApiError from 'src/common/errors/ApiError';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import Review from 'src/modules/review/enitity/review.entity';
import { UserRole } from '../dto/create-user.dto';
import { UpdateUserStatusDto } from '../dto/update-user-status.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    private cloudinary: CloudinaryService
  ) { }

  async updateUser(userData: any, payload: UpdateUserDto, image?: Express.Multer.File, certificate?: Express.Multer.File) {

    try {
      const user = await this.userRepository.findOneBy({ id: userData.userId });

      if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'User not exist!');
      }

      if (image) {
        if (user.profileImage) {
          try {
            const publicId = this.cloudinary.extractPublicId(user.profileImage);
            await this.cloudinary.destroyFile(publicId as string);
          } catch (e) {
            throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
          }
        }
        const result = await this.cloudinary.uploadFile(image);
        user.profileImage = result ? result['secure_url'] : user.profileImage;
      }
      if (certificate) {
        if (user.certificate) {
          try {
            const publicId = this.cloudinary.extractPublicId(user.certificate);
            await this.cloudinary.destroyFile(publicId as string);
          } catch (e) {
            throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
          }
        }
        const result = await this.cloudinary.uploadFile(certificate);
        user.certificate = result ? result['secure_url'] : user.profileImage;
      }

      user.name = payload.name ? payload.name : user.name;
      user.stripeAccountId = payload.stripeAccountId ? payload.stripeAccountId : user.stripeAccountId;
      user.role = payload.role ? payload.role : user.role;
      user.serviceCategoryId = payload.serviceCategoryId ? payload.serviceCategoryId : user.serviceCategoryId;
      user.status = payload.status ? payload.status : user.status;
      user.specialist = payload.specialist ? payload.specialist : user.specialist;
      user.fcmToken = payload.fcmToken ? payload.fcmToken : user.fcmToken;

      await this.userRepository.save(user);

      return;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);

    }

  }
  async updateUserStatus(userData: any, id: string, payload: UpdateUserStatusDto) {

    try {
      const isAdmin = await this.userRepository.findOne({
        where: { id: userData.userId, role: UserRole.ADMIN }
      });

      if (!isAdmin) {
        throw new ApiError(HttpStatus.FORBIDDEN, "You are not permitted to update user status");
      }

      const user = await this.userRepository.findOneBy({ id: id });

      if (!user) {
        throw new ApiError(HttpStatus.NOT_FOUND, 'User not exist!');
      }
      user.status = payload.status ? payload.status : user.status;

      await this.userRepository.save(user);

      return;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, error.message);

    }

  }

  async getProviderLocations() {
    const providers = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: 'provider' })
      .andWhere('user.isDeleted = false')
      .andWhere('user.latitude IS NOT NULL')
      .andWhere('user.longitude IS NOT NULL')
      .select([
        'user.id',
        'user.name',
        'user.profileImage',
        'user.latitude',
        'user.longitude',
      ])
      .getMany();

    return providers.map((provider) => ({
      providerId: provider.id,
      name: provider.name,
      profileImage: provider.profileImage,
      latitude: provider.latitude,
      longitude: provider.longitude,
    }));
  }


  async getUserById(user, id: string) {
    const userData = await this.userRepository.findOneByOrFail({ id: user.userId });
    if (user.userId !== id) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'User data can\'t fetched!');
    }

    return {
      user: userData
    }
  }


  async getAllProviders(specialist?: string) {
    const query = this.userRepository
      .createQueryBuilder('provider')
      .leftJoin('provider.providedBookings', 'booking')
      .leftJoin('booking.reviews', 'review')
      .leftJoin('booking.category', 'category')
      .leftJoin('category.service', 'service')
      .where('provider.role = :role', { role: 'provider' })
      .andWhere('provider.isDeleted = false')
      .select('provider.id', 'id')
      .addSelect('provider.name', 'name')
      .addSelect('provider.profileImage', 'profileImage')
      .addSelect('provider.specialist', 'specialist')
      .addSelect('AVG(review.rating)', 'avgrating')
      .groupBy('provider.id')
      .addGroupBy('provider.name')
      .addGroupBy('provider.profileImage')
      .addGroupBy('provider.specialist')
      .orderBy('avgrating', 'ASC');

    if (specialist) {
      query.andWhere('provider.specialist = :specialist', { specialist });
    }

    const providers = await query.getRawMany();

    return providers.map((p) => ({
      id: p.id,
      name: p.name,
      profileImage: p.profileImage || null,
      specialist: p.specialist || null,
      averageRating: parseFloat(p.avgrating) || 0,
    }));
  }




  async getProviderById(id: string) {
    const provider = await this.userRepository
      .createQueryBuilder('provider')
      .leftJoin('provider.providedBookings', 'booking')
      .leftJoin('booking.reviews', 'review')
      .leftJoin('booking.category', 'category')
      .leftJoin('category.service', 'service')
      .where('provider.id = :id', { id })
      .andWhere('provider.role = :role', { role: 'provider' })
      .andWhere('provider.isDeleted = false')
      .select('provider.id', 'id')
      .addSelect('provider.name', 'name')
      .addSelect('provider.profileImage', 'profileImage')
      .addSelect('provider.specialist', 'specialist')
      .addSelect('AVG(review.rating)', 'avgrating')
      .groupBy('provider.id')
      .addGroupBy('provider.name')
      .addGroupBy('provider.profileImage')
      .addGroupBy('provider.specialist')
      .getRawOne();

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const recentReviews = await this.reviewRepository
      .createQueryBuilder('review')
      .innerJoin('review.booking', 'booking')
      .innerJoin('booking.user', 'user') // Get reviewer info via booking.user
      .where('booking.providerId = :id', { id })
      .orderBy('review.createdAt', 'DESC')
      .select([
        'review.comment AS comment',
        'review.rating AS rating',
        'review.createdAt AS createdAt',
        'user.id AS reviewerId',
        'user.name AS reviewerName',
        'user.profileImage AS reviewerProfileImage',
      ])
      .limit(3)
      .getRawMany();



    return {
      id: provider.id,
      name: provider.name,
      profileImage: provider.profileImage,
      specialist: provider.specialist,
      averageRating: parseFloat(provider.avgrating) || 0,
      recentReviews: recentReviews.map((r) => ({
        comment: r.comment,
        rating: r.rating,
        createdAt: r.createdat,
        reviewer: {
          id: r.reviewerid,
          name: r.reviewername,
          profileImage: r.reviewerprofileimage,

        },
      })),
    };
  }



  async getFilteredProviders({
    status,
    specialist,
    country,
    latitude,
    longitude,
    rangeInKm,
    page = 1,
    limit = 10,
  }: {
    status?: string;
    specialist?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
    rangeInKm?: number;
    page?: number;
    limit?: number;
  }) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role AND user.isDeleted = false', { role: 'provider' });

    if (status) {
      query.andWhere('user.status = :status', { status });
    }

    if (specialist) {
      query.andWhere('user.specialist = :specialist', { specialist });
    }

    if (country) {
      query.andWhere('user.country = :country', { country });
    }

    if (latitude && longitude && rangeInKm) {
      query.andWhere(
        `
      (
        6371 * acos(
          cos(radians(:latitude)) * cos(radians(CAST(user.latitude AS DOUBLE PRECISION))) *
          cos(radians(CAST(user.longitude AS DOUBLE PRECISION)) - radians(:longitude)) +
          sin(radians(:latitude)) * sin(radians(CAST(user.latitude AS DOUBLE PRECISION)))
        )
      ) <= :rangeInKm
    `,
        {
          latitude,
          longitude,
          rangeInKm,
        },
      );
    }

    const [data, total] = await query
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data,
    };
  }

  async remove(user, id) {

    const isAdmin = await this.userRepository.findOne({
      where: { id: user.userId }
    })

    if (!isAdmin) {
      throw new ApiError(HttpStatus.FORBIDDEN, "Something went wrong!");
    }

    if (isAdmin.role !== UserRole.ADMIN) {
      throw new ApiError(HttpStatus.FORBIDDEN, "You are not permitted to remove user");
    }


    const userData = await this.userRepository.findOne({
      where: { id }
    });

    if (!userData) {
      throw new ApiError(HttpStatus.NOT_FOUND, "Something went wrong!");
    }

    if (userData.id === isAdmin.id) {
      throw new ApiError(HttpStatus.FORBIDDEN, "You can't remove yourself");
    }

    if (userData.profileImage) {
      try {
        const relativePath = this.cloudinary.extractPublicId(userData.profileImage);
        await this.cloudinary.destroyFile(relativePath)
      } catch (e) {
        throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
      }
    }

    userData.isDeleted = true;
    userData.status = 'inactive';

    await this.userRepository.save(userData);
  }

}
