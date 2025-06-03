import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Column, Entity } from 'typeorm';

export enum BookingStatus {
  Pending = 'Pending',
  Accept = 'Accept',
  Reject = 'Reject',
}

export enum BookingWorkStatus {
  Booked = 'Booked',
  OnTheWay = 'OnTheWay',
  Started = 'Started',
  Completed = 'Completed',
}

export enum PaymentStatus {
  Pending = 'Pending',
  Cancel = 'Cancel',
  Completed = 'Completed',
}

@Entity('booking')
export class Booking extends AbstractionEntity {
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.Pending,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.Pending,
  })
  status: BookingStatus;

  @Column({
    type: 'enum',
    enum: BookingWorkStatus,
    default: BookingWorkStatus.Booked,
  })
  workStatus: BookingWorkStatus;
}
