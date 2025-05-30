import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ServiceDetailDto {
  @ApiProperty({
    example: 'Service Name',
    description: 'Name of the service',
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'Image URL for the service',
  })
  @IsString()
  dentImg: string;

  @ApiProperty({
    example: '2023-10-01T00:00:00Z',
    description: 'Desired date for the service',
  })
  @IsString()
  desireDate: Date;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the location associated with the service',
  })
  @IsUUID()
  locationId: string;
}
