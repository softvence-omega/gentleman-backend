import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/user/entities/user.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { ServiceDetailEntity } from 'src/modules/service-details/entity/serviceDetail.entity';
import { ServiceRequestEntity } from 'src/modules/service-request/entity/serviceRequest.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { VehicleEntity } from 'src/modules/vehicle/entity/vehicle.entity';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get('database');
        return {
          type: 'postgres',
          url: dbConfig.url,
          entities: [
            User,
            Location,
            ServiceDetailEntity,
            ServiceRequestEntity,
            CategoryEntity,
            VehicleEntity,
            ServiceEntity,
          ],
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
