import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRequestService } from './service/serviceRequest.service';
import { ServiceRequestController } from './controller/serviceRequest.controller';
import { ServiceRequestEntity } from './entity/serviceRequest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRequestEntity])],
  controllers: [ServiceRequestController],
  providers: [ServiceRequestService],
  exports: [ServiceRequestService],
})
export class ServiceRequestModule {}
