import { AbstractionEntity } from 'src/database/abstraction.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';
import { ServiceDetailEntity } from 'src/modules/service-details/entity/serviceDetail.entity';
import { ServiceRequestEntity } from 'src/modules/service-request/entity/serviceRequest.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity()
export class bookingInfoEntity extends AbstractionEntity {


  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid', nullable: true })
  providerId?: string;

  
  
    @OneToOne(() => CategoryEntity, (categoryEntity) => categoryEntity,{cascade:true})
    @JoinColumn()
    category:CategoryEntity

    @OneToOne( () => VehicleTypeEntity, (vehicleTypeEntity) => vehicleTypeEntity.bookingInfo)
    @JoinColumn()
    vehicleTypes: VehicleTypeEntity

    @OneToOne( () => VehicleTypeEntity, (vehicleEntity) => vehicleEntity.bookingInfo)
    @JoinColumn()
     vehicle: VehicleTypeEntity

     @OneToOne (() =>ServiceDetailEntity, (serviceDetailEntity) => serviceDetailEntity.bookingInfo )
     @JoinColumn()
     serviceDetail:ServiceDetailEntity

     @OneToOne (() =>ServiceRequestEntity, (ServiceRequestEntity) => ServiceRequestEntity.bookingInfo )
     @JoinColumn()
     servicesRequest:ServiceRequestEntity

     @OneToOne (() =>PaymentEntity, (paymentEntity) => paymentEntity.bookingInfo)
     @JoinColumn()
     payment:ServiceRequestEntity

     @OneToOne (() => Booking , (bookingEntity) => bookingEntity.bookingInfo)
     @JoinColumn()
     booking:ServiceRequestEntity

    

  constructor(entity?: Partial<bookingInfoEntity>) {
    super();
    Object.assign(this, entity);
  }
}
   