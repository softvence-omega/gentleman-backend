import { AbstractionEntity } from 'src/database/abstraction.entity';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

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
  vehicleImage: string;

 @ManyToOne(() => VehicleTypeEntity, (vehicleType) => vehicleType.vehicleTypes, { eager: false })
vehicleType: VehicleTypeEntity;


  constructor(entity?: Partial<VehicleEntity>) {
    super();
    Object.assign(this, entity);
  }
}
