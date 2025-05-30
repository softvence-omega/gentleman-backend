// src/location/dto/create-location.dto.ts
import { IsNumberString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({
    example: '40.7128',
    description: 'Latitude as decimal string',
  })
  @IsNumberString({}, { message: 'Latitude must be a valid decimal string' })
  latitude: string;

  @ApiProperty({
    example: '-74.0060',
    description: 'Longitude as decimal string',
  })
  @IsNumberString({}, { message: 'Longitude must be a valid decimal string' })
  longitude: string;
}
