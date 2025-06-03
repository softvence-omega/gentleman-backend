// src/modules/payment/payment.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './controller/payemnt.controller';
import { PaymentService } from './service/payment.service';
import { PaymentEntity } from './entity/payment.entity';
import { bookingInfoEntity } from '../bookingInfo/entity/bookingInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentEntity,bookingInfoEntity])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService,TypeOrmModule],
})
export class PaymentModule {}
