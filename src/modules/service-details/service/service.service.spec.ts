import { Test, TestingModule } from '@nestjs/testing';
import { ServiceDetail } from './service.service';

describe('ServiceService', () => {
  let service: ServiceDetail;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceDetail],
    }).compile();

    service = module.get<ServiceDetail>(ServiceDetail);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
