# 🚨 Алерты и 🔥 Cache Warming

## Обзор

Система включает два ключевых компонента для повышения надежности и производительности:

1. **Redis Health Monitoring & Alerts** - мониторинг здоровья Redis с автоматическими алертами
2. **Cache Warming** - предварительный прогрев кеша при старте приложения

---

## 🚨 Система алертов (Redis Health Monitoring)

### Возможности

✅ **Автоматический мониторинг:**
- Проверка доступности Redis каждые 30 секунд
- Проверка использования памяти каждые 5 минут
- Отслеживание метрик (hit rate, misses)
- Детекция последовательных сбоев

✅ **Умные алерты:**
- Алерт при 3 последовательных сбоях
- Алерт при использовании памяти > 90%
- Предупреждение при использовании памяти > 80%
- Предупреждение при низком hit rate < 50%
- Cooldown 5 минут между алертами (защита от спама)

✅ **Уведомления о восстановлении:**
- Автоматическое уведомление когда Redis снова доступен

### Конфигурация

Алерты настраиваются в `src/common/services/redis-health.service.ts`:

```typescript
private readonly MAX_FAILURES = 3;           // Кол-во сбоев для алерта
private readonly ALERT_COOLDOWN = 5 * 60 * 1000;  // 5 минут cooldown
```

### Health Check Endpoints

GET  /health              # Общий health check
GET  /health/redis        # Проверка Redis
POST /health/cache/warmup # Ручной прогрев кеша
POST /health/cache/reset  # Сброс и прогрев кеша

# Проверить health
curl http://localhost:3000/health

# Проверить Redis
curl http://localhost:3000/health/redis

# Прогреть кеш вручную
curl -X POST http://localhost:3000/health/cache/warmup

# Перезагрузить кеш
curl -X POST http://localhost:3000/health/cache/reset


**Проверка Redis:**
```bash
GET http://localhost:3000/health/redis

# Response:
{
  "status": "up",
  "consecutiveFailures": 0,
  "lastCheck": "2025-10-26T15:00:00.000Z"
}
```

**Общий health check:**
```bash
GET http://localhost:3000/health

# Response:
{
  "status": "healthy",
  "timestamp": "2025-10-26T15:00:00.000Z",
  "services": {
    "redis": {
      "status": "up",
      "consecutiveFailures": 0,
      "lastCheck": "2025-10-26T15:00:00.000Z"
    }
  }
}
```

---

## 🔥 Cache Warming

### Что это?

Cache Warming (прогрев кеша) - это процесс предварительного заполнения кеша часто используемыми данными **при старте приложения**.


### Что прогревается?

1. **Города** (`/blackouts/cities`) - TTL 6 часов
2. **Здания** (`/blackouts/buildings`) - TTL 12 часов
3. **Аварии** (`/blackouts/getAll`) - TTL 15 минут
4. **Статистика по типам** (`/count-blackouts/types`) - TTL 1 час
5. **Исторические данные** (декабрь 2019) - TTL 24 часа

## Стратегия кеширования по эндпоинтам

| Эндпоинт | TTL | Причина |
|----------|-----|---------|
| `/blackouts-map-info/december-2019` | 24 часа (86400s) | Исторические данные, не меняются |
| `/count-blackouts/types` | 1 час (3600s) | Статистика обновляется редко |
| `/blackouts/cities` | 6 часов (21600s) | Список городов стабилен |
| `/blackouts/buildings` | 12 часов (43200s) | Справочник зданий меняется редко |
| `/blackouts/getAll` | 15 минут (900s) | Текущие аварии могут обновляться |
| `/blackouts/cities/:id` | Не кешируется | Быстрый запрос, параметризованный |

### Автоматический прогрев

Кеш прогревается автоматически при старте приложения:

```typescript
async onModuleInit() {
  this.logger.log('🔥 Starting cache warming...');
  await this.warmupCache();
}
```

### Ручной прогрев через API

**Прогреть весь кеш:**
```bash
POST http://localhost:3000/health/cache/warmup

# Response:
{
  "success": true,
  "message": "Cache warmup initiated"
}
```

**Сбросить и прогреть кеш:**
```bash
POST http://localhost:3000/health/cache/reset

# Response:
{
  "success": true,
  "message": "Cache reset and warmed successfully"
}
```

### Логи

При старте приложения вы увидите:

```
[CacheWarmingService] 🔥 Starting cache warming...
[CacheWarmingService] 🔥 Warming up cities cache...
[CacheWarmingService] ✅ Cities cache warmed: 5 cities
[CacheWarmingService] 🔥 Warming up buildings cache...
[CacheWarmingService] ✅ Buildings cache warmed: 234 buildings
[CacheWarmingService] 🔥 Warming up blackouts cache...
[CacheWarmingService] ✅ Blackouts cache warmed: 1523 blackouts
[CacheWarmingService] ✅ Cache warming completed! Success: 5, Errors: 0, Duration: 2341ms
```


## 🔧 Настройка


### 1. Настройка периодичности

В `redis-health.service.ts` можно изменить частоту проверок:

```typescript
// Каждые 30 секунд (по умолчанию)
@Cron(CronExpression.EVERY_30_SECONDS)
async checkRedisHealth() { ... }

// Каждые 5 минут (по умолчанию)
@Cron(CronExpression.EVERY_5_MINUTES)
async checkMemoryUsage() { ... }

// Другие варианты:
// CronExpression.EVERY_10_SECONDS
// CronExpression.EVERY_MINUTE
// CronExpression.EVERY_HOUR
```

### 3. Добавление новых эндпоинтов для прогрева

В `cache-warming.service.ts`:

