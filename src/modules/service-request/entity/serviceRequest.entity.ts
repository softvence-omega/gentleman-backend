import { AbstractionEntity } from 'src/database/abstraction.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class ServiceRequestEntity extends AbstractionEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column('float')
  price: number;

  @ManyToOne(() => User, (user) => user.servicesRequest)
  provider: User;


  @OneToOne(() => bookingInfoEntity, (bookingInfoEntity) => bookingInfoEntity.servicesRequest)
  @JoinColumn()
  bookingInfo:bookingInfoEntity;

  

  constructor(entity?: Partial<ServiceRequestEntity>) {
    super();
    Object.assign(this, entity);
  }
}
