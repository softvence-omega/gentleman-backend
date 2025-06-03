import { AbstractionEntity } from 'src/database/abstraction.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';
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
    eager:true
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  @OneToOne(() => bookingInfoEntity , (bookingInfoEntity) => bookingInfoEntity.category  )
  @JoinColumn()
  bookingInfo:bookingInfoEntity

  constructor(entity?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, entity);
  }
}
