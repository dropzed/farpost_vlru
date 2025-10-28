import {Inject, Injectable, Logger} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import type {Cache} from 'cache-manager';
import {ConfigService} from '@nestjs/config';
import {Blackout, BlackoutBuilding, Building, City, Street} from '../entities';
import {December2019BlackoutDto} from './dto';

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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  /**
   * Получить данные за декабрь 2019 с кешированием
   */
  async getDecember2019BlackoutsWithCache(): Promise<December2019BlackoutDto[]> {
    const cacheKey = '/blackouts-map-info/december-2019';
    
    // Проверка кэша
    const cached = await this.cacheManager.get<December2019BlackoutDto[]>(cacheKey);
    
    if (cached) {
      this.logger.debug(`✅ Cache HIT for key: ${cacheKey}`);
      return cached;
    }
    
    this.logger.debug(`❌ Cache MISS for key: ${cacheKey}`);
    
    // Получение данных из БД
    const data = await this.getDecember2019Blackouts();
    
    // Сохранение в кэш
    const ttl = this.configService.get<number>('CACHE_TTL_DECEMBER_2019', 86400) * 1000;
    await this.cacheManager.set(cacheKey, data, ttl);
    this.logger.debug(`💾 Saved to cache: ${cacheKey} (TTL: ${ttl}ms)`);
    
    return data;
  }

  /**
   * Получить данные за декабрь 2019 из БД
   */
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

    // Формирование результата на вывод
      return results.map((row) => ({
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
