import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from '../entity/vehicle.entity';
import { VehicleDto } from '../dto/vehicle.dto';
import ApiError from 'src/common/errors/ApiError';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepo: Repository<VehicleEntity>,
    private cloudinary: CloudinaryService,
  ) {}

 async createVehicle(userId: string, dto: VehicleDto, file?: Express.Multer.File) {
  let result;
  if (file) {
    try {
      result = await this.cloudinary.uploadFile(file);
    } catch (e) {
      throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
    }
  }

  const upddateDto = {
    ...dto,
    vehicleImage: result ? result['secure_url'] : '',
    user: { id: userId }, // if using relation
  };

  const vehicle = this.vehicleRepo.create(upddateDto);
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

   async getAllVehicles(userId: string): Promise<VehicleEntity[]> {
    return this.vehicleRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }
}