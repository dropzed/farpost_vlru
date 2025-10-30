import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagementCompaniesController } from './management_companies.controller';
import { ManagementCompaniesService } from './management_companies.service';
import { Initiator } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Initiator])],
  controllers: [ManagementCompaniesController],
  providers: [ManagementCompaniesService]
})
export class ManagementCompaniesModule {}
