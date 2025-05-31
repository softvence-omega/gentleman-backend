import { AbstractionEntity } from 'src/database/abstraction.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CategoryEntity extends AbstractionEntity {
  @Column()
  title: string;
  @ManyToOne(() => ServiceEntity, (service) => service.categories, {
    nullable: false,
  })
  service: ServiceEntity;

  constructor(entity?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, entity);
  }
}
