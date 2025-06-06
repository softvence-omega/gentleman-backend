import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Review } from 'src/modules/review/enitity/review.entity';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';

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
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Pending })
  status: BookingStatus;

  @Column({ type: 'enum', enum: BookingWorkStatus, default: BookingWorkStatus.Booked })
  workStatus: BookingWorkStatus;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  model?: string;

  @Column({ type: 'date', nullable: true })
  year?: Date;

  @Column({ nullable: true })
  vehicleImage?: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @Column()
  DetailsDescription: string;

  @Column()
  dentImg: string;

  @Column()
  desireDate: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;


  @OneToOne(() => VehicleTypeEntity)
  @JoinColumn({ name: 'vehicleTypesId' })
  vehicleType: VehicleTypeEntity;


  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'providerId' })
  provider: User;

  @OneToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @OneToOne(() => PaymentEntity, (payment) => payment.booking, { cascade: true })
  payment: PaymentEntity;






  @OneToMany(() => Review, (review) => review.booking, { cascade: true, lazy: true })
  reviews: Promise<Review[]>;
}
