import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { CategoryDto } from '../dto/category.dto';
import sendResponse from 'src/common/utils/sendResponse';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/')
    @UseInterceptors(FileInterceptor("icon"))
  async create(@Body() dto: CategoryDto, @Res() res:Response, @UploadedFile() file: Express.Multer.File,) {
    const data = await this.categoryService.createCategory(dto,file);
    return sendResponse(res,{
            statusCode:HttpStatus.OK,
            success:true,
            message: "create category services successfully   ",
            data: data
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
