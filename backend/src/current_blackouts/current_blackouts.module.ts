import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrentBlackoutsService } from './current_blackouts.service';
import { CurrentBlackoutsController } from './current_blackouts.controller';
import { Blackout } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Blackout])],
  providers: [CurrentBlackoutsService],
  controllers: [CurrentBlackoutsController]
})
export class CurrentBlackoutsModule {}
