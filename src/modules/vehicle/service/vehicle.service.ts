import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { Repository } from 'typeorm';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { CreateVehicleDto } from '../dto/vehicle.dto';


@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,

    @InjectRepository(VehicleTypeEntity)
    private readonly vehicleTypeRepo: Repository<VehicleTypeEntity>,
  ) {}

  async create(dto: CreateVehicleDto): Promise<VehicleEntity> {
    const vehicleType = await this.vehicleTypeRepo.findOne({
      where: { id: dto.vehicleTypeId },
    });

    if (!vehicleType) {
      throw new NotFoundException('Vehicle type not found');
    }

    const vehicle = this.vehicleRepo.create({
      ...dto,
      vehicleType,
    });

    return this.vehicleRepo.save(vehicle);
  }

  async findAll(): Promise<VehicleEntity[]> {
    return this.vehicleRepo.find({ relations: ['vehicleType'] });
  }

  async findOne(id: string): Promise<VehicleEntity> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: ['vehicleType'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }
}
