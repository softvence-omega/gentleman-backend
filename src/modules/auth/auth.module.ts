import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtHelperModule } from 'src/common/jwt/jwt.module';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';
import { EmailModule } from 'src/common/nodemailer/email.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), JwtHelperModule, CloudinaryModule, EmailModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
