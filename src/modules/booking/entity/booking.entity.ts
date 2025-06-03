import { AbstractionEntity } from 'src/database/abstraction.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';
import { Review } from 'src/modules/review/enitity/review.entity';
import { Column, Entity, JoinColumn, OneToOne, OneToMany } from 'typeorm';

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

  @OneToOne(() => bookingInfoEntity, (bookingInfoEntity) => bookingInfoEntity.booking)
  @JoinColumn()
  bookingInfo: bookingInfoEntity;

  @Column({
    type: 'enum',
    enum: BookingWorkStatus,
    default: BookingWorkStatus.Booked,
  })
  workStatus: BookingWorkStatus;

  @OneToMany(() => Review, (review) => review.booking)
  reviews: Review[];
}
