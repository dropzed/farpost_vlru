import { Test, TestingModule } from '@nestjs/testing';
import { ManagementCompaniesService } from './management_companies.service';

describe('ManagementCompaniesService', () => {
  let service: ManagementCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ManagementCompaniesService],
    }).compile();

    service = module.get<ManagementCompaniesService>(ManagementCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
