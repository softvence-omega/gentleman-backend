import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateBookingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsString()
  DetailsDescription: string;

 @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsDateString()
  year?: string;

  @IsOptional()
  @IsString()
  vehicleImage?: string;

  @IsString()
  desireDate: string;


  @IsString()
  longitude: string;

  @IsString()
  latitude: string;

  @IsOptional()
  @IsString()
  vehicleTypesId: string;

  @IsString()
  userId: string;

  @IsString()
  providerId: string;

  @IsString()
  categoryId: string;
}
