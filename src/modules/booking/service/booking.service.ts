import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus } from '../entity/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';


@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    const booking = this.bookingRepo.create({
      ...dto,
      vehicleType: { id: dto.vehicleTypesId },
      user: { id: dto.userId },
      provider: { id: dto.providerId },
      category: { id: dto.categoryId },
    });
    return this.bookingRepo.save(booking);
  }

  async updateBooking(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.getBookingById(id);

    Object.assign(booking, {
      ...dto,
      vehicleType: dto.vehicleTypesId ? { id: dto.vehicleTypesId } : booking.vehicleType,
      user: dto.userId ? { id: dto.userId } : booking.user,
      provider: dto.providerId ? { id: dto.providerId } : booking.provider,
      category: dto.categoryId ? { id: dto.categoryId } : booking.category,

    });

    return this.bookingRepo.save(booking);
  }

  async updateBookingStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.status = dto.status;
    return this.bookingRepo.save(booking);
  }

  async updateWorkStatus(id: string, dto: UpdateBookingWorkStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.workStatus = dto.workStatus;
    return this.bookingRepo.save(booking);
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.paymentStatus = dto.paymentStatus;
    return this.bookingRepo.save(booking);
  }

  async getPendingBookings(): Promise<Booking[]> {
    return this.bookingRepo.find({
    where: { status: BookingStatus.Pending },
      relations: ['user', 'provider', 'vehicleType', 'category', 'payment', 'reviews'],
    });
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'provider', 'vehicleType', 'category', 'payment', 'reviews'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
