import { Controller, Get } from '@nestjs/common';
import { MetadataService } from '../service/metadata.service';
import { BookingService } from 'src/modules/booking/service/booking.service';

@Controller('metadata')
export class MetadataController {
  constructor(
    private metadataService: MetadataService ,
) {}
  @Get('metrics')
  async getDashboardMetrics() {
    return this.metadataService.getDashboardMetrics();
  }

  @Get('/stats/monthly')
  async getMonthlyStats() {
    const data = await this.metadataService.getMonthlyBookingStats();

    return {
      message: 'Monthly bookings retrieved successfully',
      data,
    };
  }
}
