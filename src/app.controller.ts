import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import sendResponse from './common/utils/sendResponse';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res: Response) {
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Server is running successfully',
      data: "",
    });
  }
}
