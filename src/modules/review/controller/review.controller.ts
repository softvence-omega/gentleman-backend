import { Body, Controller, Get, Param, Post, Res, HttpStatus } from '@nestjs/common';
import { ReviewService } from '../service/service.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Response } from 'express';
import sendResponse from 'src/common/utils/sendResponse';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async create(@Body() dto: CreateReviewDto, @Res() res: Response) {
    const data = await this.reviewService.create(dto);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Review created successfully',
      data,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const data = await this.reviewService.findAll();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All reviews fetched successfully',
      data,
    });
  }

  @Get('booking/:bookingId')
  async findByBooking(@Param('bookingId') bookingId: string, @Res() res: Response) {
    const data = await this.reviewService.findByBookingId(bookingId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Reviews for booking fetched successfully',
      data,
    });
  }
}
