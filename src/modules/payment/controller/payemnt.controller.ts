// src/modules/payment/payment.controller.ts

import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Param,
  Headers,
  RawBodyRequest,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { CreatePaymentDto, WithdrawDto } from '../dto/payment.dto';
import { PaymentService } from '../service/payment.service';
import Stripe from 'stripe';
import sendResponse from 'src/common/utils/sendResponse';
import { Response } from 'express';
import { Public } from 'src/common/utils/public.decorator';


@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

 @Post('/')
  async create(@Body() dto: CreatePaymentDto, @Res() res: Response) {
     console.log('data',dto);
    const data = await this.paymentService.createPayment(dto);
    
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Payment created successfully',
      data,
    });
  }
  
  @Public()
  @Post('/webhook')
  async webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    return this.paymentService.handleWebhook(req);
  }



  @Post('/refund/:paymentIntentId')
  async refund(@Param('paymentIntentId') id: string, @Res() res: Response) {
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: "refund money succfully",
      data: this.paymentService.refund(id),
    })
  }

  @Get('all')
  async getAllPayments(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Res() res: Response,
  ) {
    const data = await this.paymentService.getAllPayments(+page, +limit, order);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All payments fetched successfully',
      data,
    });
  }


  @Post("withdraw")
  async withdraw(@Body() dto: WithdrawDto, @Req() req, @Res() res:Response) {

    const userId = req.user.userId;
    const data = await this.paymentService.withdraw(userId, dto.amount);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'successfully withdrawed',
      data,
    });
   
  }
}
