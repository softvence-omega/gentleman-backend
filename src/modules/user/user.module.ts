import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controller/user.controller';
import { ServiceRequestEntity } from '../service-request/entity/serviceRequest.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, ServiceRequestEntity]), CloudinaryModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule]
})
export class UserModule { }
