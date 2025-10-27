import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class RedisHealthService implements OnModuleInit {
  private readonly logger = new Logger(RedisHealthService.name);
  private redisClient: any;
  private consecutiveFailures = 0;
  private readonly MAX_FAILURES: number;
  private lastAlertTime = 0;
  private readonly ALERT_COOLDOWN: number;

  constructor(private configService: ConfigService) {
    this.MAX_FAILURES = this.configService.get<number>('REDIS_HEALTH_MAX_FAILURES', 3);
    this.ALERT_COOLDOWN = this.configService.get<number>('REDIS_HEALTH_ALERT_COOLDOWN', 300000);
  }

  async onModuleInit() {
    await this.initializeRedisClient();
    this.logger.log('🔍 Redis Health Check initialized');
  }

  private async initializeRedisClient() {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const defaultHost = isProduction 
      ? this.configService.get('REDIS_HOST_PROD', 'redis-prod')
      : this.configService.get('REDIS_HOST_DEV', 'redis-dev');
    const host = this.configService.get('REDIS_HOST') || defaultHost;
    const port = this.configService.get('REDIS_PORT', 6379);
    const password = isProduction ? this.configService.get('REDIS_PASSWORD') : undefined;

    try {
      const maxRetryTime = this.configService.get<number>('REDIS_HEALTH_MAX_RETRY_TIME', 3600000);
      const retryDelay = this.configService.get<number>('REDIS_HEALTH_RETRY_DELAY', 3000);
      
      // Redis v3 syntax
      this.redisClient = redis.createClient({
        host,
        port: Number(port),
        password,
        retry_strategy: (options) => {
          if (options.error && options.error.code === 'ECONNREFUSED') {
            return 5000; // Retry after 5 seconds
          }
          if (options.total_retry_time > maxRetryTime) {
            return undefined; // Stop retrying after configured time
          }
          if (options.attempt > 10) {
            return undefined; // Stop after 10 attempts
          }
          return Math.min(options.attempt * 100, retryDelay);
        },
      });

      this.redisClient.on('error', (err) => {
        this.logger.debug(`Redis connection error: ${err.message}`);
      });

      this.redisClient.on('connect', () => {
        this.logger.log(`✅ Redis Health Check connected to ${host}:${port}`);
      });

      this.redisClient.on('ready', () => {
        this.logger.log(`✅ Redis is ready`);
      });
    } catch (error) {
      this.logger.warn(`⚠️ Failed to initialize Redis client: ${error.message}. Will retry on health checks.`);
      this.redisClient = null;
    }
  }

  /**
   * Проверка здоровья Redis каждые 30 секунд
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkRedisHealth() {
    try {
      // Если клиент не инициализирован или не подключен, пробуем подключиться
      if (!this.redisClient || !this.redisClient.connected) {
        this.logger.debug('Redis client not connected, attempting to reconnect...');
        await this.initializeRedisClient();
        
        if (!this.redisClient || !this.redisClient.connected) {
          throw new Error('Redis client not connected');
        }
      }

      // Проверка PING (callback style для redis v3)
      this.redisClient.ping((err, result) => {
        if (err || result !== 'PONG') {
          this.consecutiveFailures++;
          this.logger.warn(`⚠️ Redis PING failed (${this.consecutiveFailures})`);
          
          if (this.consecutiveFailures >= this.MAX_FAILURES) {
            this.sendAlert(`Redis is DOWN! ${this.consecutiveFailures} consecutive failures detected.`);
          }
        } else {
          // Redis работает нормально
          if (this.consecutiveFailures > 0) {
            this.logger.log('✅ Redis recovered!');
            this.sendRecoveryAlert();
          }
          this.consecutiveFailures = 0;
          
          // Получаем метрики Redis
          this.logRedisMetrics();
        }
      });
    } catch (error) {
      this.consecutiveFailures++;
      
      // Логируем только каждую 3-ю ошибку, чтобы не спамить
      if (this.consecutiveFailures % 3 === 0) {
        this.logger.warn(`⚠️ Redis health check failed (${this.consecutiveFailures}): ${error.message}`);
      }

      if (this.consecutiveFailures >= this.MAX_FAILURES) {
        await this.sendAlert(`Redis is DOWN! ${this.consecutiveFailures} consecutive failures detected.`);
      }
    }
  }

  /**
   * Проверка использования памяти каждые 5 минут
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkMemoryUsage() {
    try {
      if (!this.redisClient || !this.redisClient.connected) {
        return;
      }

      this.redisClient.info('memory', (err, info) => {
        if (err || !info) return;

        const usedMemory = this.extractValue(info, 'used_memory_human');
        const maxMemory = this.extractValue(info, 'maxmemory_human');
        const memoryUsagePercent = parseFloat(this.extractValue(info, 'used_memory_rss') || '0');
        const maxMemoryBytes = parseFloat(this.extractValue(info, 'maxmemory') || '0');

        if (maxMemoryBytes > 0) {
          const usagePercent = (memoryUsagePercent / maxMemoryBytes) * 100;

          if (usagePercent > 90) {
            this.sendAlert(`⚠️ Redis memory usage is HIGH: ${usagePercent.toFixed(2)}% (${usedMemory} / ${maxMemory})`);
          } else if (usagePercent > 80) {
            this.logger.warn(`⚠️ Redis memory usage: ${usagePercent.toFixed(2)}% (${usedMemory} / ${maxMemory})`);
          }
        }
      });
    } catch (error) {
      this.logger.error(`Failed to check memory usage: ${error.message}`);
    }
  }

  /**
   * Логирование метрик Redis
   */
  private logRedisMetrics() {
    try {
      if (!this.redisClient || !this.redisClient.connected) {
        // Redis не подключен (используется in-memory cache)
        return;
      }

      this.redisClient.info('stats', (err, info) => {
        if (err || !info) return;

        const hits = this.extractValue(info, 'keyspace_hits');
        const misses = this.extractValue(info, 'keyspace_misses');

        if (hits && misses) {
          const totalHits = parseInt(hits);
          const totalMisses = parseInt(misses);
          const total = totalHits + totalMisses;
          
          // Проверяем что есть хоть какая-то активность
          if (total === 0) {
            // Нет активности, не логируем
            return;
          }
          
          const hitRate = (totalHits / total) * 100;
          
          if (hitRate < 50) {
            this.logger.warn(`⚠️ Low cache hit rate: ${hitRate.toFixed(2)}% (Hits: ${hits}, Misses: ${misses})`);
          } else {
            this.logger.debug(`📊 Cache hit rate: ${hitRate.toFixed(2)}% (Hits: ${hits}, Misses: ${misses})`);
          }
        }
      });
    } catch (error) {
      // Не логируем ошибки если Redis не используется
      return;
    }
  }

  /**
   * Отправка алерта
   */
  private async sendAlert(message: string) {
    const now = Date.now();
    
    // Защита от спама алертами (cooldown 5 минут)
    if (now - this.lastAlertTime < this.ALERT_COOLDOWN) {
      return;
    }

    this.lastAlertTime = now;
    
    this.logger.error(`🚨 ALERT: ${message}`);
    
    // Здесь можно добавить отправку уведомлений:
    // - Email (nodemailer)
    // - Telegram Bot
    // - Slack Webhook
    // - SMS (Twilio)
    // - PagerDuty
    
    // Пример для будущей интеграции:
    await this.sendToMonitoring({
      severity: 'critical',
      service: 'Redis',
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Уведомление о восстановлении
   */
  private sendRecoveryAlert() {
    this.logger.log('✅ RECOVERY: Redis is back online');
    
    // Отправка уведомления о восстановлении
    this.sendToMonitoring({
      severity: 'info',
      service: 'Redis',
      message: 'Redis connection recovered',
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Отправка в систему мониторинга (заглушка для будущей интеграции)
   */
  private async sendToMonitoring(data: any) {
    // TODO: Интеграция с системой мониторинга
    // Например: Prometheus, Grafana, ELK Stack, Sentry
    
    const webhookUrl = this.configService.get('MONITORING_WEBHOOK_URL');
    
    if (webhookUrl) {
      try {
        // await fetch(webhookUrl, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(data),
        // });
        this.logger.debug('Alert sent to monitoring system');
      } catch (error) {
        this.logger.error(`Failed to send to monitoring: ${error.message}`);
      }
    }
  }

  /**
   * Вспомогательная функция для извлечения значений из INFO
   */
  private extractValue(info: string, key: string): string | null {
    const regex = new RegExp(`${key}:(.+)`);
    const match = info.match(regex);
    return match ? match[1].trim() : null;
  }

  /**
   * Получение статуса Redis для health check endpoint
   */
  async getHealthStatus() {
    try {
      if (!this.redisClient || !this.redisClient.connected) {
        return { status: 'down', message: 'Redis client not connected' };
      }

      return new Promise((resolve) => {
        this.redisClient.ping((err) => {
          if (err) {
            resolve({
              status: 'down',
              message: err.message,
              consecutiveFailures: this.consecutiveFailures,
            });
          } else {
            resolve({
              status: 'up',
              consecutiveFailures: this.consecutiveFailures,
              lastCheck: new Date().toISOString(),
            });
          }
        });
      });
    } catch (error) {
      return {
        status: 'down',
        message: error.message,
        consecutiveFailures: this.consecutiveFailures,
      };
    }
  }
}
