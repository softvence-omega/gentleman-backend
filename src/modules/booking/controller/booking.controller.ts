import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { ApiQuery } from '@nestjs/swagger';
import sendResponse from 'src/common/utils/sendResponse';


@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 5 },
      { name: 'vehicleImage', maxCount: 1 },
    ])
  )
  async createBooking(
    @UploadedFiles() files: { image?: Express.Multer.File[]; vehicleImage?: Express.Multer.File[] },
    @Body() dto: CreateBookingDto,
    @Req() req,
    @Res() res: Response,
  ) {
    const userId = req.user.userId;
    const data = await this.bookingService.createBooking(dto, userId, files.image || [], files?.vehicleImage?.[0]);
    return sendResponse(res, {
      statusCode: HttpStatus.CREATED,
      success: true,
      message: 'Booking created successfully',
      data,
    });
  }



   @Get('allBooking/admin')
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  async getAllBookings(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Res() res: Response,
  ) {
    const data = await this.bookingService.getAllBookings(page, limit, order);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'All bookings fetched successfully',
      data,
    });
  }
@Get('allBooking')
async getProviderBookings(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  @Res() res,
  @Req() req,
) {
  
    const providerId = req.user.userId;
  const result = await this.bookingService.getBookingsByProvider(providerId, +page, +limit, order);
  return sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: 'Bookings fetched successfully!',
    data: result,
  });
}


  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto, @Res() res: Response) {
    const data = await this.bookingService.updateBooking(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Booking updated successfully',
      data,
    });
  }

   @Patch('status/:id')
  async updateBookingStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto, @Res() res: Response) {
    const data = await this.bookingService.updateBookingStatus(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Booking status updated successfully',
      data,
    });
  }

  @Get('/locations')
  async getBookingLocations(@Res() res: Response) {
       const data= await this.bookingService.getBookingLocations();
     return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Booking location get successfully',
      data,
    });
  }

 @Patch('work-status/:id')
  async updateWorkStatus(@Param('id') id: string, @Body() dto: UpdateBookingWorkStatusDto, @Res() res: Response) {
    const data = await this.bookingService.updateWorkStatus(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Work status updated successfully',
      data,
    });
  }

   @Patch(':id/payment-status')
  async updatePaymentStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto, @Res() res: Response) {
    const data = await this.bookingService.updatePaymentStatus(id, dto);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Payment status updated successfully',
      data,
    });
  }

  @Get('pending')
  async getPendingBookings(@Req() req, @Res() res: Response) {
    const userId = req.user.userId;
    const data = await this.bookingService.getPendingBookings(userId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Pending bookings fetched successfully',
      data,
    });
  }
  @Get('accept-reject')
  async getAcceptAndRejectedBookings(@Req() req, @Res() res: Response) {
    const userId = req.user.userId;
    const data = await this.bookingService.getAcceptAndRejectedBookings(userId);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'accept-reject bookings fetched successfully',
      data:{
        "total": 12,
        "page": 1,
        "limit": 10,
         "data": data
      },
    });
  }
  @Get('completed')
 async getCompletedBooking( @Req() req, @Res() res:Response) {
     const userId = req.user.userId
      const data = await this.bookingService.getCompletedBookings(userId);;
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Completed bookings fetched successfully',
      data,
    });
    
  }

  @Get(':id')
  async getBookingById(@Param('id') id: string ,@Res() res:Response) {
     const data = await this.bookingService.getBookingById(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Booking details fetched successfully',
      data,
    });
  }
  @Patch('cancelBooking/:id')
  async cancelBooking(@Param('id') id: string , @Res() res:Response) {
    const data = await this.bookingService.cancelBooking(id);
    return sendResponse(res, {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'Booking canceled successfully',
      data,
    });
  }






  
}
