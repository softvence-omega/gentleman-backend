import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly role?: string;

  @IsOptional()
  @IsString()
  readonly otp?: string;

  @IsOptional()
  @IsString()
  readonly serviceCategoryId?: string;

  @IsOptional()
  @IsString()
  readonly workShopName?: string;

  @IsOptional()
  @IsString()
  readonly status: string;

  @IsOptional()
  @IsString()
  readonly bio: string;
}
