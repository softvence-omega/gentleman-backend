import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractionEntity } from 'src/database/abstraction.entity';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';
import Review from 'src/modules/review/enitity/review.entity';
import { VehicleEntity } from 'src/modules/vehicle/entity/vehicle.entity';
import { Report } from 'src/modules/report/entity/report.entity';

export enum BookingStatus {
  Pending = 'Pending',
  Accept = 'Accept',
  Reject = 'Reject',
  Completed = 'Completed'
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
  Refund = "Refund"
}

@Entity('booking')
class Booking extends AbstractionEntity {
  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  paymentStatus: PaymentStatus;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.Pending })
  status: BookingStatus;

  @Column({ type: 'enum', enum: BookingWorkStatus, default: BookingWorkStatus.Booked })
  workStatus: BookingWorkStatus;



  @Column({ nullable: true })
  vehicleImage?: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: string;

  @Column({ nullable: true })
  DetailsDescription: string;

  @Column('text', { array: true, nullable: true })
  dentImg: string[];

  @Column()
  desireDate: string;

  @Column()
  longitude: string;

  @Column()
  latitude: string;



  @ManyToOne(() => VehicleTypeEntity, { nullable: true })
  @JoinColumn({ name: 'vehicleTypesId' })
  vehicleType: VehicleTypeEntity;



  @ManyToOne(() => User, (user) => user.bookings, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;


  @ManyToOne(() => User, (user) => user.providedBookings)
  @JoinColumn({ name: 'providerId' })
  provider: User;


  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;


  @OneToOne(() => PaymentEntity, (payment) => payment.booking, { cascade: true })
  payment: PaymentEntity;

  @OneToMany(() => Review, (review) => review.booking, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Report, (report) => report.booking)
  reports: Report[];


  @ManyToOne(() => VehicleEntity, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: VehicleEntity;

}

export default Booking;