```typescript
private async warmupMyNewEndpoint() {
  try {
    this.logger.debug('🔥 Warming up my new endpoint...');
    
    const data = await this.myRepository.find();
    await this.cacheManager.set('/my-endpoint', data, 3600000);
    
    this.logger.log(`✅ My endpoint cache warmed: ${data.length} items`);
  } catch (error) {
    this.logger.error(`❌ Failed to warm my endpoint: ${error.message}`);
  }
}

// Добавьте в warmupCache():
async warmupCache() {
  // ... существующие прогревы
  await this.warmupMyNewEndpoint();
  successCount++;
}
```

---

## 📊 Мониторинг в продакшене

### Docker Logs

Просмотр логов алертов:

```bash
# Development
docker logs -f backend-nest --tail=100 | grep -E "(ALERT|Redis|Cache)"

# Production
docker logs -f backend-nest-prod --tail=100 | grep -E "(ALERT|Redis|Cache)"
```

### Redis CLI Monitoring

```bash
# Подключение к Redis
docker exec -it redis-prod redis-cli -a "CHANGE_ME_REDIS_PASSWORD_456"

# Просмотр логов в реальном времени
MONITOR

# Статистика
INFO stats

# Использование памяти
INFO memory
```

```bash
# Health check для мониторинга
curl http://localhost:3000/health

# Проверка только Redis
curl http://localhost:3000/health/redis
```

---

## 🎯 Best Practices

### ✅ Рекомендации

1. **Настройте алерты в продакшене:**
   - Интегрируйте с Telegram/Slack для instant уведомлений
   - Настройте PagerDuty для критичных алертов

2. **Мониторьте метрики:**
   - Hit rate должен быть > 80%
   - Использование памяти < 80%
   - Consecutive failures = 0

3. **Используйте Cache Warming:**
   - При деплое новой версии
   - После перезапуска Redis
   - После восстановления после сбоя

4. **Регулярно проверяйте логи:**
   - Ищите паттерны сбоев
   - Анализируйте использование памяти
   - Оптимизируйте TTL на основе метрик

### ❌ Чего избегать

1. Не игнорируйте алерты о низком hit rate
2. Не запускайте прогрев кеша во время высокой нагрузки
3. Не забывайте про cooldown между алертами
4. Не прогревайте редко используемые данные

---

## 🚀 Примеры использования

### Scenario 1: Деплой новой версии

```bash
# 1. Остановить старый контейнер
docker-compose -f docker-compose.prod.yml down backend-nest-prod

# 2. Запустить новый контейнер
docker-compose -f docker-compose.prod.yml up -d backend-nest-prod

# 3. Проверить логи прогрева
docker logs -f backend-nest-prod | grep "Cache warming"

# 4. Проверить health
curl http://localhost:3000/health
```

### Scenario 2: Redis перезапустился

```bash
# После перезапуска Redis кеш пуст
# Вручную запустить прогрев:
curl -X POST http://localhost:3000/health/cache/warmup

# Проверить логи:
docker logs -f backend-nest-prod | grep "Cache"
```

### Scenario 3: Низкий hit rate

```bash
# 1. Проверить статистику Redis
docker exec -it redis-prod redis-cli -a "PASSWORD" INFO stats

# 2. Проверить какие ключи есть
docker exec -it redis-prod redis-cli -a "PASSWORD" KEYS "*"

# 3. Запустить прогрев
curl -X POST http://localhost:3000/health/cache/warmup

# 4. Подождать 30 секунд и проверить снова
docker exec -it redis-prod redis-cli -a "PASSWORD" INFO stats
```

---

## 🔍 Troubleshooting

### Проблема: Алерты не приходят

**Решение:**
1. Проверьте логи: `docker logs backend-nest-prod | grep ALERT`
2. Убедитесь что `MONITORING_WEBHOOK_URL` настроен
3. Проверьте cooldown период (5 минут по умолчанию)

### Проблема: Cache warming не работает

**Решение:**
1. Проверьте логи: `docker logs backend-nest-prod | grep "Cache warming"`
2. Убедитесь что подключение к БД работает
3. Проверьте что Redis доступен

### Проблема: Высокое использование памяти Redis

**Решение:**
1. Проверьте количество ключей: `KEYS *` (в Redis CLI)
2. Уменьшите TTL для некритичных данных
3. Увеличьте `maxmemory` в docker-compose.yml
4. Очистите старые ключи: `FLUSHDB`

---

### Компоненты

1. **Redis** - внешнее хранилище кеша
2. **CacheModule** - модуль NestJS для управления кешем
3. **CacheInterceptor** - перехватчик для автоматического кеширования
4. **CacheTTL** - декоратор для настройки времени жизни кеша



При старте вы увидите логи:

```
[CacheWarmingService] 🔥 Starting cache warming...
[CacheWarmingService] ✅ Cities cache warmed: 5 cities
[CacheWarmingService] ✅ Buildings cache warmed: 234 buildings
[CacheWarmingService] ✅ Blackouts cache warmed: 1523 blackouts
[CacheWarmingService] ✅ Cache warming completed! Duration: 2341ms
[RedisHealthService] 🔍 Redis Health Check initialized
```


### Примеры логов:

**Успешный прогрев:**
```
[CacheWarmingService] 🔥 Starting cache warming...
[CacheWarmingService] ✅ Cache warming completed! Success: 5, Errors: 0, Duration: 2341ms
```

**Redis работает нормально:**
```
[RedisHealthService] 📊 Cache hit rate: 86.32% (Hits: 1523, Misses: 234)
```

**Проблема с Redis:**
```
[RedisHealthService] ❌ Redis health check failed (3/3): Connection refused
[RedisHealthService] 🚨 ALERT: Redis is DOWN! 3 consecutive failures detected.
```

**Восстановление:**
```
[RedisHealthService] ✅ Redis recovered!
[RedisHealthService] ✅ RECOVERY: Redis is back online
```

---