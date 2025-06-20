import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { DashboardService } from '../service/providerbooking.service';
import { HttpStatus } from '@nestjs/common';
import sendResponse from 'src/common/utils/sendResponse';
import { BookingService } from '../service/booking.service';

@Controller('dashboard')
export class DashboardController {
  constructor(
    private dashboardService: DashboardService,
    private readonly bookingService: BookingService
  ) {}

  @Get('provider-summary')
  async getDashboard(@Req() req, @Res() res: Response) {
    const providerId = req.user.id;
    const data = await this.dashboardService.getProviderDashboard(providerId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Provider dashboard summary fetched successfully',
      data,
    });
  }

  @Get('provider-today-schedule')
  async getTodaySchedule(@Req() req, @Res() res: Response) {
    const providerId = req.user.id;
    // const data = await this.dashboardService.getTodaySchedule(providerId);
    const data = await this.bookingService.getAllBookings(1, 10, 'ASC');
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Today\'s schedule fetched successfully',
      data,
    });
  }

  @Get('summary/paymentAndBooking')
  async getDashboardSummary(@Res() res: Response) {
    const data = await this.dashboardService.getDashboardSummary();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Payment and booking summary fetched successfully',
      data,
    });
  }

  @Get('allBooking')
  async getAllBookings(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Res() res: Response,
  ) {
    const data = await this.dashboardService.getAllBookings(+page, +limit, order);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All bookings fetched successfully',
      data,
    });
  }

  @Get('/chart/service-distribution')
  async getServiceDistribution(@Res() res: Response) {
    const data = await this.dashboardService.getServiceDistribution();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Service distribution fetched successfully',
      data,
    });
  }
}
