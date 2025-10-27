import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blackout } from '../entities/blackout.entity';
import { BlackoutBuilding } from '../entities/blackout-building.entity';
import { Building } from '../entities/building.entity';
import { Street } from '../entities/street.entity';
import { City } from '../entities/city.entity';
import { December2019BlackoutDto } from './dto';

@Injectable()
export class BlackoutsMapInfoService {
  private readonly logger = new Logger(BlackoutsMapInfoService.name);

  constructor(
    @InjectRepository(Blackout)
    private blackoutRepository: Repository<Blackout>,
    @InjectRepository(BlackoutBuilding)
    private blackoutBuildingRepository: Repository<BlackoutBuilding>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Street)
    private streetRepository: Repository<Street>,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  async getDecember2019Blackouts(): Promise<December2019BlackoutDto[]> {
    this.logger.log('Fetching December 2019 blackouts');

    // Оптимизированный запрос с TypeORM QueryBuilder
    const results = await this.blackoutRepository
      .createQueryBuilder('b')
      .innerJoin('blackouts_buildings', 'bb', 'b.id = bb.blackout_id')
      .innerJoin('buildings', 'bld', 'bb.building_id = bld.id')
      .leftJoin('streets', 's', 'bld.street_id = s.id')
      .leftJoin('cities', 'c', 'bld.city_id = c.id')
      .select('b.type', 'type')
      .addSelect('b.description', 'description')
      .addSelect('bld.latitude', 'latitude')
      .addSelect('bld.longitude', 'longitude')
      .addSelect('c.name', 'city_name')
      .addSelect('s.name', 'street_name')
      .addSelect('bld.number', 'building_number')
      .where('b.start_date >= :startDate', { startDate: '2019-12-01 00:00:00' })
      .andWhere('b.start_date < :endDate', { endDate: '2020-01-01 00:00:00' })
      .getRawMany();

    this.logger.log(`Found ${results.length} blackout records for December 2019`);

    // Формируем результат
    const blackouts: December2019BlackoutDto[] = results.map((row) => ({
      latitude: parseFloat(row.latitude) || 0,
      longitude: parseFloat(row.longitude) || 0,
      fullAddress: this.buildFullAddress(
        row.city_name,
        row.street_name,
        row.building_number,
      ),
      type: row.type,
      description: row.description || 'Информация отсутствует',
    }));

    return blackouts;
  }

  private buildFullAddress(
    cityName?: string,
    streetName?: string,
    buildingNumber?: string,
  ): string {
    const parts: string[] = [];

    if (cityName) {
      parts.push(cityName);
    }

    if (streetName) {
      parts.push(streetName);
    }

    if (buildingNumber) {
      parts.push(`д. ${buildingNumber}`);
    }

    return parts.join(', ') || 'Адрес не указан';
  }
}
