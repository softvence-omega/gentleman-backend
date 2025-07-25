import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './services/firebase.service';
import { NotificationService } from './services/notification.service';
import { JwtService } from '@nestjs/jwt';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from './entity/notificationcs.entity';
import { EventService } from './services/event.service';
import { EventTypeService } from './event/event.service';
import { BullModule } from '@nestjs/bullmq';
import { EventEmitterModule } from '@nestjs/event-emitter';


@Global()
@Module({
 imports: [TypeOrmModule.forFeature([Notification,User]), BullModule.registerQueue({ name: 'notification' }), EventEmitterModule.forRoot(),],
  providers: [ FirebaseService, EventService,EventTypeService , NotificationService, JwtService],
  exports:[NotificationService,],
  controllers: [NotificationController]
})
export class NotificationModule {}