import { AbstractionEntity } from 'src/database/abstraction.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

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

@OneToOne(() => bookingInfoEntity, (bookingInfoEntity) => bookingInfoEntity.vehicle)
@JoinColumn()
bookingInfo:bookingInfoEntity;




  constructor(entity?: Partial<VehicleEntity>) {
    super();
    Object.assign(this, entity);
  }
}
