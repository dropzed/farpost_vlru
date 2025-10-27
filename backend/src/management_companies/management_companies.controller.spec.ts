import { Test, TestingModule } from '@nestjs/testing';
import { ManagementCompaniesController } from './management_companies.controller';

describe('ManagementCompaniesController', () => {
  let controller: ManagementCompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagementCompaniesController],
    }).compile();

    controller = module.get<ManagementCompaniesController>(ManagementCompaniesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
