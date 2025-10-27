import { Injectable, Logger, OnModuleInit, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Blackout } from '../blackouts/entities/blackout.entity';
import { City } from '../blackouts/entities/city.entity';
import { Building } from '../blackouts/entities/building.entity';
import { BlackoutsMapInfoService } from '../blackouts_map_info/blackouts_map_info.service';

/**
 * Сервис для предварительного заполнения кеша (Cache Warming)
 * Запускается при старте приложения и прогревает часто используемые данные
 */
@Injectable()
export class CacheWarmingService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmingService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(City)
    private cityRepository: Repository<City>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Blackout)
    private blackoutRepository: Repository<Blackout>,
    private blackoutsMapInfoService: BlackoutsMapInfoService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Запускаем прогрев кеша при старте приложения
    this.logger.log('🔥 Starting cache warming...');
    await this.warmupCache();
  }

  /**
   * Прогрев всех критичных эндпоинтов
   */
  async warmupCache() {
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    try {
      // 1. Прогрев списка городов (используется очень часто)
      await this.warmupCities();
      successCount++;
      
      // 2. Прогрев списка зданий
      await this.warmupBuildings();
      successCount++;
      
      // 3. Прогрев списка всех аварий
      await this.warmupBlackouts();
      successCount++;
      
      // 4. Прогрев статистики по типам
      await this.warmupBlackoutTypes();
      successCount++;
      
      // 5. Прогрев исторических данных за декабрь 2019
      await this.warmupDecember2019Data();
      successCount++;

      const duration = Date.now() - startTime;
      this.logger.log(`✅ Cache warming completed! Success: ${successCount}, Errors: ${errorCount}, Duration: ${duration}ms`);
    } catch (error) {
      errorCount++;
      this.logger.error(`❌ Cache warming failed: ${error.message}`);
    }
  }

  /**
   * Прогрев кеша городов
   */
  private async warmupCities() {
    try {
      this.logger.debug('🔥 Warming up cities cache...');
      
      const cities = await this.cityRepository.find();
      const ttl = this.configService.get<number>('CACHE_TTL_CITIES', 21600) * 1000; // Convert to ms
      await this.cacheManager.set('/blackouts/cities', cities, ttl);
      
      this.logger.log(`✅ Cities cache warmed: ${cities.length} cities`);
    } catch (error) {
      this.logger.error(`❌ Failed to warm cities cache: ${error.message}`);
    }
  }

  /**
   * Прогрев кеша зданий
   */
  private async warmupBuildings() {
    try {
      this.logger.debug('🔥 Warming up buildings cache...');
      
      const buildings = await this.buildingRepository.find({
        relations: ['city'],
      });
      const ttl = this.configService.get<number>('CACHE_TTL_BUILDINGS', 43200) * 1000; // Convert to ms
      await this.cacheManager.set('/blackouts/buildings', buildings, ttl);
      
      this.logger.log(`✅ Buildings cache warmed: ${buildings.length} buildings`);
    } catch (error) {
      this.logger.error(`❌ Failed to warm buildings cache: ${error.message}`);
    }
  }

  /**
   * Прогрев кеша аварий
   */
  private async warmupBlackouts() {
    try {
      this.logger.debug('🔥 Warming up blackouts cache...');
      
      const blackouts = await this.blackoutRepository.find({
        relations: ['blackoutBuildings', 'blackoutBuildings.building', 'blackoutBuildings.building.city'],
        order: {
          startDate: 'DESC',
        },
      });
      const ttl = this.configService.get<number>('CACHE_TTL_ALL', 900) * 1000; // Convert to ms
      await this.cacheManager.set('/blackouts/getAll', blackouts, ttl);
      
      this.logger.log(`✅ Blackouts cache warmed: ${blackouts.length} blackouts`);
    } catch (error) {
      this.logger.error(`❌ Failed to warm blackouts cache: ${error.message}`);
    }
  }

  /**
   * Прогрев кеша статистики по типам
   */
  private async warmupBlackoutTypes() {
    try {
      this.logger.debug('🔥 Warming up blackout types statistics...');
      
      const types = await this.blackoutRepository
        .createQueryBuilder('blackout')
        .select('blackout.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('blackout.type')
        .getRawMany();
      
      // Подсчитываем общее количество
      const total = types.reduce((sum, item) => sum + parseInt(item.count, 10), 0);
      
      const result = {
        total,
        types,
      };
      
      const ttl = this.configService.get<number>('CACHE_TTL_TYPES', 3600) * 1000; // Convert to ms
      await this.cacheManager.set('/count-blackouts/types', result, ttl);
      
      this.logger.log(`✅ Blackout types cache warmed: ${types.length} types, total: ${total}`);
    } catch (error) {
      this.logger.error(`❌ Failed to warm types cache: ${error.message}`);
    }
  }

  /**
   * Прогрев кеша исторических данных за декабрь 2019
   */
  private async warmupDecember2019Data() {
    try {
      this.logger.debug('🔥 Warming up December 2019 historical data...');
      
      // Используем сервис для получения данных в правильном формате
      const data = await this.blackoutsMapInfoService.getDecember2019Blackouts();
      
      const ttl = this.configService.get<number>('CACHE_TTL_DECEMBER_2019', 86400) * 1000; // Convert to ms
      await this.cacheManager.set('/blackouts-map-info/december-2019', data, ttl);
      
      this.logger.log(`✅ December 2019 data cache warmed: ${data.length} records`);
    } catch (error) {
      this.logger.error(`❌ Failed to warm December 2019 cache: ${error.message}`);
    }
  }

  /**
   * Ручной прогрев кеша (можно вызвать через API endpoint)
   */
  async manualWarmup() {
    this.logger.log('🔥 Manual cache warmup triggered');
    return await this.warmupCache();
  }

  /**
   * Очистка и перезагрузка кеша
   */
  async resetAndWarmup() {
    this.logger.log('🔄 Resetting cache and warming up...');
    
    try {
      // Очищаем весь кеш (удаляем все ключи)
      // Примечание: cache-manager не имеет метода reset()
      // Поэтому мы просто запускаем прогрев заново
      this.logger.log('✅ Preparing to warm cache');
      
      // Прогреваем заново
      await this.warmupCache();
      
      return { success: true, message: 'Cache warmed successfully' };
    } catch (error) {
      this.logger.error(`❌ Failed to warm cache: ${error.message}`);
      return { success: false, message: error.message };
    }
  }

  /**
   * Прогрев конкретного кеша по ключу
   */
  async warmupSpecific(key: string) {
    this.logger.log(`🔥 Warming up specific cache: ${key}`);
    
    switch (key) {
      case 'cities':
        return await this.warmupCities();
      case 'buildings':
        return await this.warmupBuildings();
      case 'blackouts':
        return await this.warmupBlackouts();
      case 'types':
        return await this.warmupBlackoutTypes();
      case 'december2019':
        return await this.warmupDecember2019Data();
      default:
        this.logger.warn(`Unknown cache key: ${key}`);
    }
  }
}
