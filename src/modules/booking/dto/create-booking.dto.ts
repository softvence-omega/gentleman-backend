import { IsDateString, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateBookingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  price: string;
  
  @IsOptional()
  @IsString()
  DetailsDescription?: string;

 

   @IsOptional()
  @IsUUID()
  vehicleId?: string;

  
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
  providerId: string;

  @IsString()
  categoryId: string;
}
