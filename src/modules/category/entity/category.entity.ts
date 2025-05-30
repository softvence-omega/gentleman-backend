import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class CategoryEntity extends AbstractionEntity {
  @Column()
  title: string;

  constructor(entity?: Partial<CategoryEntity>) {
    super();
    Object.assign(this, entity);
  }
}
