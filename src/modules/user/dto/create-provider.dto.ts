import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from './create-user.dto';

export class CreateProviderDto {
  @ApiProperty({
    description: 'Full name of the provider',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email address of the provider',
    example: 'johndoe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Role of the user', example: "provider" })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'Password for the provider account',
    example: 'strongPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  longitude: string;

  @IsString()
  latitude: string;

  @IsString()
  specialist: string;

  @ApiProperty({
    description: 'Phone number of the provider',
    example: '+1234567890',
  })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'ID of the service category the provider belongs to',
    example: '1234567890abcdef',
  })
  @IsNotEmpty()
  @IsString()
  serviceCategoryId: string;

  @ApiProperty({
    description: 'Name of the provider\'s workshop',
    example: 'FastFix Garage',
  })
  @IsNotEmpty()
  @IsString()
  workShopName: string;
}
