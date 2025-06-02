import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService], 
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('jwt_secret'),
        signOptions: {
          expiresIn: config.get<string>('jwt_expires_in'),
        },
      }),
    }),
  ],
})
export class JwtHelperModule {}
