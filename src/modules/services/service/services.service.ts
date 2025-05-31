import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../entity/service.entity';
import { ServiceDto } from '../dto/ service.dto';
@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async createService(dto: ServiceDto) {
    const service = this.serviceRepo.create(dto);
    await this.serviceRepo.save(service);
    return service;
  }

  async getServiceById(id: string) {
    const service = await this.serviceRepo.findOneBy({ id });
    if (!service) {
      throw new NotFoundException('Service not found');
    }
    return service;
  }
}
