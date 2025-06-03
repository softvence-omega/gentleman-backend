import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTypeEntity } from '../entity/vehicle-type.entity';
import { CreateVehicleTypeDto } from '../dto/vehicleTypes.dto';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';

@Injectable()
export class VehicleTypeService {
  constructor(
    @InjectRepository(VehicleTypeEntity)
    private readonly vehicleTypeRepo: Repository<VehicleTypeEntity>,

    @InjectRepository(bookingInfoEntity)
    private readonly bookingInfoRepo: Repository<bookingInfoEntity>,
  ) {}

  async createVehicleType(dto: CreateVehicleTypeDto) {
    const existing = await this.vehicleTypeRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Vehicle type with name "${dto.name}" already exists.`);
    }

    const bookingInfo = await this.bookingInfoRepo.findOne({
      where: { id: "" },
    });

    if (!bookingInfo) {
      throw new NotFoundException('Booking Info not found');
    }


    const vehicleType = this.vehicleTypeRepo.create({
      name: dto.name,
      icon: dto.icon,
      bookingInfo
    });

    return await this.vehicleTypeRepo.save(vehicleType);
  }

  async findAll() {
    return await this.vehicleTypeRepo.find();
  }
}
