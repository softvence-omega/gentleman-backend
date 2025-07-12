import { IsDateString, IsISO8601, IsOptional, IsString, IsUUID, Validate } from "class-validator";
import { IsFutureUtcDateConstraint } from "./validateDateite";

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
  @IsISO8601({ strict: true }, { message: 'desireDate must be a valid ISO 8601 string' })
  @Validate(IsFutureUtcDateConstraint)
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
