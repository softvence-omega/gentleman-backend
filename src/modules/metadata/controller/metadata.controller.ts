import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { MetadataService } from '../service/metadata.service';
import sendResponse from 'src/common/utils/sendResponse';

@Controller('metadata')
export class MetadataController {
  constructor(private metadataService: MetadataService) {}

  @Get('metrics')
  async getDashboardMetrics(@Res() res: Response) {
    const data = await this.metadataService.getDashboardMetrics();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Dashboard metrics fetched successfully',
      data,
    });
  }

  @Get('/stats/monthly')
  async getMonthlyStats(@Res() res: Response) {
    const data = await this.metadataService.getMonthlyBookingStats();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Monthly bookings retrieved successfully',
      data,
    });
  }
}
