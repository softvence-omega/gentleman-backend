// src/modules/payment/payment.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controller/payemnt.controller';
import { PaymentService } from './service/payment.service';
import { PaymentEntity, WithdrawalEntity } from './entity/payment.entity';
import Booking from '../booking/entity/booking.entity';
import { EmailModule } from 'src/common/nodemailer/email.module';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity, Booking,User,WithdrawalEntity]), EmailModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService, TypeOrmModule],
})
export class PaymentModule { }
