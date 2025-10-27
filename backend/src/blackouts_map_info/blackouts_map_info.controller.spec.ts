import { Test, TestingModule } from '@nestjs/testing';
import { BlackoutsMapInfoController } from './blackouts_map_info.controller';

describe('BlackoutsMapInfoController', () => {
  let controller: BlackoutsMapInfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlackoutsMapInfoController],
    }).compile();

    controller = module.get<BlackoutsMapInfoController>(
      BlackoutsMapInfoController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
