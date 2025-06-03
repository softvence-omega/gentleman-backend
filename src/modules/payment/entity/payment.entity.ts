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
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';

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


  
@OneToOne(() => bookingInfoEntity, (bookingInfoEntity) => bookingInfoEntity.serviceDetail)
@JoinColumn()
bookingInfo:bookingInfoEntity;


  @Column({ nullable: true })
  senderPaymentTransaction?: string;

   constructor(entity?: Partial<PaymentEntity>) {
    super();
    Object.assign(this, entity);
  }

 
}
