import { Controller, Get, Query, Inject, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { ManagementCompaniesService } from './management_companies.service';
import { InitiatorResponseDto } from './dto/initiator-response.dto';

@ApiTags('Управляющие компании')
@Controller('management-companies')
export class ManagementCompaniesController {
  private readonly logger = new Logger(ManagementCompaniesController.name);

  constructor(
    private readonly managementCompaniesService: ManagementCompaniesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  @Get('initiators')
  @ApiOperation({ summary: 'Получить список всех управляющих компаний' })
  @ApiResponse({ status: 200, description: 'Список компаний', type: [InitiatorResponseDto] })
  async getAllInitiators(): Promise<InitiatorResponseDto[]> {
    const cacheKey = '/management-companies/initiators';
    
    // Проверяем кэш
    const cached = await this.cacheManager.get<InitiatorResponseDto[]>(cacheKey);
    
    if (cached) {
      this.logger.debug(`✅ Cache HIT for key: ${cacheKey}`);
      return cached;
    }
    
    this.logger.debug(`❌ Cache MISS for key: ${cacheKey}`);
    
    // Получаем данные из БД
    const data = await this.managementCompaniesService.getAllInitiators();
    
    // Сохраняем в кэш
    const ttl = this.configService.get<number>('CACHE_TTL_INITIATORS', 21600) * 1000;
    await this.cacheManager.set(cacheKey, data, ttl);
    this.logger.debug(`💾 Saved to cache: ${cacheKey} (TTL: ${ttl}ms)`);
    
    return data;
  }

  @Get('initiators/search')
  @ApiOperation({ summary: 'Поиск управляющей компании по названию' })
  @ApiQuery({ name: 'name', required: true, description: 'Название управляющей компании для поиска' })
  @ApiResponse({ status: 200, description: 'Результаты поиска', type: [InitiatorResponseDto] })
  @ApiResponse({ status: 404, description: 'Управляющие компании не найдены' })
  async searchInitiators(@Query('name') name: string): Promise<InitiatorResponseDto[]> {
    return this.managementCompaniesService.searchInitiatorsByName(name);
  }
}
