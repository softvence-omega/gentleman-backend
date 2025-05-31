import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { VehicleDto } from '../dto/vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,
  ) {}

  async createVehicle(dto: VehicleDto) {
    const vehicle = this.vehicleRepo.create(dto);
    await this.vehicleRepo.save(vehicle);
    return vehicle;
  }

  async getVehicleById(id: string) {
    const vehicle = await this.vehicleRepo.findOneBy({ id });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }
}
