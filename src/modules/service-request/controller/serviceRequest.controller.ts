import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { ServiceRequestService } from '../service/serviceRequest.service';
import { ServiceRequestDto } from '../dto/serviceRequest.dto';
import sendResponse from 'src/common/utils/sendResponse';
import { Response } from 'express';

@Controller('serviceRequests')
export class ServiceRequestController {
  constructor(private readonly serviceRequestService: ServiceRequestService) {}

  @Post('/')
  async create(@Body() dto: ServiceRequestDto, @Res() res:Response) {
    const data = await this.serviceRequestService.createServiceRequest(dto);
    return sendResponse(res,{
            statusCode:HttpStatus.OK,
            success:true,
            message: "refund money succfully",
            data: data      
        });
  }
}
