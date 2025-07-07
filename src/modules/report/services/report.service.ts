import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateReportDto } from '../dto/report.dto';
import { Report } from '../entity/report.entity';
import Booking from 'src/modules/booking/entity/booking.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) {}

  
async create(dto: CreateReportDto, userId: string, imageUrls: string[]) {
  const user = await this.userRepo.findOneBy({ id: userId });
  if (!user) throw new NotFoundException('User not found');

  const report = this.reportRepo.create({
    ...dto,
    imageUrls,
    user,
  });

  return this.reportRepo.save(report);
}


  
// report.service.ts
async getAll({
  page = 1,
  limit = 10,
  status,
  sortOrder = 'DESC',
}: {
  page?: number;
  limit?: number;
  status?: 'FULL' | 'PARTIAL' | 'EXPERIENCE_ONLY';
  sortOrder?: 'ASC' | 'DESC';
}): Promise<{ data: Report[]; total: number; page: number; limit: number }> {
  const skip = (page - 1) * limit;

  const query = this.reportRepo.createQueryBuilder('report')
    .leftJoinAndSelect('report.user', 'user')
    .leftJoinAndSelect('report.booking', 'booking')
    .orderBy('report.createdAt', sortOrder)
    .skip(skip)
    .take(limit);

  if (status) {
    query.andWhere('report.refundType = :status', { status });
  }

  const [data, total] = await query.getManyAndCount();

  return {
    data,
    total,
    page,
    limit,
  };
}

  
  async getOne(id: string): Promise<Report> {
    const report = await this.reportRepo.findOne({
      where: { id },
      
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    return report;
  }


  async delete(id: string): Promise<void> {
    const result = await this.reportRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Report not found or already deleted');
    }
  }
}

