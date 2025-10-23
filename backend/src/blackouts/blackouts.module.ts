import { Module } from '@nestjs/common';
import { BlackoutsService } from './blackouts.service';
import { BlackoutsController } from './blackouts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  City,
  District,
  FolkDistrict,
  BigFolkDistrict,
  Street,
  Building,
  Blackout,
  BlackoutBuilding,
  Complaint,
  ComplaintInMinute,
} from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      City,
      District,
      FolkDistrict,
      BigFolkDistrict,
      Street,
      Building,
      Blackout,
      BlackoutBuilding,
      Complaint,
      ComplaintInMinute,
    ]),
  ],
  providers: [BlackoutsService],
  controllers: [BlackoutsController],
  exports: [BlackoutsService],
})
export class BlackoutsModule {}
