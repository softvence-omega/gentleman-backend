import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  PROVIDER = 'provider',
}

export class CreateUserDto {

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123', minLength: 6, description: 'User password' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Role of the user' })
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
}