import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

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
}
