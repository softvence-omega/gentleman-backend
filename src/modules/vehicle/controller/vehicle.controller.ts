import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { VehicleService } from '../service/vehicle.service';
import { VehicleDto } from '../dto/vehicle.dto';
import sendResponse from 'src/common/utils/sendResponse';
import { FileInterceptor } from '@nestjs/platform-express';



@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post()
@UseInterceptors(FileInterceptor("vehicles"))
async create(
  @Body() dto: VehicleDto,
  @Req() req,
  @Res() res,
  @UploadedFile() file: Express.Multer.File
) {
  const userId = req.user.userId;
  const data = await this.vehicleService.createVehicle(userId, dto, file);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Vehicle created successfully",
    data
  });
}

  
  @Get()
  async getAllVehicles(@Req() req, @Res() res): Promise<void> {
     const userId = req.user.id;
    const vehicles = await this.vehicleService.getAllVehicles(userId);

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Vehicles fetched successfully',
      data: vehicles,
    });
  }
}