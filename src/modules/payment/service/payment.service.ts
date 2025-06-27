// src/modules/payment/payment.service.ts

import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  RawBodyRequest,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { Request } from 'express';
import { CreatePaymentDto } from '../dto/payment.dto';
import { PaymentStatus as mainPaymentStatus } from '../entity/payment.enum';
import { PaymentEntity, WithdrawalEntity } from '../entity/payment.entity';
import Booking, {
  PaymentStatus,
} from 'src/modules/booking/entity/booking.entity';
import { EmailService } from 'src/common/nodemailer/email.service';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(PaymentEntity)
    private paymentRepo: Repository<PaymentEntity>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    private emailService: EmailService,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(WithdrawalEntity)
    private readonly withdrawalRepo: Repository<WithdrawalEntity>,

     private readonly dataSource: DataSource,
  ) {
    this.stripe = new Stripe(
      this.configService.get('stripe_secret_key') as string,
    );
  }

  async createPayment(dto: CreatePaymentDto) {

  
    

    const {  bookingId } = dto;
    const booking = await this.bookingRepo.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

  

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    const userEmail = booking.user?.email;

    if (!userEmail) {
      throw new BadRequestException('User email not found for this booking');
    }
    const existingPayment = await this.paymentRepo.findOne({
      where: {
        booking: { id: bookingId },
      },
      relations: ['booking'],
    });

    if (existingPayment?.status === mainPaymentStatus.COMPLETED) {
      throw new BadRequestException('You have already completed the payment.');
    }

    let payment = await this.paymentRepo.findOne({
      where: {
        booking: { id: bookingId },
        status: mainPaymentStatus.PENDING,
      },
      relations: ['booking'],
    });

    if (!payment) {
      payment = this.paymentRepo.create({
        ...dto,
        amount: Number(booking.price),
        status: mainPaymentStatus.PENDING,
        booking,
      });

      await this.paymentRepo.save(payment);
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Instant Payment',
            },
            unit_amount: Number(booking.price) * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.get('client_url'),
      cancel_url: this.configService.get('client_url'),
      payment_intent_data: {
        metadata: {
          id: payment.id,
          bookingId,
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
    console.log(this.configService.get('stripe_webhook_secret') as string);
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

    if (event.type === 'payment_intent.succeeded') {
      await this.paymentRepo.update(metadata.id, {
        status: mainPaymentStatus.COMPLETED,
        senderPaymentTransaction: data.id,
      });
      await this.bookingRepo.update(metadata.bookingId, {
        paymentStatus: PaymentStatus.Completed,
      });

      const booking = await this.bookingRepo.findOne({
        where: { id: metadata.bookingId },
        relations: ['user'],
      });

      if (booking?.user?.email) {
        await this.emailService.sendEmail(
          booking.user.email,
          'Payment Successful',
          'Payment',
          `<p>Your payment for the booking <strong>${booking.title}</strong> has been successfully completed.</p>`,
        );
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      await this.paymentRepo.update(metadata.id, {
        status: mainPaymentStatus.CANCELLED,
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
      { status: mainPaymentStatus.REFUNDED },
    );
  }

  async refundPayment(apiId: string, userId: string) {
    const refund = await this.stripe.refunds.create({
      payment_intent: apiId,
    });

    return {
      message: 'Payment refunded successfully',
      refund,
    };
  }

  async getAllPayments(page: number, limit: number, order: 'ASC' | 'DESC') {
    const [data, total] = await this.paymentRepo.findAndCount({
      order: { createdAt: order },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['booking'], // optional: include related booking
    });

    return {
      total,
      page,
      limit,
      data,
    };
  }

  // async withdraw(userId: string, amount: number) {

  //   const provider = await this.userRepo.findOne({ where: { id: userId } });

  //   if (!provider) throw new BadRequestException('User not found');

    

  //   // Step 1: Check if user has enough internal balance
  //   if (provider.balance < amount) {
  //     throw new BadRequestException('Insufficient balance to withdraw');
  //   }

  //    console.log("hited satere 2")
  //   // Step 2: Ensure Stripe account exists
  //   if (!provider.stripeAccountId) {
  //     const account = await this.stripe.accounts.create({
  //       type: 'express',
  //       country: 'US',
  //       email: provider.email,
  //       capabilities: {
  //         transfers: { requested: true },
  //       },
  //     });

  //     provider.stripeAccountId = account.id;
  //     await this.userRepo.save(provider);
  //   }

  //   console.log("hited satere 3")

  //   // Step 3: (Optional) Check platform Stripe balance
  //   const balance = await this.stripe.balance.retrieve();
  //   const available = balance.available.find((b) => b.currency === 'usd');
  //   if (!available || available.amount < Math.floor(amount * 100)) {
  //     throw new BadRequestException('Platform Stripe balance is insufficient');
  //   }

  //    console.log("hited satere 3")
  //   // Step 4: Create transfer to provider's account
  //   const transfer = await this.stripe.transfers.create({
  //     amount: Math.floor(amount * 100),
  //     currency: 'usd',
  //     destination: provider.stripeAccountId,
  //     transfer_group: `withdrawal_${userId}_${Date.now()}`,
  //   });

  //   // Step 5: Deduct internal balance
  //   provider.balance -= amount;
  //   provider.lastWithdrawalId = transfer.id;
  //   await this.userRepo.save(provider);

  //   const withdrawal = this.withdrawalRepo.create({
  //     user: provider,
  //     amount,
  //     stripeTransferId: transfer.id,
  //   });

  //   await this.withdrawalRepo.save(withdrawal);

  //   return {
  //     message: 'Withdrawal successful',
  //     transferId: transfer.id,
  //     amount,
  //   };
  // }
 async withdraw(userId: string, amount: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 1: Lock user row to prevent race conditions
      const provider = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!provider) {
        throw new BadRequestException('User not found');
      }

      if (provider.role !== 'provider') {
        throw new BadRequestException('Only providers can withdraw');
      }

      if (provider.balance < amount) {
        throw new BadRequestException('Insufficient internal balance to withdraw');
      }

      // Step 2: Create Stripe account if missing
      if (!provider.stripeAccountId) {
        const account = await this.stripe.accounts.create({
          type: 'express',
          country: 'US',
          email: provider.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
        });

        provider.stripeAccountId = account.id;
        await queryRunner.manager.save(provider);
      }

      // Step 3: Check platform Stripe balance
      const balance = await this.stripe.balance.retrieve();
      const available = balance.available.find(b => b.currency === 'usd');
      if (!available || available.amount < Math.floor(amount * 100)) {
        throw new BadRequestException('Platform balance is insufficient');
      }

      // Step 4: Create initial withdrawal record (status: pending)
      const withdrawal = this.withdrawalRepo.create({
        user: provider,
        amount,
        status: 'pending',
      });
      await queryRunner.manager.save(withdrawal);

      // Step 5: Transfer funds to provider via Stripe
      const transfer = await this.stripe.transfers.create({
        amount: Math.floor(amount * 100), // in cents
        currency: 'usd',
        destination: provider.stripeAccountId,
        transfer_group: `withdrawal_${provider.id}_${withdrawal.id}`,
      });

      // Step 6: Deduct internal balance and finalize withdrawal
      provider.balance -= amount;
      provider.lastWithdrawalId = transfer.id;
      await queryRunner.manager.save(provider);

      withdrawal.stripeTransferId = transfer.id;
      withdrawal.status = 'completed';
      await queryRunner.manager.save(withdrawal);

      // ✅ Commit everything
      await queryRunner.commitTransaction();

      return {
        message: 'Withdrawal successful',
        transferId: transfer.id,
        withdrawalId: withdrawal.id,
        amount,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error('❌ Withdrawal failed:', err);
      throw new BadRequestException(err.message || 'Withdrawal failed');
    } finally {
      await queryRunner.release();
    }
  }
}
