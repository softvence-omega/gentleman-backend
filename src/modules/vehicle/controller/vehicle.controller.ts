import { Body, Controller, Get, HttpStatus, Param, Post, Res } from '@nestjs/common';
import { VehicleService } from '../service/vehicle.service';
import { VehicleDto } from '../dto/vehicle.dto';
import { Response } from 'express';
import sendResponse from 'src/common/utils/sendResponse';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post('/')
  async create(@Body() dto: VehicleDto ,@Res() res:Response) {
    const data = await this.vehicleService.createVehicle(dto);
    return sendResponse(res,{
            statusCode:HttpStatus.OK,
            success:true,
            message: "refund money succfully",
            data: data
        })
  }

  @Get('/:id')
  async getById(@Param('id') id: string,@Res() res:Response) {
    const data = await this.vehicleService.getVehicleById(id);
    return sendResponse(res,{
        statusCode:HttpStatus.OK,
        success:true,
        message: "successfully get vehicle data",
        data: data
    });
  }
}
