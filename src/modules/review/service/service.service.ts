import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../enitity/review.entity';
import { Booking } from 'src/modules/booking/entity/booking.entity';
import { CreateReviewDto } from '../dto/create-review.dto';


@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,

    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
  ) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const booking = await this.bookingRepo.findOne({
      where: { id: createReviewDto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const review = this.reviewRepo.create({
      comment: createReviewDto.comment,
      rating: createReviewDto.rating,
    });

    review.booking = Promise.resolve(booking);

    return await this.reviewRepo.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepo.find({ relations: ['booking'] });
  }

  async findByBookingId(bookingId: string): Promise<Review[]> {
    return await this.reviewRepo.find({
      where: { booking: { id: bookingId } },
      relations: ['booking'],
    });
  }
}
