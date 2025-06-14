import { AbstractionEntity } from 'src/database/abstraction.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class ServiceEntity extends AbstractionEntity {
  @Column({ unique: true })
  title: string;
  @Column()
  icon:string;

  @OneToMany(() => CategoryEntity, (category) => category.service)
  categories: CategoryEntity[];

  constructor(entity?: Partial<ServiceEntity>) {
    super();
    Object.assign(this, entity);
  }
}
