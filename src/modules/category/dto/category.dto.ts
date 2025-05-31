import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Design',
    description: 'Title of the category',
  })
  @IsString()
  title: string;
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the service this category belongs to',
  })
  @IsUUID()
  serviceId: string;
}
