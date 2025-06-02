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
} from '@nestjs/common';
import { Request } from 'express';
import { sendResponse } from 'src/common/utils/sendResponse';
import { CreatePaymentDto } from '../dto/payment.dto';
import { PaymentService } from '../service/payment.service';
import Stripe from 'stripe';


@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('/')
  create(@Body() dto: CreatePaymentDto) {
    // For demo/test purposes: pass dummy user object or fetch from context/session manually
    return this.paymentService.createPayment(dto);
  }

  @Post('/webhook')
  async webhook(@Headers('stripe-signature') signature: string, @Req() req: RawBodyRequest<Request>) {
    return this.paymentService.handleWebhook(req);
  }



  @Post('/refund/:paymentIntentId')
  refund(@Param('paymentIntentId') id: string) {
    return  sendResponse({
        data: this.paymentService.refund(id),
        statusCode: 200,
        message: 'Refund initiated successfully',
    })
  }
}
