import {
  Injectable,
  ConflictException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleTypeEntity } from '../entity/vehicle-type.entity';
import { CreateVehicleTypeDto } from '../dto/vehicleTypes.dto';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import ApiError from 'src/common/errors/ApiError';

@Injectable()
export class VehicleTypeService {
  constructor(
    @InjectRepository(VehicleTypeEntity)
    private readonly vehicleTypeRepo: Repository<VehicleTypeEntity>,
    private cloudinary: CloudinaryService,
    

  ) {}

  async createVehicleType(dto: CreateVehicleTypeDto, file?: Express.Multer.File) {
    const existing = await this.vehicleTypeRepo.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(`Vehicle type with name "${dto.name}" already exists.`);
    }

     let result;
        if (file) {
            try {
                result = await this.cloudinary.uploadFile(file);
            } catch (e) {
                throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
            }
        }

  


    const vehicleType = this.vehicleTypeRepo.create({
      name: dto.name,
      icon: result ? result['secure_url'] : ''      
    });
    return await this.vehicleTypeRepo.save(vehicleType);
  }

  async findAll() {
    return await this.vehicleTypeRepo.find();
  }
}
