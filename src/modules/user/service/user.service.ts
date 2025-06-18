import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UpdateUserDto } from '../dto/update-user.dto';
import ApiError from 'src/common/errors/ApiError';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
      .leftJoinAndSelect('user.providedBookings', 'booking')
      .where('user.role = :role', { role: 'provider' })
      .andWhere('user.isDeleted = false')
      .andWhere('booking.latitude IS NOT NULL')
      .andWhere('booking.longitude IS NOT NULL')
      .select([
        'user.id',
        'user.name',
        'user.profileImage',
        'booking.latitude',
        'booking.longitude',
      ])
      .getMany();

    // Flatten into array of coordinates
    const locations = providers.flatMap((user) =>
      user.providedBookings.map((booking) => ({
        providerId: user.id,
        name: user.name,
        profileImage: user.profileImage,
        latitude: booking.latitude,
        longitude: booking.longitude,
      })),
    );

    return locations;
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

}
