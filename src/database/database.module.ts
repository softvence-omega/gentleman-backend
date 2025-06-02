import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [
          User,
          Location,
          ServiceDetailEntity,
          ServiceRequestEntity,
          CategoryEntity,
          VehicleEntity,
          ServiceEntity,
          PaymentEntity,
        ],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
