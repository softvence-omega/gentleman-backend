import { Controller, Post, Body, Get } from '@nestjs/common';import { CreateVehicleTypeDto } from '../dto/vehicleTypes.dto';
import { VehicleTypeService } from '../services/vehicleTypes.services';
;

@Controller('vehicleTypes')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post()
  create(@Body() dto: CreateVehicleTypeDto) {
    return this.vehicleTypeService.createVehicleType(dto);
  }

  @Get()
  findAll() {
    return this.vehicleTypeService.findAll();
  }
}
