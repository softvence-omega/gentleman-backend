import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ServiceDto {
  @ApiProperty({
    example: 'Car Denting',
    description: 'Title of the service',
  })
  @IsString()
  title: string;
}
