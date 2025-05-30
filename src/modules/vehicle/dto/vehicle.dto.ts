import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VehicleDto {
  @ApiProperty({ example: 'Corolla', description: 'Name of the vehicle' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Toyota', description: 'Brand of the vehicle' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'LE', description: 'Model of the vehicle' })
  @IsString()
  model: string;

  @ApiProperty({ example: '2020', description: 'Manufacturing year' })
  @IsString()
  year: string;

  @ApiProperty({
    example: 'https://example.com/car.jpg',
    description: 'URL to the vehicle image',
  })
  @IsString()
  vhicalImage: string;
}
