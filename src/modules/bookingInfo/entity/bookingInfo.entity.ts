import { AbstractionEntity } from 'src/database/abstraction.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class bookingInfoEntity extends AbstractionEntity {
  
    @OneToOne(() => CategoryEntity, (categoryEntity) => categoryEntity,{cascade:true})
    @JoinColumn()
    category:CategoryEntity

  constructor(entity?: Partial<bookingInfoEntity>) {
    super();
    Object.assign(this, entity);
  }
}
   