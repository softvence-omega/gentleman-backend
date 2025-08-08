import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class UpdateUserStatusDto {

    @ApiProperty({
    description: 'Status of the user',
    example: 'active',
    enum: ['active', 'inactive', 'blocked'],
    })
    @IsString()
    @IsNotEmpty()
    @IsEnum(['active', 'inactive', 'blocked'])
    status: string;
}