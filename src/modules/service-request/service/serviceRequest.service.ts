import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRequestEntity } from '../entity/serviceRequest.entity';
import { Repository } from 'typeorm';
import { ServiceRequestDto } from '../dto/serviceRequest.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';

@Injectable()
export class ServiceRequestService {
  constructor(
    @InjectRepository(ServiceRequestEntity)
    private readonly serviceRequestRepo: Repository<ServiceRequestEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(bookingInfoEntity)
    private readonly bookingInfoRepo: Repository<bookingInfoEntity>,


  ) {}

  async createServiceRequest(dto: ServiceRequestDto) {
    const provider = await this.userRepo.findOne({
      where: { id: dto.providerId },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const bookingInfo = await this.bookingInfoRepo.findOne({
      where: { id: "" }, //do to 
    });

    if (!bookingInfo) {
      throw new NotFoundException('Booking Info not found');
    }

    const serviceRequest = new ServiceRequestEntity({
      ...dto,
      provider,
      bookingInfo
    });

    await this.serviceRequestRepo.save(serviceRequest);
    return serviceRequest;
  }
}
