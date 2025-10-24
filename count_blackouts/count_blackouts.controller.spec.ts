import { Test, TestingModule } from '@nestjs/testing';
import { CountBlackoutsController } from './count_blackouts.controller';

describe('CountBlackoutsController', () => {
  let controller: CountBlackoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountBlackoutsController],
    }).compile();

    controller = module.get<CountBlackoutsController>(CountBlackoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
