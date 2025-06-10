import { Module } from '@nestjs/common';
import { MessageController } from './controller/message.controller';
import { MessageService } from './service/message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfferMessege } from './entity/offerMessage.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import Message from './entity/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message, OfferMessege]), CloudinaryModule],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule { }
