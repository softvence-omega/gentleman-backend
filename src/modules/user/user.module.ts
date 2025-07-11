import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import Booking from '../booking/entity/booking.entity';
import { ReviewModule } from '../review/review.module';
import Review from '../review/enitity/review.entity';
import { VehicleEntity } from '../vehicle/entity/vehicle.entity';
import { WithdrawalEntity } from '../payment/entity/payment.entity';
import { Report } from '../report/entity/report.entity';
import { Conversation } from '../messaging/entity/conversation.entity';
import { Offer } from '../messaging/entity/offer.entity';
import { Message } from '../messaging/entity/message.entity';
import { Notification } from '../notifications/entity/notificationcs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Booking,Review,VehicleEntity,WithdrawalEntity,Report,Conversation,Offer,Message,Notification]), CloudinaryModule,ReviewModule,],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule]
})
export class UserModule { }
