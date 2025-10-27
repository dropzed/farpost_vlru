import { Test, TestingModule } from '@nestjs/testing';
import { CurrentBlackoutsService } from './current_blackouts.service';

describe('CurrentBlackoutsService', () => {
  let service: CurrentBlackoutsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrentBlackoutsService],
    }).compile();

    service = module.get<CurrentBlackoutsService>(CurrentBlackoutsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
