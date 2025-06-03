import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './service/category.service';
import { CategoryController } from './controller/category.controller';
import { CategoryEntity } from './entity/category.entity';
import { ServiceModule } from '../services/services.module';
import { bookingInfoEntity } from '../bookingInfo/entity/bookingInfo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity,bookingInfoEntity]), ServiceModule],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService, TypeOrmModule],
})
export class CategoryModule {}
