import {Inject, Injectable, Logger, OnModuleInit} from '@nestjs/common';
import {CACHE_MANAGER} from '@nestjs/cache-manager';
import type {Cache} from 'cache-manager';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {ConfigService} from '@nestjs/config';
import {Blackout} from '../entities';
import {BlackoutsMapInfoService} from '../blackouts_map_info/blackouts_map_info.service';

/**
 * Сервис для предварительного заполнения кеша (Cache Warming)
 * Запускается при старте приложения и прогревает часто используемые данные
 */
@Injectable()
export class CacheWarmingService implements OnModuleInit {
  private readonly logger = new Logger(CacheWarmingService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Blackout)
    private blackoutRepository: Repository<Blackout>,
    private blackoutsMapInfoService: BlackoutsMapInfoService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    // Запуск прогрева кеша при старте приложения
    this.logger.log(' Starting cache warming...');
    await this.warmupCache();
  }


  // Прогрев критичных эндпоинтов
  async warmupCache() {
    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    try {
      // Прогрев статистики по типам
      await this.warmupBlackoutTypes();
      successCount++;
      
      // Прогрев исторических данных за декабрь 2019
      await this.warmupDecember2019Data();
      successCount++;

      const duration = Date.now() - startTime;
      this.logger.log(` Cache warming completed! Success: ${successCount}, Errors: ${errorCount}, Duration: ${duration}ms`);
    } catch (error) {
      errorCount++;
      this.logger.error(` Cache warming failed: ${error.message}`);
    }
  }


  // Прогрев кеша статистики по типам
  private async warmupBlackoutTypes() {
    try {
      this.logger.debug('🔥 Warming up blackout types statistics...');
      
      const types = await this.blackoutRepository
        .createQueryBuilder('blackout')
        .select('blackout.type', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('blackout.type')
        .getRawMany();
      
      // Подсчет общего количества отключений
      const total = types.reduce((sum, item) => sum + parseInt(item.count, 10), 0);
      
      const result = {
        total,
        types,
      };
      
      const ttl = this.configService.get<number>('CACHE_TTL_TYPES', 3600) * 1000; // Convert to ms
      await this.cacheManager.set('/count-blackouts/types', result, ttl);
      
      this.logger.log(` Blackout types cache warmed: ${types.length} types, total: ${total}`);
    } catch (error) {
      this.logger.error(` Failed to warm types cache: ${error.message}`);
    }
  }

  /**
   * Прогрев кеша данных за декабрь 2019
   */
  private async warmupDecember2019Data() {
    try {
      this.logger.debug(' Warming up December 2019 data...');
      
      // Используем сервис для получения данных в правильном формате
      const data = await this.blackoutsMapInfoService.getDecember2019Blackouts();
      
      const ttl = this.configService.get<number>('CACHE_TTL_DECEMBER_2019', 86400) * 1000; // Конвертирование в мс
      await this.cacheManager.set('/blackouts-map-info/december-2019', data, ttl);
      
      this.logger.log(` December 2019 data cache warmed: ${data.length} records`);
    } catch (error) {
      this.logger.error(` Failed to warm December 2019 cache: ${error.message}`);
    }
  }

  /**
   * Ручной прогрев кеша (можно вызвать через API endpoint)
   */
  async manualWarmup() {
    this.logger.log('🔥 Manual cache warmup triggered');
    await this.warmupCache();
    return { 
      success: true, 
      message: 'Cache warmup initiated' 
    };
  }

  /**
   * Очистка и перезагрузка кеша
   */
  async resetAndWarmup() {
    const startTime = Date.now();
    this.logger.log('🔄 Resetting cache and warming up...');
    
    try {
      // Получение store Redis для очистки
      const redisStore = this.cacheManager.stores as any;
      let clearedKeys = 0;
      
      // Очистка кеша
      if (redisStore && typeof redisStore.reset === 'function') {
        await redisStore.reset();
        clearedKeys = -1; // Все ключи очищены
        this.logger.log('✅ Cache cleared successfully');
      } else {
        this.logger.log('⚠️ Cache store does not support reset, warming cache directly');
      }
      
      // Прогрев данных заново
      await this.warmupCache();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(3);
      
      return { 
        success: true, 
        message: 'Cache reset and warmup completed',
        clearedKeys: clearedKeys === -1 ? 'all' : clearedKeys,
        warmedKeys: 2, // types + december2019
        duration: `${duration}s`
      };
    } catch (error) {
      this.logger.error(`❌ Failed to reset and warm cache: ${error.message}`);
      return { 
        success: false, 
        message: 'Failed to reset cache',
        error: error.message 
      };
    }
  }
}
