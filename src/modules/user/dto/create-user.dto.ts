import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  PROVIDER = 'provider',
}

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string

    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;
}
