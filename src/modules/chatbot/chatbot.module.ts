import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ChatbotLog } from './entities/chatbot-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ChatbotLog])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule { }
