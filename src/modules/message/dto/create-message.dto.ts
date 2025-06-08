// dto/create-message.dto.ts

import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '../entity/message.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { OfferMessegeStatus } from '../entity/offerMessage.entity';

export class CreateMessageDto {
    @ApiProperty({ description: 'Receiver user ID', example: 'e51f3d3c-b3b2-4d97-991a-4410e531fbd4' })
    @IsUUID()
    @IsNotEmpty()
    receiver: User;

    @ApiProperty({ enum: MessageType, description: 'Type of message', example: MessageType.TEXT })
    @IsEnum(MessageType)
    type: MessageType;

    @ApiPropertyOptional({ description: 'Text content of the message (if type is text)' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiPropertyOptional({ description: 'Name of the attached file (if type is file)' })
    @IsOptional()
    @IsString()
    fileName?: string;

    @ApiPropertyOptional({ description: 'URL to the attached file (if type is file)' })
    @IsOptional()
    @IsUrl()
    fileUrl?: string;

    @ApiProperty({ description: 'Description of the offer', example: 'Offering a 10% discount' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Offer price', example: 5000 })
    @IsString()
    @IsOptional()
    offerPrice?: number;

    @ApiProperty({ enum: OfferMessegeStatus, default: OfferMessegeStatus.PENDING, required: false })
    @IsEnum(OfferMessegeStatus)
    @IsOptional()
    status?: OfferMessegeStatus;
}
