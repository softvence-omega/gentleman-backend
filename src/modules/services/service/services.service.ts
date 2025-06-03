import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entity/service.entity'; // removed the extra space
import { ServiceDto } from '../dto/ service.dto';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async createService(dto: ServiceDto) {
    const existing = await this.serviceRepo.findOneBy({ title: dto.title });
    if (existing) {
      throw new BadRequestException('Service title already exists');
    }

    const service = this.serviceRepo.create(dto);
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
