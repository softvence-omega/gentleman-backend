import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServiceRequestModule } from './modules/service-request/service-request.module';
import { ReviewModule } from './modules/review/review.module';
import { ServicesModule } from './modules/services/services.module';
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
// Import other modules here...

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigurationModule,
    DatabaseModule,
    // Your feature modules
    ServiceRequestModule,
    ReviewModule,
    ServicesModule,
    PaymentModule,
    NotificationModule,
    CategoryModule,
    BookingModule,
    MessageModule,
    UserModule,
    VehicleModule,
    ServiceDetailsModule,
    LocationModule,
  ],
})
export class AppModule {}
