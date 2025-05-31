import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { sendResponse } from 'src/common/utils/sendResponse';
import { VehicleService } from '../service/vehicle.service';
import { VehicleDto } from '../dto/vehicle.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/')
  async create(@Body() dto: VehicleDto) {
    const data = await this.vehicleService.createVehicle(dto);
    return sendResponse({
      message: 'Vehicle created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const data = await this.vehicleService.getVehicleById(id);
    return sendResponse({
      message: 'Vehicle fetched successfully',
      statusCode: 200,
      data,
    });
  }
}
