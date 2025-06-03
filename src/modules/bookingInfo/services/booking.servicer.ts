import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingInfoDto, UpdateBookingInfoDto } from '../dto/booking-info.dto';
import { bookingInfoEntity } from '../entity/bookingInfo.entity';

@Injectable()
export class BookingInfoService {
  constructor(
    @InjectRepository(bookingInfoEntity)
    private readonly bookingInfoRepo: Repository<bookingInfoEntity>,
  ) {}

  async create(createDto: CreateBookingInfoDto): Promise<bookingInfoEntity> {
    const booking = this.bookingInfoRepo.create(createDto);
    return await this.bookingInfoRepo.save(booking);
  }

  async findAll(): Promise<bookingInfoEntity[]> {
    return this.bookingInfoRepo.find();
  }

  async findOne(id: string): Promise<bookingInfoEntity> {
    const booking = await this.bookingInfoRepo.findOne({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async update(id: string, updateDto: UpdateBookingInfoDto): Promise<bookingInfoEntity> {
    const booking = await this.findOne(id);
    Object.assign(booking, updateDto);
    return this.bookingInfoRepo.save(booking);
  }

  async delete(id: string): Promise<void> {
    const result = await this.bookingInfoRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Booking not found');
    }
  }
}
