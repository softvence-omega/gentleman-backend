import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '../entity/message.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { OfferMessegeStatus } from '../entity/offerMessage.entity';

export class UpdateMessageDto {
    @ApiPropertyOptional({ description: 'Text content of the message (if type is text)' })
    @IsOptional()
    @IsString()
    content?: string;

    @ApiProperty({ description: 'Description of the offer', example: 'Offering a 10% discount' })
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Offer price', example: 5000 })
    @IsString()
    @IsOptional()
    offerPrice?: number;
}
