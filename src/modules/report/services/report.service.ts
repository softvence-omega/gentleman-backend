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


  
  async getAll(): Promise<Report[]> {
    return this.reportRepo.find({
      
      order: { createdAt: 'DESC' },
    });
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

