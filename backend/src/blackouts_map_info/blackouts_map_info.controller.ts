import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { BlackoutsMapInfoService } from './blackouts_map_info.service';
import { December2019BlackoutDto } from './dto';
import { ConfigService } from '@nestjs/config';

@ApiTags('blackouts-map-info')
@Controller('blackouts-map-info')
export class BlackoutsMapInfoController {
  private readonly logger = new Logger(BlackoutsMapInfoController.name);

  constructor(
    private readonly blackoutsMapInfoService: BlackoutsMapInfoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  @Get('december-2019')
  @ApiOperation({
    summary: 'Получить все поломки за декабрь 2019 года',
    description:
      'Возвращает список всех поломок (электричество, отопление, вода) за декабрь 2019 года с координатами и адресами для отображения на карте',
  })
  @ApiResponse({
    status: 200,
    description: 'Список поломок успешно получен',
    type: [December2019BlackoutDto],
  })
  async getDecember2019Blackouts(): Promise<December2019BlackoutDto[]> {
    const cacheKey = '/blackouts-map-info/december-2019';
    
    // Проверяем кэш
    const cached = await this.cacheManager.get<December2019BlackoutDto[]>(cacheKey);
    
    if (cached) {
      this.logger.debug(`✅ Cache HIT for key: ${cacheKey}`);
      return cached;
    }
    
    this.logger.debug(`❌ Cache MISS for key: ${cacheKey}`);
    
    // Получаем данные из БД
    const data = await this.blackoutsMapInfoService.getDecember2019Blackouts();
    
    // Сохраняем в кэш
    const ttl = this.configService.get<number>('CACHE_TTL_DECEMBER_2019', 86400) * 1000;
    await this.cacheManager.set(cacheKey, data, ttl);
    this.logger.debug(`💾 Saved to cache: ${cacheKey} (TTL: ${ttl}ms)`);
    
    return data;
  }
}
