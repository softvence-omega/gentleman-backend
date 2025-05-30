import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class VehicleEntity extends AbstractionEntity {
  @Column()
  name: string;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: string;

  @Column()
  vhicalImage: string;

  constructor(entity?: Partial<VehicleEntity>) {
    super();
    Object.assign(this, entity);
  }
}
