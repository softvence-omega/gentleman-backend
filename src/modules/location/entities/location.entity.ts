// src/location/entities/location.entity.ts
import { AbstractionEntity } from 'src/database/abstraction.entity';
import { ServiceDetailEntity } from 'src/modules/service-details/entity/serviceDetail.entity';
import { Entity, Column, OneToOne } from 'typeorm';

@Entity()
export class Location extends AbstractionEntity {
  @Column('decimal', { precision: 9, scale: 6 })
  latitude: number;

  @Column('decimal', { precision: 9, scale: 6 })
  longitude: number;
  @OneToOne(
    () => ServiceDetailEntity,
    (serviceDetail) => serviceDetail.location,
  )
  serviceDetail: ServiceDetailEntity;
}
