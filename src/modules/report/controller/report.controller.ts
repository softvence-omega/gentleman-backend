import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';

import { ApiTags } from '@nestjs/swagger';
import sendResponse from 'src/common/utils/sendResponse';
import { ReportService } from '../services/report.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { CreateReportDto } from '../dto/report.dto';


@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(
    private readonly reportService: ReportService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 5 },
    ]),
  )
  async createReport(
    @Body() dto: CreateReportDto,
    @Req() req,
    @Res() res: Response,
    @UploadedFiles() files: { image?: Express.Multer.File[]; },
    
  ) {
    const userId = req.user.userId;
    let imageUrls: string[] = [];
    let vehicleImageUrl: string | undefined;

    try {
      if (files.image?.length) {
        const uploadResults = await Promise.all(
          files.image.map((file) => this.cloudinary.uploadFile(file)),
        );
        imageUrls = uploadResults.map((r) => r.secure_url);
      }

     

      

      const data = await this.reportService.create(dto, userId, imageUrls);

      return sendResponse(res, {
        statusCode: HttpStatus.CREATED,
        success: true,
        message: 'Report submitted successfully',
        data,
      });
    } catch (error) {
      return sendResponse(res, {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: 'Failed to submit report',
        data:null
      });
    }
  }

 
  @Get(':id')
  async getOne(@Param('id') id: string, @Res() res: Response) {
    const data = await this.reportService.getOne(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Report fetched',
      data,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.reportService.delete(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Report deleted',
      data:null,
    });
  }
   @Get()
  async getAll(@Res() res: Response) {
    const data = await this.reportService.getAll();
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All reports fetched',
      data,
    });
  }

}
