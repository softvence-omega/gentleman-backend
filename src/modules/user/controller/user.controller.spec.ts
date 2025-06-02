import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../service/user.service';

describe('ControllerController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn(() => Promise.resolve([])),
            findOne: jest.fn((id: string) =>
              Promise.resolve({ id, name: 'Test User' }),
            ),
            create: jest.fn((dto) => Promise.resolve({ id: '1', ...dto })),
            update: jest.fn((id: string, dto) =>
              Promise.resolve({ id, ...dto }),
            ),
            remove: jest.fn((id: string) => Promise.resolve({ id })),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
