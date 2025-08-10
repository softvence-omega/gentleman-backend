import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class ChatBotMessageDto {
    @ApiProperty({ example: 'Tell me a joke', description: 'User question text' })
    @IsString()
    question: string;

    @ApiProperty({
        example: 'b8d9a820-12ac-4e92-bf84-0d3a4f9c93b2',
        description: 'Session ID to continue the conversation',
        required: false,
    })
    @IsUUID()
    @IsOptional()
    sessionId?: string;
}
