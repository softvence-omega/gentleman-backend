import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';


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
) {
  return this.bookingService.createBooking(dto, files.image || [] ,files?.vehicleImage?.[0]  );
}


  @Patch(':id')
  updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, dto);
  }

  @Patch(':id/status')
  updateBookingStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateBookingStatus(id, dto);
  }

  @Patch(':id/work-status')
  updateWorkStatus(@Param('id') id: string, @Body() dto: UpdateBookingWorkStatusDto) {
    return this.bookingService.updateWorkStatus(id, dto);
  }

  @Patch(':id/payment-status')
  updatePaymentStatus(@Param('id') id: string, @Body() dto: UpdatePaymentStatusDto) {
    return this.bookingService.updatePaymentStatus(id, dto);
  }

  @Get('pending')
  getPendingBookings() {
    return this.bookingService.getPendingBookings();
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }
}
