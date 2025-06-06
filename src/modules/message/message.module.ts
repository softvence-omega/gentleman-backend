import { Module } from '@nestjs/common';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule { }
