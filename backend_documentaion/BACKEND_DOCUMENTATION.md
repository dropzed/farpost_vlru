# 📚 Backend Documentation - VL.ru Blackouts System

> Полная документация по backend приложению: API, база данных, миграции, кеширование

---

## 📋 Содержание

1. [Концепция проекта](#концепция-проекта)
2. [Архитектура и компоненты](#архитектура-и-компоненты)
3. [Модель данных](#модель-данных)
4. [Запуск проекта](#запуск-проекта)
5. [API эндпоинты](#api-эндпоинты)
6. [База данных и миграции](#база-данных-и-миграции)
7. [Кеширование и производительность](#кеширование-и-производительность)
8. [Мониторинг и Health Checks](#мониторинг-и-health-checks)
9. [Обработка ошибок](#обработка-ошибок)

> 💡 **Tip:** Визуальные диаграммы архитектуры доступны в [ARCHITECTURE_DIAGRAMS.md](ARCHITECTURE_DIAGRAMS.md) и [FULL_ERD_DIAGRAM.md](FULL_ERD_DIAGRAM.md)

---

## Концепция проекта

### 🎯 Идея

**VL.ru Blackouts System** - это интеллектуальная система мониторинга и анализа коммунальных отключений во Владивостоке. Проект создан для решения реальной проблемы горожан: отсутствия централизованной, структурированной и удобной информации об авариях электро-, водо- и теплоснабжения.

### 🔍 Проблематика

Жители Владивостока регулярно сталкиваются с:
- **Разрозненностью информации** - данные об отключениях публикуются на разных сайтах и в разных форматах
- **Неполнотой данных** - часто нет прогноза окончания работ, контактов ответственных организаций
- **Неудобством доступа** - информация не структурирована, сложно найти данные по своему адресу
- **Отсутствием аналитики** - нет понимания общей картины проблем в городе

### 💡 Решение

Backend система предоставляет:

#### 1. **Централизованное хранилище данных**
   - Единая база данных всех отключений
   - Структурированная информация по домам, улицам, районам
   - Геолокация каждого здания для карты

#### 2. **RESTful API с богатой функциональностью**
   - Получение текущих и исторических отключений
   - Фильтрация по типам (электричество, холодная/горячая вода, отопление)
   - Статистика по районам и управляющим компаниям
   - Поиск по адресам

#### 3. **Высокая производительность**
   - Redis кеширование для быстрого отклика
   - Автоматический прогрев кеша при старте
   - Оптимизированные SQL запросы с индексами

#### 4. **Надежность и мониторинг**
   - Health checks для контроля состояния системы
   - Автоматические бэкапы базы данных
   - Логирование всех операций

### 🎬 Сценарии использования

**Для жителей города (через frontend):**
- Узнать о текущих отключениях в своем доме
- Посмотреть прогноз окончания работ
- Найти контакты управляющей компании
- Увидеть историю аварий в районе

**Для аналитиков и журналистов:**
- Получить статистику отключений по районам
- Сравнить работу управляющих компаний
- Проанализировать динамику аварий

**Для городских служб:**
- Мониторить общую ситуацию в городе
- Выявлять проблемные районы и дома
- Планировать профилактические работы

---

## Архитектура и компоненты

### 🏗️ Архитектурная схема

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                    (Frontend)                                    │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP/REST
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      NestJS APPLICATION                          │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Global Middleware & Interceptors                          │  │
│  │  ├─ ValidationPipe (class-validator)                       │  │
│  │  ├─ AllExceptionsFilter (error handling)                   │  │
│  │  └─ LoggingInterceptor (request/response logging)          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                             │                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  API Controllers Layer                                     │  │
│  │  ├─ BlackoutsMapInfoController (/blackouts-map-info)       │  │
│  │  ├─ CurrentBlackoutsController (/current-blackouts)        │  │
│  │  ├─ CountBlackoutsController   (/count-blackouts)          │  │
│  │  ├─ ManagementCompaniesController (/management-companies)  │  │
│  │  └─ HealthController           (/health)                   │  │
│  └────────────────┬───────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼───────────────────────────────────────────┐  │
│  │  Business Logic Layer (Services)                           │  │
│  │  ├─ BlackoutsMapInfoService                                │  │
│  │  ├─ CurrentBlackoutsService                                │  │
│  │  ├─ CountBlackoutsService                                  │  │
│  │  ├─ ManagementCompaniesService                             │  │
│  │  ├─ CacheWarmingService (cache preloading)                 │  │
│  │  └─ RedisHealthService (monitoring)                        │  │
│  └────────────────┬───────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼───────────────────────────────────────────┐  │
│  │  Data Access Layer                                         │  │
│  │  ├─ TypeORM Repositories                                   │  │
│  │  ├─ QueryBuilder (complex queries)                         │  │
│  │  └─ Entity Relations Management                            │  │
│  └────────────────┬───────────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────────┘
                    │
        ┌───────────┴──────────────┐
        ▼                          ▼
┌─────────────────┐        ┌──────────────────┐
│  Redis Cache    │        │  PostgreSQL DB   │
│                 │        │                  │        
└─────────────────┘        └──────────────────┘                
                          
```

### 🎯 Принципы архитектуры

**1. Модульность (NestJS Modules)**
- Каждая функциональная область изолирована в отдельном модуле
- Модули импортируют только необходимые зависимости
- Легко тестировать и поддерживать

**2. Separation of Concerns**
- Controllers - только маршрутизация и валидация
- Services - вся бизнес-логика
- Repositories - только доступ к данным
- DTOs - контракты данных между слоями

**3. Dependency Injection**
- Все зависимости инжектируются через конструктор
- Упрощает тестирование и замену реализаций
- Управление жизненным циклом объектов

**4. Single Responsibility**
- Каждый класс отвечает за одну задачу
- Сервисы разбиты по доменам (blackouts, companies, statistics)

**5. Performance First**
- Двухуровневое кеширование (Redis + in-memory)
- Автоматический прогрев кеша при старте
- Оптимизированные SQL запросы с JOIN

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

### 🔐 Безопасность API

**Валидация входных данных:**
- Все DTO проверяются class-validator
- Автоматическое преобразование типов
- Защита от SQL-инъекций через TypeORM

**Обработка ошибок:**
- Централизованный error handler
- Структурированные сообщения об ошибках
- Логирование всех исключений


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


#### 🔥 Cache Warming (Прогрев кеша)

**Автоматический прогрев** при старте приложения

**Процесс:**
1. При запуске приложения автоматически вызываются все тяжелые запросы
2. Данные загружаются в Redis
3. Первый пользовательский запрос получает мгновенный ответ

**Ручной прогрев через API:**

```bash
# Прогреть кеш заново
curl -X POST http://localhost:3000/health/cache/warmup

# Сбросить весь кеш и прогреть
curl -X POST http://localhost:3000/health/cache/reset
```

**Когда использовать:**
- После обновления данных в БД
- После миграций
- При деградации hit rate

#### 📊 Мониторинг производительности кеша

**Метрики:**
- **Hit Rate** - процент запросов из кеша (цель: >80%)
- **Memory Usage** - использование памяти Redis
- **Keys Count** - количество закешированных ключей
- **Eviction Count** - количество вытесненных ключей

**Автоматические алерты:**
- ⚠️ Hit rate < 50% - низкая эффективность кеша
- ⚠️ Memory usage > 80% - близко к лимиту
- 🔴 Memory usage > 90% - критично, начнется eviction

**Проверка метрик:**
```bash
# Напрямую в Redis
docker exec -it redis-dev redis-cli INFO stats
```

---

## Мониторинг и Health Checks

В проекте имеются health check эндпоинты для мониторинга состояния приложения и Redis.

### 🏥 Система мониторинга

```
┌────────────────────────────────────────────────┐
│         Health Monitoring System               │
├────────────────────────────────────────────────┤
│                                                │
│  ┌──────────────────┐   ┌──────────────────┐   │
│  │  Health          │   │  Redis Health    │   │
│  │  Controller      │   │  Service         │   │
│  │                  │   │                  │   │
│  │  /health         │──▶│  • Connection    │   │
│  │  /health/redis   │   │  • Memory        │   │
│  │  /cache/warmup   │   │  • Hit Rate      │   │
│  └──────────────────┘   │  • Alerts        │   │
│           │             └──────────────────┘   │
│           │                      │             │
│           ▼                      ▼             │
│  ┌──────────────────┐   ┌──────────────────┐   │
│  │  PostgreSQL      │   │  Redis           │   │
│  │  Connection      │   │  Connection      │   │
│  └──────────────────┘   └──────────────────┘   │
│                                                │
│  ┌──────────────────────────────────────────┐  │
│  │  Logging Interceptor                     │  │
│  │  • Request logging                       │  │
│  │  • Response time                         │  │
│  │  • Error tracking                        │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

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


**Интеграция с внешними системами (на будущее):**
- Готово для интеграции с Prometheus/Grafana
- Структурированные JSON логи для ELK Stack
- HTTP endpoints для мониторинга (Zabbix, Nagios)

---

### 🚨 Алертинг

**Уровни алертов:**

**🔴 CRITICAL (требует немедленного действия):**
- Redis недоступен > 3 попыток
- PostgreSQL недоступна
- Memory usage > 95%
- Error rate > 10%

**⚠️ WARNING (требует внимания):**
- Cache hit rate < 50%
- Memory usage > 80%
- Response time > 500ms
- Последовательные ошибки

**ℹ️ INFO (информационные):**
- Redis восстановлен
- Кеш прогрет успешно
- Миграция выполнена

**Пример алертов в логах (они могут немного отличатся по мере разработки):**
```
[WARN] Redis memory usage is high: 85.2%
[CRITICAL] Redis connection failed after 3 attempts
[INFO] Redis connection restored, cache warming started
```

### 📝 Логирование

**LoggingInterceptor** автоматически логирует:
- Входящие запросы с параметрами
- Время выполнения запроса
- Статус ответа
- Детали ошибок (с stack trace)

**Пример логов (они могут отличаться):**
```
[LoggingInterceptor] Incoming request: GET /current-blackouts/date/2025-01-15
  Query params: {}
  Body: undefined

[CurrentBlackoutsService] Checking cache for key: blackouts:date:2025-01-15
[CurrentBlackoutsService] Cache miss, fetching from database

[TypeORM] SELECT ... FROM blackouts ... WHERE start_date <= $1 AND (end_date >= $1 OR end_date IS NULL)

[CurrentBlackoutsService] Found 12 blackouts for date 2025-01-15
[CurrentBlackoutsService] Cached result with TTL 300s

[LoggingInterceptor] Response: GET /current-blackouts/date/2025-01-15 - 187ms
  Status: 200
  Data size: 4.2 KB
```

---

## Обработка ошибок

### Глобальный фильтр исключений

**Файл:** `src/common/filters/http-exception.filter.ts`

Централизованная обработка всех ошибок:
- Перехватывает HttpException и неожиданные ошибки
- Логирует подробную информацию
- Возвращает структурированные ответы

### 🛡️ Архитектура обработки ошибок

```
┌──────────────────┐
│   HTTP Request   │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────────────┐
│  ValidationPipe                 │
│  • DTO validation               │
│  • Type transformation          │
│  • Whitelist filtering          │
└────────┬────────────────────────┘
         │ ❌ Validation Error
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌──────────────────┐   ┌──────────────────────┐
│   Controller     │   │  AllExceptionsFilter │
│   (throws error) │   │                      │
└────────┬─────────┘   │  • HTTP exceptions   │
         │             │  • Unexpected errors │
         │ ❌ Error    │  • Structured logs   │
         └────────────▶│ • User-friendly msg │
                       └──────────┬───────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Error Response │
                         │  (JSON)         │
                         └─────────────────┘
```

---

### 🔧 Troubleshooting Guide

**Проблема: Валидация не работает**
```bash
# Проверить, что ValidationPipe зарегистрирован глобально
grep -r "useGlobalPipes" src/main.ts
```

**Проблема: Ошибки не логируются**
```bash
# Проверить AllExceptionsFilter
grep -r "useGlobalFilters" src/main.ts

# Проверить логи
docker logs backend-nest | grep "Error"
```

**Проблема: 500 ошибки при обращении к БД**
```bash
# Проверить подключение к PostgreSQL
docker exec backend-nest psql $DATABASE_URL -c "SELECT 1"

# Проверить логи БД
docker logs db-postgres
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

**Автор:** Dropz
