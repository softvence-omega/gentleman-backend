import {
  Controller,
  Post,
  Body,
  Get,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { CreateVehicleTypeDto } from '../dto/vehicleTypes.dto';
import { VehicleTypeService } from '../services/vehicleTypes.services';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import sendResponse from 'src/common/utils/sendResponse';

@Controller('vehicleTypes')
export class VehicleTypeController {
  constructor(private readonly vehicleTypeService: VehicleTypeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('icon'))
  async create(
    @Body() dto: CreateVehicleTypeDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const data = await this.vehicleTypeService.createVehicleType(dto, file);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Vehicle type created successfully',
      data,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.vehicleTypeService.findAll();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All vehicle types fetched successfully',
      data,
    });
  }
}
