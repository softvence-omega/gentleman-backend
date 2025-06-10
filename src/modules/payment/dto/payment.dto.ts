// src/modules/payment/payment.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {

  

  bookingId: string;

  @ApiProperty({ example: 'user@example.com', description: 'User email associated with the payment' })
  @IsEmail()
  email: string;
}
