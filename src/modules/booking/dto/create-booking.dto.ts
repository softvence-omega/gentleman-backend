import { IsEnum, IsOptional } from 'class-validator';
import { BookingStatus, BookingWorkStatus, PaymentStatus } from '../entity/booking.entity';

export class CreateBookingDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(BookingWorkStatus)
  workStatus?: BookingWorkStatus;
}
