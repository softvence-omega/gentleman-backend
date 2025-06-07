import { Module } from '@nestjs/common';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entity/message.entity';
import { OfferMessege } from './entity/offerMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, OfferMessege])],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule { }
