import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entity/service.entity'; // removed the extra space
import { ServiceDto } from '../dto/service.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import ApiError from 'src/common/errors/ApiError';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
     private cloudinary: CloudinaryService,
  ) { }

  async createService(dto: ServiceDto, file?: Express.Multer.File) {
    const existing = await this.serviceRepo.findOneBy({ title: dto.title });
    if (existing) {
      throw new BadRequestException('Service title already exists');
    }

    let result;
        if (file) {
            try {
                result = await this.cloudinary.uploadImage(file.buffer);
            } catch (e) {
                throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
            }
        }
    const service = this.serviceRepo.create({
      ...dto,
      icon: result ? result['secure_url'] : ''
    });
    await this.serviceRepo.save(service);
    return service;
  }

  async getAllService(limit: number, page: number) {
    const [services, total] = await this.serviceRepo.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });

    if (!services.length) {
      throw new NotFoundException('No services found');
    }

    return {
      items: services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSingleService(id: string) {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['categories'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }


}
