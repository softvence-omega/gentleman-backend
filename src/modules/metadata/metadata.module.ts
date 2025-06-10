import { Module } from '@nestjs/common';
import { MetadataController } from './controller/metadata.controller';
import { MetadataService } from './service/metadata.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { PaymentEntity } from '../payment/entity/payment.entity';
import Booking from '../booking/entity/booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Booking, PaymentEntity])],
    controllers: [MetadataController],
    providers: [MetadataService],
    exports: [MetadataService]

})
export class MetadataModule {}
