import { Test, TestingModule } from '@nestjs/testing';
import { ServiceDetailController } from './controller.controller';

describe('ControllerController', () => {
  let controller: ServiceDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceDetailController],
    }).compile();

    controller = module.get<ServiceDetailController>(ServiceDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
