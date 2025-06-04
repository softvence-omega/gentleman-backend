import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { UserRole } from "./create-user.dto";

export class CreateAdminDto {

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

    @ApiPropertyOptional({ description: 'Role of the user', example: "admin" })
    @IsOptional()
    @IsEnum(UserRole)
    role: UserRole;
}