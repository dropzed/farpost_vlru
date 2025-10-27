import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlackoutsMapInfoController } from './blackouts_map_info.controller';
import { BlackoutsMapInfoService } from './blackouts_map_info.service';
import { Blackout } from '../entities/blackout.entity';
import { BlackoutBuilding } from '../entities/blackout-building.entity';
import { Building } from '../entities/building.entity';
import { Street } from '../entities/street.entity';
import { City } from '../entities/city.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Blackout,
      BlackoutBuilding,
      Building,
      Street,
      City,
    ]),
  ],
  controllers: [BlackoutsMapInfoController],
  providers: [BlackoutsMapInfoService],
  exports: [BlackoutsMapInfoService],
})
export class BlackoutsMapInfoModule {}
