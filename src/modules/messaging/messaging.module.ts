// src/messaging/messaging.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entity/conversation.entity';
import { Offer } from './entity/offer.entity';
import { Message } from './entity/message.entity';

import { User } from '../user/entities/user.entity';
import { RedisService } from './services/redis.services';
import { MessageGateway } from './services/message.geway';
import Booking from '../booking/entity/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Conversation, Message, Offer,Booking])],
  providers: [MessageGateway, RedisService],
  exports: [MessageGateway],
})
export class MessagingModule {}
