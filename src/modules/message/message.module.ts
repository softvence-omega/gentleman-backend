import { Module } from '@nestjs/common';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule { }
