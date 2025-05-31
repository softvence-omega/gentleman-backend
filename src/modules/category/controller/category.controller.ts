import { Body, Controller, Post } from '@nestjs/common';
import { sendResponse } from 'src/common/utils/sendResponse';
import { CategoryService } from '../service/category.service';
import { CategoryDto } from '../dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
  async create(@Body() dto: CategoryDto) {
    const data = await this.categoryService.createCategory(dto);
    return sendResponse({
      message: 'Category created successfully',
      statusCode: 201,
      data,
    });
  }

  // @Get('/:id')
  // async getById(@Param('id') id: string) {
  //   const data = await this.categoryService.getCategoryById(id);
  //   return sendResponse({
  //     message: 'Category fetched successfully',
  //     statusCode: 200,
  //     data,
  //   });
  // }
}
