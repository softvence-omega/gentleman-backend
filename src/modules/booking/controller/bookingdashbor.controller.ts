// dashboard.controller.ts

import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { DashboardService } from '../service/providerbooking.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('provider-summary')
  async getDashboard(@Req() req) {
    const providerId = req.user.id;
    const data = await this.dashboardService.getProviderDashboard(providerId);
    return {
      success: true,
      data,
    };
  }

  @Get('provider-today-schedule')
async getTodaySchedule(@Req() req) {
  const providerId = req.user.id;
  const data = await this.dashboardService.getTodaySchedule(providerId);
  return { success: true, data };
}






}




