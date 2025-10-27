import { Module, Global } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisHealthService } from './redis-health.service';
import { CacheWarmingService } from './cache-warming.service';
import { HealthController } from './health.controller';
import { City } from '../blackouts/entities/city.entity';
import { Building } from '../blackouts/entities/building.entity';
import { Blackout } from '../blackouts/entities/blackout.entity';
import { BlackoutsMapInfoModule } from '../blackouts_map_info/blackouts_map_info.module';

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([City, Building, Blackout]),
    BlackoutsMapInfoModule,
  ],
  controllers: [HealthController],
  providers: [RedisHealthService, CacheWarmingService],
  exports: [RedisHealthService, CacheWarmingService],
})
export class CommonModule {}
