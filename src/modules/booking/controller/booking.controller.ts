import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';


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
  @UploadedFiles() files: { image?: Express.Multer.File[], vehicleImage?: Express.Multer.File[]; },
  @Body() dto: CreateBookingDto,
 @Req() req
) {
  const userId = req.user.userId;
  console.log( userId)
  return this.bookingService.createBooking(dto,userId ,files.image || [] ,files?.vehicleImage?.[0] );
}

   @Get('/locations')
  getallLocations(@Param('id') id: string) {
    return this.bookingService.findAllLocations()
  }



   @Get("allBooking")
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'], example: 'DESC' })
  async getAllBookings(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.bookingService.getAllBookings(page, limit, order);
  }

 


  @Patch(':id')
  updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, dto);
  }

  @Patch('status/:id')
  updateBookingStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateBookingStatus(id, dto);
  }

  @Patch('work-status/:id')
  updateWorkStatus(@Param('id') id: string, @Body() dto: UpdateBookingWorkStatusDto) {
    return this.bookingService.updateWorkStatus(id, dto);
  }

  @Patch(':id/payment-status')
  updatePaymentStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.bookingService.updatePaymentStatus(id, dto);
  }

  @Get('pending')
  getPendingBookings( @Req() req) {
     const userId = req.user.userId
    return this.bookingService.getPendingBookings(userId);
  }
  @Get('completed')
  getCompletedBooking( @Req() req) {
     const userId = req.user.userId
    return this.bookingService.getCompletedBookings(userId);
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }
  @Patch('cancelBooking/:id')
  cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancelBooking(id)
  }






  
}
