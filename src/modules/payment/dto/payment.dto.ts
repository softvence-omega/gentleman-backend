// src/modules/payment/payment.dto.ts

import { IsEmail, IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class CreatePaymentDto {

  @IsUUID()
  bookingId:string;

  @ApiProperty({ example: 'user@example.com', description: 'User email associated with the payment' })
  @IsEmail()
  email: string;
}
