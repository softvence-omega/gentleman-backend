import { Body, Controller, Post } from '@nestjs/common';
import { sendResponse } from 'src/common/utils/sendResponse';
import { ServiceRequestService } from '../service/serviceRequest.service';
import { ServiceRequestDto } from '../dto/serviceRequest.dto';

@Controller('serviceRequests')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post('/')
  async create(@Body() dto: ServiceRequestDto) {
    const data = await this.serviceRequestService.createServiceRequest(dto);
    return sendResponse({
      message: 'Service request created successfully',
      statusCode: 201,
      data,
    });
  }
}
