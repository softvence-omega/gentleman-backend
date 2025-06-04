import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { BookingService } from '../service/booking.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';


@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @Patch(':id')
  updateBooking(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.updateBooking(id, dto);
  }

  @Patch('status/:id')
  updateBookingStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingService.updateBookingStatus(id, dto);
  }
  @Patch('cancelBooking/:id')
  canCelBookingStatus(@Param('id') id: string,) {
    return this.bookingService.cancelBooking(id);
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
  getPendingBookings(@Req() req) {
     const userId = req.user.id;
    return this.bookingService.getPendingBookings(userId);  
  }
  @Get('completed')
  getCompletedBookings(@Req() req) {
     const userId = req.user.id;
    return this.bookingService.getPendingBookings(userId);  
  }

  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }


  @Get('provider-locations')
  getAllProviderLocations() {
    return this.bookingService.getAllProviderLocations();
  }

  @Get('user-locations/:userId')
  getUserBookingLocations(@Param('userId') userId: string) {
    return this.bookingService.getUserBookingLocations(userId);
  }

  
}
