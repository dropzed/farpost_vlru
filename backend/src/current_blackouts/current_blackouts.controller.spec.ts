import { Test, TestingModule } from '@nestjs/testing';
import { CurrentBlackoutsController } from './current_blackouts.controller';

describe('CurrentBlackoutsController', () => {
  let controller: CurrentBlackoutsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrentBlackoutsController],
    }).compile();

    controller = module.get<CurrentBlackoutsController>(CurrentBlackoutsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
