import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
<<<<<<< HEAD
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
=======
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
>>>>>>> 542046d911ca84ba48d2fa2bc4a1eb732bbd6cbe

@Entity()
export class CategoryEntity extends AbstractionEntity {
  @Column()
  title: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, (service) => service.categories, {
    nullable: false,
    eager:true
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

<<<<<<< HEAD
  @OneToOne(()=> Booking , (booking) => booking.category )
      @JoinColumn()
      booking:Booking
=======
@OneToMany(() => Booking, (booking) => booking.category)
bookings: Booking[];
>>>>>>> 542046d911ca84ba48d2fa2bc4a1eb732bbd6cbe


  constructor(entity?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, entity);
  }
}
