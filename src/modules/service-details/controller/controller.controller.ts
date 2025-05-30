import { Body, Controller, Post } from '@nestjs/common';
import { sendResponse } from 'src/common/utils/sendResponse';
import { ServiceDetail } from '../service/service.service';
import { ServiceDetailDto } from '../dto/serviceDetail.dto';

@Controller('serviceDetails')
export class ServiceDetailController {
  constructor(private readonly serviceDetail: ServiceDetail) {}
  @Post('/')
  async create(@Body() dto: ServiceDetailDto) {
    return sendResponse({
      message: 'Service details created successfully',
      statusCode: 201,
      data: await this.serviceDetail.createServiceDetail(dto),
    });
  }
}
