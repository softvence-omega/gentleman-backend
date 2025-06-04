import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceRequestModule } from './modules/service-request/service-request.module';
import { ReviewModule } from './modules/review/review.module';
import { PaymentModule } from './modules/payment/payment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { CategoryModule } from './modules/category/category.module';
import { BookingModule } from './modules/booking/booking.module';
import { MessageModule } from './modules/message/message.module';
import { UserModule } from './modules/user/user.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { ServiceDetailsModule } from './modules/service-details/service-details.module';
import { DatabaseModule } from './database/database.module';
import { ConfigurationModule } from './config/config.module';
import { LocationModule } from './modules/location/location.module';
import { ServiceModule } from './modules/services/services.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { VehicleTypeModule } from './modules/vehicleTypes/vehicleTypes.module';
import { ChatModule } from './modules/chat/chat.module';
import { RedisService } from './common/redis/redis.service';
import { RedisModule } from './common/redis/redis.module';
// Import other modules here...

@Module({
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }, RedisService],
  imports: [
    ConfigurationModule,
    DatabaseModule,
    JwtModule,
    // Your feature modules
    ServiceRequestModule,
    ReviewModule,
    ServiceModule,
    PaymentModule,
    NotificationModule,
    CategoryModule,
    BookingModule,
    MessageModule,
    UserModule,
    VehicleModule,
    ServiceDetailsModule,
    LocationModule,
    AuthModule,
    UserModule,
    VehicleTypeModule,
    BookingModule,
    ChatModule,
    RedisModule,
  ],
})
export class AppModule { }
