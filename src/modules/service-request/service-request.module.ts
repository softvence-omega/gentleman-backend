import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestService } from './service/serviceRequest.service';
import { ServiceRequestController } from './controller/serviceRequest.controller';
import { ServiceRequestEntity } from './entity/serviceRequest.entity';
import { User } from '../user/entities/user.entity';
import { bookingInfoEntity } from '../bookingInfo/entity/bookingInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequestEntity,User,bookingInfoEntity])],
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
  exports: [ServiceRequestService],
})
export class ServiceRequestModule {}
