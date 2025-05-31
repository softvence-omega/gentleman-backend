import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class ServiceRequestEntity extends AbstractionEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  constructor(entity?: Partial<ServiceRequestEntity>) {
    super();
    Object.assign(this, entity);
  }
}
