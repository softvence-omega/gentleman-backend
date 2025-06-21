import { AbstractionEntity } from 'src/database/abstraction.entity';
import Booking from 'src/modules/booking/entity/booking.entity';
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

  @Column({ enum: ['blocked', 'active', 'inactive'], default: 'inactive' })
  status: string;

  @Column({ default: false })
  email_verified: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];

  @OneToMany(() => Booking, (booking) => booking.provider)
  providedBookings: Booking[];

  



  constructor(entity?: Partial<User>) {
    super();
    Object.assign(this, entity);
  }
}
