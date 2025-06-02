import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res } from '@nestjs/common';
import { ServiceDto } from '../dto/ service.dto';
import { ServiceService } from '../service/services.service';
import { Response } from 'express';
import sendResponse from 'src/common/utils/sendResponse';

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

  @Get('/:id')
  async getById(@Param('id') id: string ,@Res() res:Response) {
    const data = await this.serviceService.getServiceById(id);
    return sendResponse(res,{
        statusCode:HttpStatus.OK,       
        success:true,
        message: "services successfully",
        data: data
    });
  }
}
