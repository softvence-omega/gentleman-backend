import { AbstractionEntity } from 'src/database/abstraction.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class ServiceDetailEntity extends AbstractionEntity {
  @Column()
  description: string;

  @Column()
  dentImg: string;

  @Column()
  desireDate: Date;

  @OneToOne(() => Location, (location) => location.serviceDetail, {
    cascade: true,
  })
  @JoinColumn()
  @JoinColumn({ name: 'locationId' })
  location: Location;

  @Column()
  locationId: string;


  @OneToOne(() => bookingInfoEntity, (bookingInfoEntity) => bookingInfoEntity.serviceDetail)
  @JoinColumn()
  bookingInfo:bookingInfoEntity;

  constructor(entity?: Partial<ServiceDetailEntity>) {
    super();
    Object.assign(this, entity);
  }
}
