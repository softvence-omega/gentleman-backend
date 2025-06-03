import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bookingInfoEntity } from './entity/bookingInfo.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { VehicleTypeEntity } from '../vehicleTypes/entity/vehicle-type.entity';
import { ServiceDetailEntity } from '../service-details/entity/serviceDetail.entity';
import { ServiceRequestEntity } from '../service-request/entity/serviceRequest.entity';
import { PaymentEntity } from '../payment/entity/payment.entity';
import { BookingInfoService } from './services/booking.servicer';

@Module({
   providers: [BookingInfoService],
  imports: [TypeOrmModule.forFeature([bookingInfoEntity,
    CategoryEntity,
    VehicleTypeEntity,
    ServiceDetailEntity,
    ServiceRequestEntity,
    PaymentEntity,
    bookingInfoEntity,

])],
  exports:[TypeOrmModule,BookingInfoService]
})
export class BookingModule {}
