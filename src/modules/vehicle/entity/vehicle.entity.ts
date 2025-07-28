import { AbstractionEntity } from 'src/database/abstraction.entity';
import Booking from 'src/modules/booking/entity/booking.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class VehicleEntity extends AbstractionEntity {
  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  vehicleImage: string
  @ManyToOne(() => User, (user) => user.vehicles, { cascade: true })
  @JoinColumn({ name: 'userId' })
  user: User;


  @OneToOne(() => Booking, (booking) => booking.vehicle)
  booking: Booking;



  constructor(entity?: Partial<VehicleEntity>) {
    super();
    Object.assign(this, entity);
  }
}