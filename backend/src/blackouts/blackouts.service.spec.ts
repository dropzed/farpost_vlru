import { Test, TestingModule } from '@nestjs/testing';
import { BlackoutsService } from './blackouts.service';

describe('BlackoutsService', () => {
  let service: BlackoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlackoutsService],
    }).compile();

    service = module.get<BlackoutsService>(BlackoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
