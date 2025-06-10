import {
  Injectable,
  NotFoundException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entity/category.entity';
import { CategoryDto } from '../dto/category.dto';
import { ServiceEntity } from 'src/modules/services/entity/service.entity';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import ApiError from 'src/common/errors/ApiError';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,

     private cloudinary: CloudinaryService,

    
    
  ) {}

  async createCategory(dto: CategoryDto ,file?: Express.Multer.File) {
    // Step 1: Check if the related service exists
     console.log(dto.serviceId)
    const service = await this.serviceRepo.findOneBy({ id: dto.serviceId });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

     let result;
        if (file) {
            try {
                result = await this.cloudinary.uploadFile(file);
            } catch (e) {
                throw new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, e.message);
            }
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

   


    // Step 3: Create and save the new category
    const category = this.categoryRepo.create({
      title: dto.title,
       icon: result ? result['secure_url'] : ''   ,
      service: service,
     
    });

    await this.categoryRepo.save(category);
    return category;
  }
}
