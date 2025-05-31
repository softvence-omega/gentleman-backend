import { AbstractionEntity } from 'src/database/abstraction.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class CategoryEntity extends AbstractionEntity {
  @Column()
  title: string;

  @Column()
  serviceId: string;

  @ManyToOne(() => ServiceEntity, (service) => service.categories, {
    nullable: false,
  })
  @JoinColumn({ name: 'serviceId' })
  service: ServiceEntity;

  constructor(entity?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, entity);
  }
}
