import { AbstractionEntity } from 'src/database/abstraction.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';
import { VehicleEntity } from 'src/modules/vehicle/entity/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity()
export class VehicleTypeEntity extends AbstractionEntity {

  @Column()
  name: string;

  @Column()
  icon: string;

    @OneToMany(() => VehicleTypeEntity, (vehicleTypeEntity) => vehicleTypeEntity.vehicleTypes )
    vehicleTypes: VehicleTypeEntity[]

    @OneToOne(()=> bookingInfoEntity,(bookingInfoEntity) => bookingInfoEntity.vehicleTypes )
    @JoinColumn()
    bookingInfo: bookingInfoEntity
    

 constructor(entity?: Partial<VehicleTypeEntity>) {
    super();
    Object.assign(this, entity);
  }
}
