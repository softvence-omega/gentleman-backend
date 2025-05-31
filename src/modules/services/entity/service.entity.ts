import { AbstractionEntity } from 'src/database/abstraction.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class ServiceEntity extends AbstractionEntity {
  @Column()
  title: string;

  @OneToMany(() => CategoryEntity, (category) => category.service)
  categories: CategoryEntity[];

  constructor(entity?: Partial<ServiceEntity>) {
    super();
    Object.assign(this, entity);
  }
}
