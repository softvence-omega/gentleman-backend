import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: 'johns@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;


  @ApiPropertyOptional({
    example: 'fcmToken1234567890abcdef',
    description: 'Optional Firebase Cloud Messaging token',
  })
  @IsOptional()
  @IsString()
  fcmToken?: string;

}