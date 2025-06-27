import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(['FULL', 'PARTIAL', 'EXPERIENCE_ONLY'], {
    message: 'refundType must be FULL, PARTIAL, or EXPERIENCE_ONLY',
  })
  refundType: 'FULL' | 'PARTIAL' | 'EXPERIENCE_ONLY';

  @IsNumber()
  requestedAmount: number;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @IsOptional()
  imageUrls?: string[];

  @IsOptional()
  vehicleImage?: string;
}
