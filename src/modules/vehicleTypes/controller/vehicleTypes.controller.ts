import { Controller, Post, Body, Get, UseInterceptors, UploadedFile } from '@nestjs/common';import { CreateVehicleTypeDto } from '../dto/vehicleTypes.dto';
import { VehicleTypeService } from '../services/vehicleTypes.services';
import { FileInterceptor } from '@nestjs/platform-express';
;

@Controller('vehicleTypes')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post()
  @UseInterceptors(FileInterceptor("icon"))
  create(@Body() dto: CreateVehicleTypeDto, @UploadedFile() file: Express.Multer.File,) {
    return this.vehicleTypeService.createVehicleType(dto , file);
  }

  @Get()
  findAll() {
    return this.vehicleTypeService.findAll();
  }
}
