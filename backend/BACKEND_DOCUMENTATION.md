# 📚 Backend Documentation - VL.ru Blackouts System

> Полная документация по backend приложению: API, база данных, миграции, кеширование

---

## 📋 Содержание

1. [Архитектура и компоненты](#архитектура-и-компоненты)
2. [Запуск проекта](#запуск-проекта)
2. [API эндпоинты](#api-эндпоинты)
3. [База данных и миграции](#база-данных-и-миграции)
4. [Кеширование и производительность](#кеширование-и-производительность)
5. [Мониторинг и Health Checks](#мониторинг-и-health-checks)
6. [Обработка ошибок](#обработка-ошибок)

---

## Архитектура и компоненты

### Стек технологий

- **Framework:** NestJS 11 (Node.js + TypeScript)
- **ORM:** TypeORM 0.3.27
- **Database:** PostgreSQL 16
- **HTTP Server:** Express
- **Caching Layer:** Redis 7
- **Containerization:** Docker + Docker Compose
- **Cache:** Redis 7
- **Validation:** class-validator, class-transformer
- **Documentation:** Swagger/OpenAPI

### Модульная структура

```
backend/src/
├── app.module.ts                    # Корневой модуль
├── main.ts                          # Entry point
│
├── common/                          # Общие компоненты
│   ├── filters/                     # Фильтры исключений
│   ├── interceptors/                # Интерцепторы (логирование)
│   └── services/                    # Общие сервисы (redis-health, cache-warming)
│
├── config/                          # Конфигурация
│   ├── typeorm.config.ts           # TypeORM runtime config
│   └── typeorm-cli.config.ts       # TypeORM CLI config
│
├── entities/                        # TypeORM сущности
│   ├── blackout.entity.ts
│   ├── building.entity.ts
│   ├── city.entity.ts
│   ├── initiator.entity.ts
│   └── ...
│
├── migrations/                      # Миграции БД
│
├── blackouts_map_info/             # Модуль карты отключений
├── count_blackouts/                # Модуль статистики
├── current_blackouts/              # Модуль текущих отключений
└── management_companies/           # Модуль управляющих компаний
```
---
### Запуск проекта

Запуск проекта осуществаляется через Docker Compose, который находится в корне данного проекта.
Можно запустить бекенд отдельно через Dockerfile, но рекомендуется использовать Docker Compose для удобства и возможности работы с зависимостями (БД, Redis).


---

## API эндпоинты

### Swagger Documentation

API документация доступна по адресу: **http://localhost:3000/api**

В документации представлены все эндпоинты с примерами запросов и ответов.

---

## База данных и миграции


### TypeORM Миграции

#### Зачем нужны миграции в этом проекте?

**Development** (`synchronize: true`):
- ✅ Удобно для разработки
- ❌ Автоматически меняет схему БД
- ❌ Может потерять данные
- ❌ Нет контроля и истории

**Production** (`миграции + migrationsRun: true`):
- ✅ Контролируемые изменения
- ✅ Версионность изменений
- ✅ Возможность отката
- ✅ Безопасность данных
- ✅ Code review изменений БД

#### Команды миграций
Эти команды настроены в `package.json`, там их можно и использовать:
```bash
# Генерация миграции из изменений entities
npm run migration:generate -- src/migrations/MigrationName

# Создание пустой миграции (для ручных изменений)
npm run migration:create -- src/migrations/CustomMigration

# Применить все миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert

# Показать статус миграций
npm run migration:show
```

#### Конфигурация

**Production (автоматическое применение):**
```typescript
// src/config/typeorm.config.ts
{
  synchronize: false,        // Безопасно
  migrationsRun: true,       // Авто-применение при старте
  logging: ['error', 'warn', 'migration']
}
```

**Development (ручное управление):**
```typescript
{
  synchronize: true,         // Автосинхронизация
  migrationsRun: false,      // Вручную через CLI
  logging: true              // Полное логирование
}
```

---

## Кеширование и производительность

### Redis Cache Layer

#### Конфигурация

- **Max memory:** 256MB (dev) / 512MB (prod)
- **Eviction policy:** allkeys-lru (удаление редко используемых ключей)
- **Default TTL:** 3600 секунд (1 час)

#### Стратегия кеширования

Описана в енв переменных, в ней можно менять время сохранения кеша для разных эндпоинтов.


#### Cache Warming (Прогрев кеша)

**Автоматический прогрев** при старте приложения


**Ручной прогрев через API:**

```bash
# Прогреть кеш
curl -X POST http://localhost:3000/health/cache/warmup

# Сбросить и прогреть заново
curl -X POST http://localhost:3000/health/cache/reset
```

---

## Мониторинг и Health Checks

В проекте имеются health check эндпоинты для мониторинга состояния приложения и Redis.


### Redis Health Monitoring

**Автоматический мониторинг:**
- Проверка доступности каждые 30 секунд
- Проверка памяти каждые 5 минут
- Отслеживание последовательных сбоев

**Умные алерты:**
- Алерт при 3 последовательных сбоях
- Алерт при использовании памяти > 90%
- Предупреждение при памяти > 80%
- Предупреждение при hit rate < 50%
- Cooldown 5 минут между алертами

**Уведомления:**
- Автоматическое уведомление (лог) о восстановлении Redis


---

## Обработка ошибок

### Глобальный фильтр исключений

**Файл:** `src/common/filters/http-exception.filter.ts`

Централизованная обработка всех ошибок:
- Перехватывает HttpException и неожиданные ошибки
- Логирует подробную информацию
- Возвращает структурированные ответы


### Валидация данных

**GlobalValidationPipe** настроен с опциями:
- `whitelist: true` - удаляет лишние свойства
- `forbidNonWhitelisted: true` - ошибка при лишних данных
- `transform: true` - автопреобразование типов
- `enableImplicitConversion: true` - неявное преобразование



### Логирование

**LoggingInterceptor** автоматически логирует:
- Входящие запросы с параметрами
- Время выполнения запроса
- Статус ответа
- Детали ошибок (с stack trace)

**Пример логов, они могут выглядеть по-другому, но формат тот же:**
```
[LoggingInterceptor] Incoming request: GET /blackouts/cities/city-vlru
[BlackoutsService] Fetching city with ID: city-vlru
[LoggingInterceptor] Response: GET /blackouts/cities/city-vlru - 45ms
```

---

## Переменные окружения

Конфигурация через `.env.development` и `.env.production` в корне проекта.

Смотрите комментарии в файлах для детального описания каждой переменной.

---

## Быстрые команды

```bash
# Development
docker compose up -d                    # Запустить
docker compose logs -f backend          # Логи
docker compose down                     # Остановить

# Production
docker compose -f docker-compose.prod.yml up -d     # Запустить
docker compose -f docker-compose.prod.yml logs -f   # Логи
docker compose -f docker-compose.prod.yml down      # Остановить

# Миграции
npm run migration:generate -- src/migrations/Name   # Создать
npm run migration:run                               # Применить
npm run migration:revert                            # Откатить
npm run migration:show                              # Статус

# Health проверки
curl http://localhost:3000/health                   # Общий
curl http://localhost:3000/health/redis             # Redis
curl -X POST http://localhost:3000/health/cache/warmup  # Прогрев

# API документация
open http://localhost:3000/api                      # Swagger
```

---

## Troubleshooting

### Проблема: База данных недоступна

```bash
# Проверить статус
docker compose ps

# Проверить логи БД
docker logs db-postgres

# Перезапустить
docker compose restart db-postgres
```

### Проблема: Redis недоступен

```bash
# Проверить статус
curl http://localhost:3000/health/redis

# Проверить логи
docker logs redis-dev

# Прогреть кеш после восстановления
curl -X POST http://localhost:3000/health/cache/warmup
```

### Проблема: Миграция не применяется

```bash
# Проверить статус
npm run migration:show

# Проверить логи
docker logs backend-nest | grep migration

# Применить вручную
npm run migration:run
```

### Проблема: Низкая производительность

```bash
# Проверить Redis
docker exec -it redis-dev redis-cli INFO stats

# Проверить hit rate
docker logs backend-nest | grep "hit rate"

# Прогреть кеш
curl -X POST http://localhost:3000/health/cache/reset
```


---

**Версия:** 1.0.0  
**Дата обновления:** 2025-10-28  
**Автор:** Dropz
