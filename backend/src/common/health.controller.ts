import { Controller, Get, Post } from '@nestjs/common';
import { RedisHealthService } from './redis-health.service';
import { CacheWarmingService } from './cache-warming.service';

@Controller('health')
export class HealthController {
  constructor(
    private redisHealthService: RedisHealthService,
    private cacheWarmingService: CacheWarmingService,
  ) {}

  /**
   * Health check endpoint для проверки состояния Redis
   * GET /health/redis
   */
  @Get('redis')
  async checkRedis() {
    return await this.redisHealthService.getHealthStatus();
  }

  /**
   * Общий health check endpoint
   * GET /health
   */
  @Get()
  async checkHealth() {
    const redis: any = await this.redisHealthService.getHealthStatus();
    
    return {
      status: redis.status === 'up' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Ручной прогрев кеша
   * POST /health/cache/warmup
   */
  @Post('cache/warmup')
  async warmupCache() {
    await this.cacheWarmingService.manualWarmup();
    return { success: true, message: 'Cache warmup initiated' };
  }

  /**
   * Сброс и прогрев кеша
   * POST /health/cache/reset
   */
  @Post('cache/reset')
  async resetCache() {
    return await this.cacheWarmingService.resetAndWarmup();
  }
}
