import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ServiceDetail } from '../service/service.service';
import { ServiceDetailDto } from '../dto/serviceDetail.dto';
import sendResponse from 'src/common/utils/sendResponse';
import { Response } from 'express';

@Controller('serviceDetails')
export class ServiceDetailController {
  constructor(private readonly serviceDetail: ServiceDetail) {}
  @Post('/')
  async create(@Body() dto: ServiceDetailDto,@Res() res:Response) {
    const data = await this.serviceDetail.createServiceDetail(dto)
     console.log(data)
    return sendResponse(res,{
            statusCode:HttpStatus.OK,
            success:true,
            message: 'Service detail created successfully',
            data
        });
  }
}
