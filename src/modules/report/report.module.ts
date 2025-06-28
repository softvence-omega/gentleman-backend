import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { ReportController } from './controller/report.controller';
import { ReportService } from './services/report.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import Booking from '../booking/entity/booking.entity';
import { Report } from './entity/report.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Report,User,Booking])],
  controllers: [ReportController],
  providers: [ReportService, CloudinaryService],
})
export class ReportModule {}
