import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingService } from './service/booking.service';
import { BookingController } from './controller/booking.controller';
import { VehicleTypeEntity } from '../vehicleTypes/entity/vehicle-type.entity';
import { User } from '../user/entities/user.entity';
import { PaymentEntity } from '../payment/entity/payment.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import Booking from './entity/booking.entity';
import Review from '../review/enitity/review.entity';
import { DashboardController } from './controller/bookingdashbor.controller';
import { DashboardService } from './service/providerbooking.service';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      VehicleTypeEntity,
      User,
      PaymentEntity,
      CategoryEntity,
      Review,
      VehicleEntity
      
    ]
   
  ),
   CloudinaryModule,
  ],
  controllers: [BookingController,DashboardController],
  providers: [BookingService, DashboardService],
  exports: [TypeOrmModule, BookingService],
})
export class BookingModule { }
