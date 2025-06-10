import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Booking, { BookingStatus } from '../entity/booking.entity';
import { Repository } from 'typeorm';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto, UpdateBookingStatusDto, UpdateBookingWorkStatusDto, UpdatePaymentStatusDto } from '../dto/update-booking.dto';
import ApiError from 'src/common/errors/ApiError';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { VehicleTypeEntity } from 'src/modules/vehicleTypes/entity/vehicle-type.entity';
import { CategoryEntity } from 'src/modules/category/entity/category.entity';
import { User } from 'src/modules/user/entities/user.entity';


@Injectable()
export class BookingService {
  constructor(
 
      @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(VehicleTypeEntity)
    private readonly vehicleTypeRepo: Repository<VehicleTypeEntity>,

    @InjectRepository(User)
    private readonly providerRepo: Repository<User>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly cloudinary: CloudinaryService,


  

  ) { }

   async createBooking(
    dto: CreateBookingDto,
    userId: string,
    images: Express.Multer.File[],
    vehicleImage?: Express.Multer.File,
  ): Promise<Booking> {
    // Validate foreign keys exist

    const vehicleTypeExists = await this.vehicleTypeRepo.findOneBy({ id: dto.vehicleTypesId });
    if (!vehicleTypeExists) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid vehicleTypesId: not found');
    }

    const providerExists = await this.providerRepo.findOneBy({ id: dto.providerId });
    if (!providerExists) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid providerId: not found');
    }

    const categoryExists = await this.categoryRepo.findOneBy({ id: dto.categoryId });
    if (!categoryExists) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid categoryId: not found');
    }
    console.log(userId)
    const userExists = await this.userRepo.findOneBy({ id: userId });
    if (!userExists) {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'Invalid userId: not found');
    }

    // Upload images

    let imageUrls: string[] = [];
    let vehicleImageUrl: string | null | undefined = null;

    if (images.length) {
      try {
        const uploadPromises = images.map(file =>
          this.cloudinary.uploadImage(file.buffer),
        );

        const results = await Promise.all(uploadPromises);
        imageUrls = results.map(res => res.secure_url);
      } catch (error) {
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Image upload failed',
        );
      }
    }

    if (vehicleImage) {
      try {
        const result = await this.cloudinary.uploadImage(vehicleImage.buffer);
        vehicleImageUrl = result.secure_url;
      } catch (error) {
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Vehicle image upload failed',
        );
      }
    }

    dto.vehicleImage = vehicleImageUrl ?? undefined;

    const booking = this.bookingRepo.create({
      ...dto,
      vehicleType: { id: dto.vehicleTypesId },
      user: { id: userId },
      provider: { id: dto.providerId },
      category: { id: dto.categoryId },
      dentImg: imageUrls,
    });

    return this.bookingRepo.save(booking);
  }
  async updateBooking(id: string, dto: UpdateBookingDto): Promise<Booking> {
    const booking = await this.getBookingById(id);

    Object.assign(booking, {
      ...dto,
      vehicleType: dto.vehicleTypesId ? { id: dto.vehicleTypesId } : booking.vehicleType,
      user: dto.userId ? { id: dto.userId } : booking.user,
      provider: dto.providerId ? { id: dto.providerId } : booking.provider,
      category: dto.categoryId ? { id: dto.categoryId } : booking.category,

    });

    return this.bookingRepo.save(booking);
  }

  async updateBookingStatus(id: string, dto: UpdateBookingStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.status = dto.status;
    return this.bookingRepo.save(booking);
  }

  async updateWorkStatus(id: string, dto: UpdateBookingWorkStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.workStatus = dto.workStatus;
    return this.bookingRepo.save(booking);
  }

  async updatePaymentStatus(id: string, dto: UpdatePaymentStatusDto): Promise<Booking> {
    const booking = await this.getBookingById(id);
    booking.paymentStatus = dto.paymentStatus;
    return this.bookingRepo.save(booking);
  }

  async getPendingBookings(): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { status: BookingStatus.Pending },
      relations: ['user', 'provider', 'vehicleType', 'category', 'payment', 'reviews'],
    });
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['user', 'provider', 'vehicleType', 'category', 'payment', 'reviews'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }
}
