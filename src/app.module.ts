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
// Import other modules here...

@Module({
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
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
  ],
})
export class AppModule {}
