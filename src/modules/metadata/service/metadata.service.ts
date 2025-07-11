import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { PaymentEntity } from 'src/modules/payment/entity/payment.entity';
import { Between, Repository } from 'typeorm';
import { UserRole } from 'src/modules/user/dto/create-user.dto';
import { PaymentStatus } from 'src/modules/payment/entity/payment.enum';
import Booking from 'src/modules/booking/entity/booking.entity';

@Injectable()
export class MetadataService {
    constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(PaymentEntity)
    private readonly paymentRepo: Repository<PaymentEntity>,
  ) {}

  async getDashboardMetrics() {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [activeUsers, verifiedProfessionals, bookingsToday] = await Promise.all([
      this.userRepo.count(),
      this.userRepo.count({ where: {  role: UserRole.PROVIDER } }),
      this.bookingRepo.count({
        where: {
          createdAt: Between(startOfToday, endOfToday),
        },
      }),
    ]);

    const monthlyRevenueRaw = await this.paymentRepo
      .createQueryBuilder('payment')
      .innerJoin('payment.booking', 'booking')
      .where('payment.status = :status', { status: PaymentStatus.COMPLETED })
      .andWhere('booking.createdAt BETWEEN :start AND :end', {
        start: startOfMonth.toISOString(),
        end: endOfMonth.toISOString(),
      })
      .select('SUM(payment.amount)', 'sum')
      .getRawOne();

    return {
      activeUsers,
      verifiedProfessionals,
      bookingsToday,
      monthlyRevenue: Number(monthlyRevenueRaw.sum) || 0,
    };
  }

  async getMonthlyBookingStats(): Promise<{ month: string; count: number }[]> {
    const result = await this.bookingRepo
      .createQueryBuilder('booking')
      .select("TO_CHAR(booking.createdAt, 'Mon')", 'month')
      .addSelect('COUNT(*)', 'count')
      .groupBy('month')
      .orderBy("MIN(booking.createdAt)", 'ASC')
      .getRawMany();

    return result.map(row => ({
      month: row.month,
      count: parseInt(row.count, 10),
    }));
  }
}
