import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleEntity } from './entity/vehicle.entity';
import { VehicleTypeEntity } from '../vehicleTypes/entity/vehicle-type.entity';
import { VehicleController } from './controller/vehicle.controller';
import { VehicleService } from './service/vehicle.service';

@Module({
  imports: [TypeOrmModule.forFeature([VehicleEntity, VehicleTypeEntity])],
  controllers: [VehicleController],
  providers: [VehicleService],
})
export class VehicleModule {}
