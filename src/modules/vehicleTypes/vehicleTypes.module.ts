import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleTypeEntity } from './entity/vehicle-type.entity';
import { VehicleTypeController } from './controller/vehicleTypes.controller';
import { VehicleTypeService } from './services/vehicleTypes.services';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { bookingInfoEntity } from '../bookingInfo/entity/bookingInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleTypeEntity,VehicleEntity,bookingInfoEntity])],
  controllers: [VehicleTypeController],
  providers: [VehicleTypeService],
  exports:[TypeOrmModule]
})
export class VehicleTypeModule {}
