// dashboard.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Review } from 'src/modules/review/enitity/review.entity';
import { Booking, BookingStatus, BookingWorkStatus } from '../entity/booking.entity';
import { PaymentStatus } from 'src/modules/payment/entity/payment.enum';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';
import { User } from 'src/modules/user/entities/user.entity';


@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
     @InjectRepository(User)
        private readonly userRepo: Repository<User>,
  ) {}

  async getProviderDashboard(providerId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // This week earnings
    const weekly = await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.payment', 'payment')
      .where('booking.providerId = :providerId', { providerId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('booking.createdAt >= :startOfWeek', { startOfWeek })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    // This month earnings
    const monthly = await this.bookingRepo
      .createQueryBuilder('booking')
      .leftJoin('booking.payment', 'payment')
      .where('booking.providerId = :providerId', { providerId })
      .andWhere('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('booking.createdAt >= :startOfMonth', { startOfMonth })
      .select('SUM(payment.amount)', 'total')
      .getRawOne();

    // Total jobs
    const jobCount = await this.bookingRepo.count({
      where: {
        provider: { id: providerId },
        workStatus:  BookingWorkStatus.Completed,
      },
    });

    // Average rating
    const avgRating = await this.reviewRepo
      .createQueryBuilder('review')
      .leftJoin('review.booking', 'booking')
      .where('booking.providerId = :providerId', { providerId })
      .select('AVG(review.rating)', 'average')
      .getRawOne();

    return {
      thisWeek: Number(weekly.total) || 0,
      thisMonth: Number(monthly.total) || 0,
      jobs: jobCount,
      rating: parseFloat(avgRating.average) || 0,
    };
  }

  // dashboard.service.ts

async getTodaySchedule(providerId: string) {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  const bookings = await this.bookingRepo.find({
    where: {
      provider: { id: providerId },
      desireDate: Between(startOfDay.toISOString(), endOfDay.toISOString()),
      status: BookingStatus.Accept,
    },
    relations: ['user'], // for avatar/info
    order: { desireDate: 'ASC' },
  });

  return bookings.map((b) => ({
    time: new Date(b.desireDate).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    title: b.title,
    address: {latitude:b.latitude,longitude:b.longitude},
    distance:b.description, 
    user: {
      name: b.user.name,
      avatar: b.user.profileImage
    },
  }));
}


async createBooking(createBookingDto: CreateBookingDto): Promise<Booking> {
    const { userId, providerId, ...bookingData } = createBookingDto;

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const provider = await this.userRepo.findOne({ where: { id: providerId } });
    if (!provider) throw new NotFoundException('Provider not found');

    const booking = this.bookingRepo.create({
      ...bookingData,
      user,
      provider,
      payment: new PaymentEntity({ amount: parseFloat(bookingData.price) }),
    });

    return this.bookingRepo.save(booking);
  }

  async getAllBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: [{ user: { id: userId } }, { provider: { id: userId } }],
      relations: ['user', 'provider', 'payment'],
    });
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'provider', 'payment'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async getTransactionHistory(userId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: [
        { user: { id: userId }, payment: { status: PaymentStatus.CANCELLED} },
        { provider: { id: userId }, payment: { status:  PaymentStatus.CANCELLED } },
      ],
      relations: ['payment'],
    });
  }

 

}
