import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entity/booking.entity';
import { BookingController } from './controller/booking.controller';
import { BookingService } from './service/booking.service';
import { bookingInfoEntity } from '../bookingInfo/entity/bookingInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking,bookingInfoEntity])],
  controllers: [BookingController],
  providers: [BookingService],
  exports:[TypeOrmModule]
})
export class BookingModule {}
