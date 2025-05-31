import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceDetailEntity } from './entity/serviceDetail.entity';
import { ServiceDetailController } from './controller/controller.controller';
import { ServiceDetail } from './service/service.service';
import { Location } from '../location/entities/location.entity';
import { LocationModule } from '../location/location.module';

@Module({
  providers: [ServiceDetail],
  imports: [TypeOrmModule.forFeature([ServiceDetailEntity]), LocationModule],
  controllers: [ServiceDetailController],
})
export class ServiceDetailsModule {}
