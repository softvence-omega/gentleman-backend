import { AbstractionEntity } from 'src/database/abstraction.entity';
import Booking from 'src/modules/booking/entity/booking.entity';
import { WithdrawalEntity } from 'src/modules/payment/entity/payment.entity';
import { Report } from 'src/modules/report/entity/report.entity';
import { VehicleEntity } from 'src/modules/vehicle/entity/vehicle.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends AbstractionEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ enum: ['customer', 'provider', 'admin'], default: 'customer' })
  role?: string;

  @Column({ nullable: true })
  otp?: string;

  @Column({ nullable: true })
  serviceCategoryId?: string;

  @Column({ nullable: true })
  workShopName?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ nullable: true })
  certificate?: string;

  @Column({ nullable: true })
  longitude?: string;

  @Column({ nullable: true })
  latitude?: string;

  @Column({ nullable: true })
  specialist?: string;

  

  @Column({ enum: ['blocked', 'active', 'inactive'], default: 'inactive' })
  status: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  stripeAccountId: string;

  @Column({ nullable: true })
  country: string;

 @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, nullable: true })
 balance: number;

  @Column({ nullable: true })
  lastWithdrawalId: string

  @OneToMany(() => VehicleEntity, (vehicle) => vehicle.user)
vehicles: VehicleEntity[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.provider)
  providedBookings: Booking[];


  @OneToMany(() => WithdrawalEntity, (withdrawal) => withdrawal.user)
  withdrawals: WithdrawalEntity[];

   @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  



  constructor(entity?: Partial<User>) {
    super();
    Object.assign(this, entity);
  }
}
