import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryDto } from '../dto/category.dto';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { bookingInfoEntity } from 'src/modules/bookingInfo/entity/bookingInfo.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,

    @InjectRepository(bookingInfoEntity)
    private readonly bookingInfoRepo: Repository<bookingInfoEntity>,
    
  ) {}

  async createCategory(dto: CategoryDto) {
    // Step 1: Check if the related service exists
    const service = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Step 2: Check for duplicate category title within the same service
    const existingCategory = await this.categoryRepo.findOne({
      where: {
        title: dto.title,
        service: {
          id: dto.serviceId,
        },
      },
      relations: ['service'], // Ensure service is joined for filtering
    });

    if (existingCategory) {
      throw new BadRequestException(
        'Category with this title already exists for the specified service',
      );
    }

    const bookingInfo = await this.bookingInfoRepo.findOne({
      where: { id: "" },
    });

    if (!bookingInfo) {
      throw new NotFoundException('Booking Info not found');
    }


    // Step 3: Create and save the new category
    const category = this.categoryRepo.create({
      title: dto.title,
      service: service,
      bookingInfo
    });

    await this.categoryRepo.save(category);
    return category;
  }
}
