import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class CategoryEntity extends AbstractionEntity {
  @Column()
  title: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, (service) => service.categories, {
    nullable: false,
    eager: true
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @OneToOne(() => Booking, (booking) => booking.category)
  @JoinColumn()
  booking: Booking


  constructor(entity?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, entity);
  }
}
