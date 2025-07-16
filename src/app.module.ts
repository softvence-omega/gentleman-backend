import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReviewModule } from './modules/review/review.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CategoryModule } from './modules/category/category.module';
import { BookingModule } from './modules/booking/booking.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './config/config.module';
import { ServiceModule } from './modules/services/services.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { VehicleTypeModule } from './modules/vehicleTypes/vehicleTypes.module';
import { ChatModule } from './modules/chat/chat.module';
import { RedisService } from './common/redis/redis.service';
import { RedisModule } from './common/redis/redis.module';
import { MetadataController } from './modules/metadata/controller/metadata.controller';
import { MetadataModule } from './modules/metadata/metadata.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { ReportModule } from './modules/report/report.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from './modules/notifications/notification.module';
// Import other modules here...

@Module({
  controllers: [AppController, MetadataController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }, RedisService],
  imports: [
    ConfigurationModule,
    DatabaseModule,
    JwtModule,
    // Your feature modules
    ReviewModule,
    ServiceModule,
    PaymentModule,
    CategoryModule,
    BookingModule,
    MessageModule,
    UserModule,
    AuthModule,
    UserModule,
    VehicleTypeModule,
    BookingModule,
    RedisModule,
    MetadataModule,
    VehicleModule,
    ReportModule,
    MessagingModule,

    BullModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => ({
    connection: {
      url: configService.getOrThrow<string>('redis_connection_url'),
    },
  }),
}),
    
  ],
})
export class AppModule { }
