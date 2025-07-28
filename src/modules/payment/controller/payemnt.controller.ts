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
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { CreatePaymentDto, WithdrawDto } from '../dto/payment.dto';
import { PaymentService } from '../service/payment.service';
import Stripe from 'stripe';
import sendResponse from 'src/common/utils/sendResponse';
import { Response } from 'express';
import { Public } from 'src/common/utils/public.decorator';
import { ApiQuery } from '@nestjs/swagger';
import { PaymentStatus } from '../entity/payment.enum';
import { RefundDto } from '../dto/refund.dto';


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




  @Patch('refund')
async handleRefund(
  @Body() dto: RefundDto,
  @Res() res: Response,
) {
  try {
    const data = await this.paymentService.refund(dto);

    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Refund processed successfully',
      data,
    });
  } catch (error) {
    return sendResponse(res, {
      statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: error.message || 'Refund failed',
      data: null,
    });
  }
}


@Get('all')
  async getAllPayments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('status') status?: PaymentStatus,
    @Query('minAmount') minAmount?: number,
    @Query('maxAmount') maxAmount?: number,
    @Query('updatedDate') updatedDate?: string,
    @Query('serviceTitle') serviceTitle?: string,
  ) {
    const filters = {
      status,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      updatedDate: updatedDate ? new Date(updatedDate) : undefined,
      serviceTitle,
    };

    return await this.paymentService.getAllPayments(page, limit, order, filters);
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
