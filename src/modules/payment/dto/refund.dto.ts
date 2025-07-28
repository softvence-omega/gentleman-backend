import { IsNumber, IsString } from 'class-validator';

export class RefundDto {
  @IsNumber()
  amount: number;

  @IsString()
  userId: string;

  @IsString()
  providerId: string;
}
