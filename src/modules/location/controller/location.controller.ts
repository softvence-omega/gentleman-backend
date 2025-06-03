// src/location/location.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LocationService } from '../service/location.service';
import { CreateLocationDto } from '../dto/create-location.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post('/')
  create(@Body() dto: CreateLocationDto) {
    return this.locationService.create(dto);
  }
}
