import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { sendResponse } from 'src/common/utils/sendResponse';
import { ServiceDto } from '../dto/ service.dto';
import { ServiceService } from '../service/services.service';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post('/')
  async create(@Body() dto: ServiceDto) {
    const data = await this.serviceService.createService(dto);
    return sendResponse({
      message: 'Service created successfully',
      statusCode: 201,
      data,
    });
  }

  @Get('/:id')
  async getById(@Param('id') id: string) {
    const data = await this.serviceService.getServiceById(id);
    return sendResponse({
      message: 'Service fetched successfully',
      statusCode: 200,
      data,
    });
  }
}
