import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking, BookingStatus, BookingWorkStatus, PaymentStatus } from '../entity/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';
import { User } from 'src/modules/user/entities/user.entity';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';
import { PaymentStatus as mainPaymentStatus } from 'src/modules/payment/entity/payment.enum';


@Injectable()
export class BookingService {
   private stripe: Stripe;
  constructor(
    private configService: ConfigService,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
     @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(PaymentEntity)
        private paymentRepo: Repository<PaymentEntity>,
  ) {
     this.stripe = new Stripe(
      this.configService.get('stripe_secret_key') as string,
    );
  }

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
    this.bookingRepo.save(booking);
    return  this.getBookingById(id);
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.paymentStatus = dto.paymentStatus;
    return this.bookingRepo.save(booking);
  }

 async getPendingBookings(userId: string): Promise<Booking[]> {
  return this.bookingRepo.find({
    where: {
      status: BookingStatus.Pending,
      provider: { id: userId },
    },
    relations: ['user', 'provider', 'vehicleType', 'category', 'payment', 'reviews'],
  });
}

async getCompletedBookings(userId: string): Promise<Booking[]> {
  return this.bookingRepo.find({
    where: {
      workStatus: BookingWorkStatus.Completed, // Fixed status here
      provider: { id: userId },
    },
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


   async getUserBookingLocations(userId: string) {
    const bookings = await this.bookingRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      select: ['latitude', 'longitude'],
    });

    return bookings.map(({ latitude, longitude }) => ({
      latitude,
      longitude,
    }));
  }
  async getAllProviderLocations() {
  const bookings = await this.bookingRepo
    .createQueryBuilder('booking')
    .innerJoin('booking.provider', 'provider')
    .where('provider.role = :role', { role: 'provider' })
    .select(['booking.latitude', 'booking.longitude'])
    .getMany();

  return bookings.map(({ latitude, longitude }) => ({
    latitude,
    longitude,
  }));
}

async cancelBooking(bookingId: string) {
  const booking = await this.bookingRepo.findOne({
    where: { id: bookingId },
    relations: ['payment'],
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
  }

  if (!booking.payment || !booking.payment.senderPaymentTransaction) {
    throw new BadRequestException('No payment found to refund');
  }

  // Refund via Stripe
  const refund = await this.stripe.refunds.create({
    payment_intent: booking.payment.senderPaymentTransaction,
  });

  // Update statuses
  booking.status = BookingStatus.Reject;
  booking.paymentStatus = PaymentStatus.Cancel;
  booking.payment.status = mainPaymentStatus.REFUNDED

  await this.paymentRepo.save(booking.payment);
  await this.bookingRepo.save(booking);

  return {
    message: 'Booking cancelled and payment refunded successfully',
    booking,
  };
}


}



