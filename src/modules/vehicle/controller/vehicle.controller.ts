import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { VehicleService } from '../service/vehicle.service';
import { VehicleEntity } from '../entity/vehicle.entity';
import { CreateVehicleDto } from '../dto/vehicle.dto';


@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
  async create(@Body() dto: CreateVehicleDto): Promise<VehicleEntity> {
    return this.vehicleService.create(dto);
  }

  @Get()
  async findAll(): Promise<VehicleEntity[]> {
    return this.vehicleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<VehicleEntity> {
    return this.vehicleService.findOne(id);
  }
}
