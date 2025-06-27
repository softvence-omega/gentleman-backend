// src/modules/payment/payment.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {

  
  @IsUUID()
  bookingId: string;

}




export class WithdrawDto {
  @IsNumber()
  @IsPositive()
  amount: number;
}




