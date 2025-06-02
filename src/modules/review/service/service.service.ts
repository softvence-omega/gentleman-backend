import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../enitity/review.entity';
import { CreateReviewDto } from '../dto/create-review.dto';


@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  create(createReviewDto: CreateReviewDto) {
    const review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find();
  }

  findOne(id: string) {
    return this.reviewRepository.findOneBy({ id });
  }

  async update(id: string, updateReviewDto: CreateReviewDto) {
    const review = await this.reviewRepository.preload({
      id,
      ...updateReviewDto,
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.reviewRepository.save(review);
  }

  async remove(id: string) {
    const review = await this.findOne(id);
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return this.reviewRepository.remove(review);
  }
}
