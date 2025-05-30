import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateLocationDto } from '../dto/create-location.dto';
import { Location } from '../entities/location.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepo: Repository<Location>,
  ) {}

  async create(dto: CreateLocationDto) {
    const location = this.locationRepo.create({
      ...dto,
      latitude: parseFloat(dto.latitude),
      longitude: parseFloat(dto.longitude),
    });

    await this.locationRepo.save(location);
    return location;
  }
}
