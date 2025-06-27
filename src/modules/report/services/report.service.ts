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

  
async create(dto: CreateReportDto, userId: string): Promise<Report> {
  const user = await this.userRepo.findOne({ where: { id: userId } });
  if (!user) throw new NotFoundException('User not found');

  const booking = await this.bookingRepo.findOne({ where: { id: dto.bookingId } });
  if (!booking) throw new NotFoundException('Booking not found');

  const report = this.reportRepo.create({
    ...dto,
    user,
    booking,
  });

  return await this.reportRepo.save(report);
}


  
  async getAll(): Promise<Report[]> {
    return this.reportRepo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  
  async getOne(id: string): Promise<Report> {
    const report = await this.reportRepo.findOne({
      where: { id },
      relations: ['user'],
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

