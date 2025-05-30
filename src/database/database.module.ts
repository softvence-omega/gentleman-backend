import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { ServiceDetailEntity } from 'src/modules/service-details/entity/serviceDetail.entity';
import { ServiceRequestEntity } from 'src/modules/service-request/entity/serviceRequest.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          type: 'postgres',
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.user,
          password: dbConfig.password,
          database: dbConfig.name,
          entities: [User, Location, ServiceDetailEntity, ServiceRequestEntity],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
