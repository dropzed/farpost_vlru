import { Test, TestingModule } from '@nestjs/testing';
import { BlackoutsMapInfoService } from './blackouts_map_info.service';

describe('BlackoutsMapInfoService', () => {
  let service: BlackoutsMapInfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlackoutsMapInfoService],
    }).compile();

    service = module.get<BlackoutsMapInfoService>(BlackoutsMapInfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
