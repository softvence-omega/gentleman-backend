// src/modules/payment/payment.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  RawBodyRequest,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { Request } from 'express';
import { CreatePaymentDto } from '../dto/payment.dto';
import { PaymentStatus } from '../entity/payment.enum';
import { PaymentEntity } from '../entity/payment.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
      @InjectRepository(bookingInfoEntity)
    private readonly bookingInfoRepo: Repository<bookingInfoEntity>,
  ) {
    this.stripe = new Stripe(
      this.configService.get('stripe_secret_key') as string,
    );
  }

  async createPayment(dto: CreatePaymentDto) {

     
    const { amount,email } = dto;

    const bookingInfo = await this.bookingInfoRepo.findOne({
      where: { id: ''},
    });

    if (!bookingInfo) {
      throw new NotFoundException('Booking Info not found');
    }


    

    const payment = this.paymentRepo.create({
      ...dto,
      status: PaymentStatus.PENDING,
      bookingInfo
    });

    await this.paymentRepo.save(payment);

    

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Instant Payment',
            },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.get('client_url'),
      cancel_url: this.configService.get('client_url'),
      payment_intent_data: {
        metadata: {
         
        },
      },
    });
     
    if (!session?.url)
      throw new BadRequestException('Stripe session creation failed');

    return { url: session.url };
  }

  async handleWebhook(req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    const rawBody = req.rawBody;

if (!rawBody) {
  throw new BadRequestException('No webhook payload was provided.');
}

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.configService.get('stripe_webhook_secret') as string,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    const data = event.data.object as Stripe.PaymentIntent;
    const metadata = data.metadata;
    console.log(data)
    if (event.type === 'payment_intent.succeeded') {
      await this.paymentRepo.update(data.id, {
        status: PaymentStatus.COMPLETED,
        senderPaymentTransaction: data.id,
      });
      console.log('Payment succeeded:', data.id);
    }

    if (event.type === 'payment_intent.payment_failed') {
      await this.paymentRepo.update(metadata.transactionId, {
        status: PaymentStatus.CANCELLED,
      });
    }

    return { received: true, type: event.type };
  }

  async refund(paymentIntentId: string) {
    const paymentIntent =
      await this.stripe.paymentIntents.retrieve(paymentIntentId);
    const refundAmount = Math.round(paymentIntent.amount * 0.95);

    const refund = await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: refundAmount,
    });

    if (!refund) throw new BadRequestException('Refund failed');

    return this.paymentRepo.update(
      { senderPaymentTransaction: paymentIntentId },
      { status: PaymentStatus.REFUNDED },
    );
  }

  async getUserPayments(userId: string) {
    const payments = await this.paymentRepo.find({
    //   where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    return { payments, totalAmount };
  }
}
