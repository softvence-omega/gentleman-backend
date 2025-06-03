import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from '../service/service.service';
import { Review } from '../enitity/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';


@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() dto: CreateReviewDto): Promise<Review> {
    return this.reviewService.create(dto);
  }

  @Get()
  async findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Get('booking/:bookingId')
  async findByBooking(@Param('bookingId') bookingId: string): Promise<Review[]> {
    return this.reviewService.findByBookingId(bookingId);
  }
}
