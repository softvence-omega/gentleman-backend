import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import {
  BookingStatus,
  BookingWorkStatus,
  PaymentStatus,
} from '../entity/booking.entity';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status: BookingStatus;
}

export class UpdateBookingWorkStatusDto {
  @IsEnum(BookingWorkStatus)
  workStatus: BookingWorkStatus;
}

export class UpdatePaymentStatusDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}

export class UpdateBookingDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsDateString()
  year?: string;

  @IsOptional()
  @IsString()
  vehicleImage?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  price?: string;

  @IsOptional()
  @IsString()
  DetailsDescription?: string;

  @IsOptional()
  @IsString()
  dentImg?: string;

  @IsOptional()
  @IsString()
  desireDate?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  vehicleTypesId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  providerId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @IsOptional()
  @IsEnum(BookingWorkStatus)
  workStatus?: BookingWorkStatus;

  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;
}
