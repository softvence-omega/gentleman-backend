import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
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

  @IsOptional()
  @IsString()
  readonly stripeAccountId?: string;

  @IsOptional()
  @IsString()
  readonly fcmToken?: string;

  @IsOptional()
  @IsString()
  readonly specialist?: string;
}
