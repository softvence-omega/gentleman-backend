import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeEntity } from './entity/vehicle-type.entity';
import { VehicleTypeController } from './controller/vehicleTypes.controller';
import { VehicleTypeService } from './services/vehicleTypes.services';
import Booking from '../booking/entity/booking.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleTypeEntity,Booking]),CloudinaryModule],


@Module({
  imports: [TypeOrmModule.forFeature([VehicleTypeEntity, Booking])],
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService],
  exports: [TypeOrmModule]
})
export class VehicleTypeModule { }
