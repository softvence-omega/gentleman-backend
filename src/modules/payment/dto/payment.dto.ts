// src/modules/payment/payment.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {

  @ApiProperty({ example: 100, description: 'Amount to be paid' })
  @IsNumber()
  amount: number;


  @ApiProperty({ example: 'user@example.com', description: 'User email associated with the payment' })
  @IsEmail()
  email: string;
}
