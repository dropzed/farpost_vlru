import {CacheModuleOptions} from '@nestjs/cache-manager';
import {ConfigService} from '@nestjs/config';

export const cacheConfig = (configService: ConfigService): CacheModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';

  // вывод параметров кеша в консоль для отладки, можно раскомментировать при необходимости
  // console.log(' Cache config:', {
  //   store: 'memory',
  //   ttl: config.ttl,
  //   max: config.max,
  //   isProduction,
  // });

  return {
      // Использование in-memory store (по умолчанию)
      ttl: configService.get<number>('REDIS_TTL', 3600) * 1000, // Convert to ms
      max: configService.get<number>('REDIS_MAX_ITEMS', isProduction ? 1000 : 100),
      isGlobal: true,
  };
};
