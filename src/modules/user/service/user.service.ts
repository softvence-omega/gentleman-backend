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
          await this.cloudinary.destroyImage(publicId as string);
        } catch (e) {
          throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
      }
      const result = this.cloudinary.uploadImage(image);
      user.profileImage = result ? result['secure_url'] : user.profileImage;
    }
    if (certificate) {
      if (user.certificate) {
        try {
          const publicId = this.cloudinary.extractPublicId(user.certificate);
          await this.cloudinary.destroyImage(publicId as string);
        } catch (e) {
          throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message)
        }
      }
      const result = this.cloudinary.uploadImage(certificate);
      user.certificate = result ? result['secure_url'] : user.profileImage;
    }

    user.name = payload.name ? payload.name : user.name;
    user.role = payload.role ? payload.role : user.role;
    user.serviceCategoryId = payload.serviceCategoryId ? payload.serviceCategoryId : user.serviceCategoryId;
    user.status = payload.status ? payload.status : user.status;

    await this.userRepository.save(user);

    return;

  }
}
