import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Blackout} from '../entities';
import {CurrentBlackoutResponseDto} from './dto';

@Injectable()
export class CurrentBlackoutsService {
  constructor(
    @InjectRepository(Blackout)
    private readonly blackoutsRepo: Repository<Blackout>,
  ) {}

  /**
   * Получения отключения по строке даты (и проверка на валидность)
   */
  async getBlackoutsByDateString(dateStr: string): Promise<CurrentBlackoutResponseDto[]> {
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) {
      throw new BadRequestException('Некорректный формат даты. Используйте формат YYYY-MM-DD');
    }

    return this.getBlackoutsByDate(date);
  }

  /**
   * Получить отключения по объекту Date (получение даты и отправка в маппер)
   */
  async getBlackoutsByDate(date: Date): Promise<CurrentBlackoutResponseDto[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const blackouts = await this.blackoutsRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.blackoutBuildings', 'bb')
      .leftJoinAndSelect('bb.building', 'bld')
      .leftJoinAndSelect('bld.district', 'd')
      .leftJoinAndSelect('bld.street', 's')
      .where('b.start_date <= :endOfDay', { endOfDay })
      .andWhere('(b.end_date IS NULL OR b.end_date >= :startOfDay)', { startOfDay })
      .getMany();

    return this.mapBlackoutsToDto(blackouts);
  }

  // Маппинг сущностей Blackout в DTO для ответа
  private mapBlackoutsToDto(blackouts: Blackout[]): CurrentBlackoutResponseDto[] {
    const results: CurrentBlackoutResponseDto[] = [];

    for (const blackout of blackouts) {
      if (!blackout.blackoutBuildings || blackout.blackoutBuildings.length === 0) {
        continue;
      }

      for (const bb of blackout.blackoutBuildings) {
        if (!bb.building) continue;

        results.push({
          district: bb.building.district?.name || 'Не указан',
          street: bb.building.street?.name || 'Не указана',
          buildingNumber: bb.building.number || 'Не указан',
          startDate: blackout.startDate,
          endDate: blackout.endDate || null,
          type: blackout.type || 'Не указан',
          description: blackout.description || 'Нет описания',
        });
      }
    }

    return results;
  }
}
