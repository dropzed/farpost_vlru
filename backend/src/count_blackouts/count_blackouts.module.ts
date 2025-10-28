import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountBlackoutsService } from './count_blackouts.service';
import { CountBlackoutsController } from './count_blackouts.controller';
import { Blackout } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Blackout])],
  providers: [CountBlackoutsService],
  controllers: [CountBlackoutsController]
})
export class CountBlackoutsModule {}
