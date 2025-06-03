import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceDetailEntity } from '../entity/serviceDetail.entity';
import { EntityManager, Repository } from 'typeorm';
import { ServiceDetailDto } from '../dto/serviceDetail.dto';
import { Location } from 'src/modules/location/entities/location.entity';

@Injectable()
export class ServiceDetail {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
    @InjectRepository(ServiceDetailEntity)
    private readonly serviceDetailRepo: Repository<ServiceDetailEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  async createServiceDetail(dto: ServiceDetailDto) {
    const location = await this.locationRepo.findOne({
      where: { id: dto.locationId },
    });

    if (!location) {
      throw new NotFoundException('Location not found');
    }

    const serviceDetail = new ServiceDetailEntity({
      ...dto,
      locationId: dto.locationId,
    });
    await this.entityManager.save(serviceDetail);
    
    return serviceDetail;
  }
}
