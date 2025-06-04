// src/modules/payment/payment.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PaymentStatus } from './payment.enum';
import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';

@Entity()
export class PaymentEntity extends AbstractionEntity {

  @Column()
  amount: number;

  @Column({nullable:true})
  transactionId:string

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;


@OneToOne(() => Booking, (booking) => booking.payment)
@JoinColumn()
booking: Booking;


  @Column({ nullable: true })
  senderPaymentTransaction?: string;

   constructor(entity?: Partial<PaymentEntity>) {
    super();
    Object.assign(this, entity);
  }

 
}
