import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { JwtHelperModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User]), JwtHelperModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
