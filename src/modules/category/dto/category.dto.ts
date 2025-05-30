import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Design',
    description: 'Title of the category',
  })
  @IsString()
  title: string;
}
