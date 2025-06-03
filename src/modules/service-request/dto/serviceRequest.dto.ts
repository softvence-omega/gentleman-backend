import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID } from 'class-validator';

export class ServiceRequestDto {
  @ApiProperty({
    example: 'Website Design',
    description: 'Title of the service request',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Create a professional website for my business',
    description: 'Description of the service request',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 500,
    description: 'Price for the service',
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: '9e89f5c2-26a4-4f3f-b7b3-e2a24501ce32',
    description: 'UUID of the provider',
  })
  @IsUUID()
  providerId: string;
}
