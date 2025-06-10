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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      VehicleTypeEntity,
      User,
      PaymentEntity,
      CategoryEntity,
      Review,
      
    ]
   
  ),
   CloudinaryModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [TypeOrmModule, BookingService],
})
export class BookingModule { }
