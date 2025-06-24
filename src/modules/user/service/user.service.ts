import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import ApiError from 'src/common/errors/ApiError';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import Review from 'src/modules/review/enitity/review.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Review)
    private reviewRepository : Repository<Review>,
    private cloudinary: CloudinaryService
  ) { }

  async updateUser(userData: any, payload: UpdateUserDto, image?: Express.Multer.File, certificate?: Express.Multer.File) {
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
      const result = this.cloudinary.uploadFile(image);
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
      const result = this.cloudinary.uploadFile(certificate);
      user.certificate = result ? result['secure_url'] : user.profileImage;
    }

    user.name = payload.name ? payload.name : user.name;
    user.role = payload.role ? payload.role : user.role;
    user.serviceCategoryId = payload.serviceCategoryId ? payload.serviceCategoryId : user.serviceCategoryId;
    user.status = payload.status ? payload.status : user.status;

    await this.userRepository.save(user);

    return;

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


//   async getAllProviders() {
//   const providers = await this.userRepository
//     .createQueryBuilder('provider')
//     .leftJoin('provider.providedBookings', 'booking')
//     .leftJoin('booking.reviews', 'review')
//     .leftJoin('booking.category', 'category') // works via entity relation
//     .leftJoin('category.service', 'service')  // works via entity relation
//     .where('provider.role = :role', { role: 'provider' })
//     .andWhere('provider.isDeleted = false')
//     .select('provider.id', 'id')
//     .addSelect('provider.name', 'name')
//     .addSelect('AVG(review.rating)', 'avgrating')
//     .addSelect((qb) => {
//       return qb
//         .subQuery()
//         .select('srv.title')
//         .from('booking', 'subBook')
//         .leftJoin('category_entity', 'cat', 'subBook.categoryId = cat.id')
//         .leftJoin('service_entity', 'srv', 'cat.serviceId = srv.id')
//         .where('subBook.providerId = provider.id')
//         .andWhere('srv.title IS NOT NULL')
//         .groupBy('srv.title')
//         .orderBy('COUNT(*)', 'DESC')
//         .limit(1);
//     }, 'topservice')
//     .groupBy('provider.id')
//     .addGroupBy('provider.name')
//     .orderBy('avgrating', 'ASC')
//     .getRawMany();

//   return providers.map((p) => ({
//     id: p.id,
//     name: p.name,
//     averageRating: parseFloat(p.avgrating) || 0,
//     ...(p.topservice ? { mostBookedService: p.topservice } : {}),
//   }));

  
// }


async getAllProviders() {
  const providers = await this.userRepository
    .createQueryBuilder('provider')
    .leftJoin('provider.providedBookings', 'booking')
    .leftJoin('booking.reviews', 'review')
    .leftJoin('booking.category', 'category') // works via entity relation
    .leftJoin('category.service', 'service')  // works via entity relation
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
    .orderBy('avgrating', 'ASC')
    .getRawMany();

  return providers.map((p) => ({
    id: p.id,
    name: p.name,
    profileImage: p.profileImage || null,
    specialist: p.specialist || null,
    averageRating: parseFloat(p.avgrating) || 0,
  }));
}




// async getProviderById(id: string) {
//   const provider = await this.userRepository
//     .createQueryBuilder('provider')
//     .leftJoin('provider.providedBookings', 'booking')
//     .leftJoin('booking.reviews', 'review')
//     .leftJoin('booking.category', 'category')
//     .leftJoin('category.service', 'service')
//     .where('provider.id = :id', { id })
//     .andWhere('provider.role = :role', { role: 'provider' })
//     .andWhere('provider.isDeleted = false')
//     .select('provider.id', 'id')
//     .addSelect('provider.name', 'name')
//     .addSelect('provider.profileImage', 'profileImage') 
//     .addSelect('AVG(review.rating)', 'avgrating')
//     .addSelect((qb) => {
//       return qb
//         .subQuery()
//         .select('srv.title')
//         .from('booking', 'subBook')
//         .leftJoin('category_entity', 'cat', 'subBook.categoryId = cat.id')
//         .leftJoin('service_entity', 'srv', 'cat.serviceId = srv.id')
//         .where('subBook.providerId = :id', { id })
//         .andWhere('srv.title IS NOT NULL')
//         .groupBy('srv.title')
//         .orderBy('COUNT(*)', 'DESC')
//         .limit(1);
//     }, 'topservice')
//     .groupBy('provider.id')
//     .addGroupBy('provider.name')
//     .addGroupBy('provider.profileImage')  
//     .getRawOne();

//   if (!provider) {
//     throw new NotFoundException('Provider not found');
//   }

  
//   const recentReviews = await this.reviewRepository
//     .createQueryBuilder('review')
//     .innerJoin('review.booking', 'booking')
//     .where('booking.providerId = :id', { id })
//     .orderBy('review.createdAt', 'DESC')
//     .select(['review.comment', 'review.rating', 'review.createdAt'])
//     .limit(3)
//     .getMany();

//   return {
//     id: provider.id,
//     name: provider.name,
//     profileImage: provider.profileImage,  // <-- Return here
//     averageRating: parseFloat(provider.avgrating) || 0,
//     ...(provider.topservice ? { mostBookedService: provider.topservice } : {}),
//     recentReviews,
//   };
// }


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





}
