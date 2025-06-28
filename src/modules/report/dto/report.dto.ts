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
  description: string;

  @IsEnum(['FULL', 'PARTIAL', 'EXPERIENCE_ONLY'], {
    message: 'refundType must be FULL, PARTIAL, or EXPERIENCE_ONLY',
  })
  refundType: 'FULL' | 'PARTIAL' | 'EXPERIENCE_ONLY';

  @IsString()
  requestedAmount:string;

  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

 

 
}
