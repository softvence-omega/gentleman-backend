import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequestEntity } from '../entity/serviceRequest.entity';
import { Repository } from 'typeorm';
import { ServiceRequestDto } from '../dto/serviceRequest.dto';

@Injectable()
export class ServiceRequestService {
  constructor(
    @InjectRepository(ServiceRequestEntity)
    private readonly serviceRequestRepo: Repository<ServiceRequestEntity>,
  ) {}

  async createServiceRequest(dto: ServiceRequestDto) {
    const serviceRequest = new ServiceRequestEntity(dto);
    await this.serviceRequestRepo.save(serviceRequest);
    return serviceRequest;
  }
}
