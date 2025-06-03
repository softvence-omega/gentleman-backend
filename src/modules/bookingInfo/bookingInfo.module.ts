import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { bookingInfoEntity } from './entity/bookingInfo.entity';
import { CategoryEntity } from '../category/entity/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([bookingInfoEntity,CategoryEntity])],
  exports:[TypeOrmModule]
})
export class BookingModule {}
