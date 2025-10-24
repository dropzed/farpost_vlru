import { Test, TestingModule } from '@nestjs/testing';
import { CountBlackoutsService } from './count_blackouts.service';

describe('CountBlackoutsService', () => {
  let service: CountBlackoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountBlackoutsService],
    }).compile();

    service = module.get<CountBlackoutsService>(CountBlackoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
