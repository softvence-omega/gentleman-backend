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
import Booking from 'src/modules/booking/entity/booking.entity';
import { User } from 'src/modules/user/entities/user.entity';

@Entity()
export class PaymentEntity extends AbstractionEntity {

  @Column()
  amount: number;

  @Column({ nullable: true })
  transactionId: string

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




@Entity('withdrawals')
export class WithdrawalEntity extends AbstractionEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ nullable: true })
  stripeTransferId?: string;

  @ManyToOne(() => User, (user) => user.withdrawals, { onDelete: 'CASCADE' })
  user: User;

    @Column({ enum: ['pending', 'completed', 'failed'], default: 'pending' })
  status: 'pending' | 'completed' | 'failed'; 

  constructor(entity?: Partial<WithdrawalEntity>) {
    super();
    Object.assign(this, entity);
  }
}



