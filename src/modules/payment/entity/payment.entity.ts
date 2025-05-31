// src/modules/payment/payment.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { PaymentStatus } from './payment.enum';
import { AbstractionEntity } from 'src/database/abstraction.entity';

@Entity()
export class PaymentEntity extends AbstractionEntity {

  @Column()
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

//   @Column()
//   bookingId: string;

//   @ManyToOne(() => User, (user) => user.payments)
//   user: User;

  @Column({ nullable: true })
  senderPaymentTransaction?: string;

   constructor(entity?: Partial<PaymentEntity>) {
    super();
    Object.assign(this, entity);
  }

 
}
