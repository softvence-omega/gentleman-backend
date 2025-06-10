import { IsString, IsUUID } from 'class-validator';

export class CreateVehicleTypeDto {
  @IsString()
  name: string;



  
}
