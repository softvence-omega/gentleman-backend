import { IsOptional, IsString } from "class-validator";

export class ResetPasswordDto {
    @IsString()
    @IsOptional()
    id: string;

    @IsString()
    @IsOptional()
    email: string;

    @IsString()
    resetToken: string;

    @IsString()
    newPassword: string;
}