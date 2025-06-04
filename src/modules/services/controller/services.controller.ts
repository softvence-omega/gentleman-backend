import { Body, Controller, Get, HttpStatus, Param, Post, Query, Req, Res } from '@nestjs/common';
import { ServiceService } from '../service/services.service';
import { Response } from 'express';
import sendResponse from 'src/common/utils/sendResponse';
import { ServiceDto } from '../dto/service.dto';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/')
  async create(@Body() dto: ServiceDto,@Res() res:Response) {
    const data = await this.serviceService.createService(dto);
    return sendResponse(res,{
            statusCode:HttpStatus.OK,
            success:true,
            message: "service add successfully",
            data: data,
        });
  }

@Get('/')
async getAll(
  @Res() res: Response,
  @Query('limit') limit: string,
  @Query('page') page: string,
) {
  const limitNum = parseInt(limit) || 10;
  const pageNum = parseInt(page) || 1;

  const data = await this.serviceService.getAllService(limitNum, pageNum);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: "Services fetched successfully",
    data: data,
  });
}

@Get(':id')
async getOne(@Param('id') id: string, @Res() res: Response) {
  const service = await this.serviceService.getSingleService(id);

  return sendResponse(res, {
    statusCode: HttpStatus.OK,
    success: true,
    message: 'Single service fetched successfully',
    data: service,
  });
}


}
