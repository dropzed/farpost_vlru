import { Test, TestingModule } from '@nestjs/testing';
import { BlackoutsController } from './blackouts.controller';

describe('BlackoutsController', () => {
  let controller: BlackoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlackoutsController],
    }).compile();

    controller = module.get<BlackoutsController>(BlackoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
