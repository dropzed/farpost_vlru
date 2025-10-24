import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blackout } from '../blackouts/entities';
import { BlackoutTypesCountDto } from './dto';

@Injectable()
export class CountBlackoutsService {
  constructor(
    @InjectRepository(Blackout)
    private blackoutRepository: Repository<Blackout>,
  ) {}

  async getBlackoutTypesCounts(): Promise<BlackoutTypesCountDto> {
    const counts = await this.blackoutRepository
      .createQueryBuilder('blackout')
      .select('blackout.type', 'type')
      .addSelect('COUNT(*)', 'count')
      .groupBy('blackout.type')
      .getRawMany();

    const result: BlackoutTypesCountDto = {
      electricity: 0,
      cold_water: 0,
      hot_water: 0,
      heat: 0,
    };

    counts.forEach((item) => {
      const type = item.type;
      const count = parseInt(item.count, 10);
      if (type in result) {
        result[type] = count;
      }
    });

    return result;
  }
}
