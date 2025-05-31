import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryDto } from '../dto/category.dto';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
  ) {}

  async createCategory(dto: CategoryDto) {
    const service = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    const category = this.categoryRepo.create({
      title: dto.title,
      serviceId: dto.serviceId,
    });

    await this.categoryRepo.save(category);
    return category;
  }
}
