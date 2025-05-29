import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { sendResponse } from './common/utils/sendResponse';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return sendResponse({
      statusCode: 200,
      success: true,
      message: 'Welcome to the Service Marketplace API',
      data: this.appService.getHello(),
    });
  }
}
