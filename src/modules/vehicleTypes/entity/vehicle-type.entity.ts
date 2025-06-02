import { AbstractionEntity } from 'src/database/abstraction.entity';
import { VehicleEntity } from 'src/modules/vehicle/entity/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class VehicleTypeEntity extends AbstractionEntity {

  @Column()
  name: string;

  @Column()
  icon: string;

    @OneToMany(() => VehicleTypeEntity, (vehicleTypeEntity) => vehicleTypeEntity.vehicleTypes )
    vehicleTypes: VehicleTypeEntity[]

 constructor(entity?: Partial<VehicleTypeEntity>) {
    super();
    Object.assign(this, entity);
  }
}
