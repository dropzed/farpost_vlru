import { Controller, Get, Post } from '@nestjs/common';
import { RedisHealthService } from './redis-health.service';
import { CacheWarmingService } from './cache-warming.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health & Monitoring')
@Controller('health')
export class HealthController {
  constructor(
    private redisHealthService: RedisHealthService,
    private cacheWarmingService: CacheWarmingService,
  ) {}

    // Health check endpoint для проверки состояния Redis
  @Get('redis')
  @ApiOperation({ 
    summary: 'Проверка состояния подключения к Redis',
    description: 'Возвращает детальную информацию о состоянии подключения к Redis, включая статус, время последней проверки и количество неудачных попыток подключения.'
  })
  @ApiResponse({
    status: 200,
    description: 'Статус Redis успешно получен',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['up', 'down'],
          description: 'Статус подключения к Redis',
          example: 'up'
        },
        message: {
          type: 'string',
          description: 'Описание текущего состояния',
          example: 'Redis is healthy'
        },
        lastCheck: {
          type: 'string',
          format: 'date-time',
          description: 'Время последней проверки подключения',
          example: '2025-10-28T04:30:00.000Z'
        },
        consecutiveFailures: {
          type: 'number',
          description: 'Количество последовательных неудачных попыток подключения',
          example: 0
        }
      }
    }
  })
  @ApiResponse({
    status: 503,
    description: 'Redis недоступен',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'down'
        },
        message: {
          type: 'string',
          example: 'Redis connection failed'
        },
        lastCheck: {
          type: 'string',
          example: '2025-10-28T04:30:00.000Z'
        },
        consecutiveFailures: {
          type: 'number',
          example: 3
        }
      }
    }
  })
  async checkRedis() {
    return await this.redisHealthService.getHealthStatus();
  }


  // Общий health check endpoint бекенда
  @Get()
  @ApiOperation({
    summary: 'Общий health check API',
    description: 'Проверяет общее состояние приложения, включая состояние Redis и возвращает агрегированный статус здоровья системы. Используется для мониторинга и проверки доступности сервиса.'
  })
  @ApiResponse({
    status: 200,
    description: 'Система работает нормально',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: ['healthy', 'unhealthy'],
          description: 'Общий статус здоровья системы',
          example: 'healthy'
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          description: 'Время проверки',
          example: '2025-10-28T04:30:15.123Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 503,
    description: 'Система работает с ошибками',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'unhealthy'
        },
        timestamp: {
          type: 'string',
          example: '2025-10-28T04:30:15.123Z'
        }
      }
    }
  })
  async checkHealth() {
    return await this.redisHealthService.getOverallHealthStatus();
  }


  // Ручной прогрев кеша
  @Post('cache/warmup')
  @ApiOperation({ 
    summary: 'Ручной прогрев кеша',
    description: 'Инициирует процесс ручного прогрева кеша для улучшения производительности. Запускает асинхронную предзагрузку часто используемых данных в Redis кеш. Используется после очистки кеша или при деплое новой версии.'
  })
  @ApiResponse({
    status: 200,
    description: 'Прогрев кеша успешно инициирован',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Флаг успешного выполнения операции',
          example: true
        },
        message: {
          type: 'string',
          description: 'Сообщение о статусе операции',
          example: 'Cache warmup initiated'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при прогреве кеша',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: 'Failed to initiate cache warmup'
        },
        error: {
          type: 'string',
          example: 'Redis connection timeout'
        }
      }
    }
  })
  async warmupCache() {
    return await this.cacheWarmingService.manualWarmup();
  }


  // Сброс и прогрев кеша
  @Post('cache/reset')
  @ApiOperation({ 
    summary: 'Сброс и прогрев кеша',
    description: 'Полностью очищает текущий кеш Redis и запускает процесс его прогрева заново. Используется для принудительного обновления всех кешированных данных. ВНИМАНИЕ: Временно может снизить производительность системы.'
  })
  @ApiResponse({
    status: 200,
    description: 'Кеш успешно сброшен и прогрет',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          description: 'Флаг успешного выполнения операции',
          example: true
        },
        message: {
          type: 'string',
          description: 'Сообщение о статусе операции',
          example: 'Cache reset and warmup completed'
        },
        clearedKeys: {
          type: 'number',
          description: 'Количество очищенных ключей в кеше',
          example: 42
        },
        warmedKeys: {
          type: 'number',
          description: 'Количество прогретых ключей',
          example: 5
        },
        duration: {
          type: 'string',
          description: 'Время выполнения операции',
          example: '1.234s'
        }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Ошибка при сбросе кеша',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: 'Failed to reset cache'
        },
        error: {
          type: 'string',
          example: 'Redis FLUSHDB command failed'
        }
      }
    }
  })
  async resetCache() {
    return await this.cacheWarmingService.resetAndWarmup();
  }
}
