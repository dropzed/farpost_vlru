import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

export const cacheConfig = (configService: ConfigService): CacheModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  
  const config: CacheModuleOptions = {
    // Используем in-memory store (по умолчанию)
    // TODO: Обновить на cache-manager-redis-yet для Redis support
    ttl: configService.get<number>('REDIS_TTL', 3600) * 1000, // Convert to ms
    max: configService.get<number>('REDIS_MAX_ITEMS', isProduction ? 1000 : 100),
    isGlobal: true,
  };

  // console.log('📦 Cache config:', {
  //   store: 'memory',
  //   ttl: config.ttl,
  //   max: config.max,
  //   isProduction,
  // });

  return config;
};
