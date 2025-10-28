# 🔌 VL.ru - Система мониторинга отключений коммунальных услуг

> **Хакатон проект** - Интеллектуальная платформа для отслеживания и анализа отключений электроэнергии, воды и отопления во Владивостоке

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 📋 Содержание

- [О проекте](#-о-проекте)
- [Архитектура](#-архитектура)
- [Основные возможности](#-основные-возможности)
- [Технологический стек](#-технологический-стек)
- [Быстрый старт](#-быстрый-старт)
- [Система бэкапов](#-система-бэкапов)
- [API документация](#-api-документация)
- [Мониторинг и здоровье системы](#-мониторинг-и-здоровье-системы)
- [Структура проекта](#-структура-проекта)
- [База данных](#-База-данных)
- [Производительность](#-производительность)
- [Запуск проекта](#-запуск)

---

## 🎯 О проекте

**VL.ru Blackouts Monitoring** - это современная веб-платформа для мониторинга и анализа плановых и аварийных отключений коммунальных услуг во Владивостоке.

### Проблема

Жители города ежедневно сталкиваются с отключениями электричества, воды и отопления, но информация о них разрознена, неполная и часто недоступна.

### Решение

Мы создали централизованную систему, которая:
- 📊 Собирает и структурирует данные об отключениях из официальных источников
- 🗺️ Визуализирует информацию на интерактивной карте города
- 📈 Предоставляет статистику и аналитику по районам и типам отключений
- ⚡ Возможность работы в реальном времени с минимальными задержками
- 📱 Доступна на мобильных и десктоп устройствах

---

## 🏗️ Архитектура



---

## ✨ Основные возможности

### Backend API

#### 1. 🗺️ Данные об отключениях
- Получение всех активных и исторических отключений
- Фильтрация по типу: электричество, холодная вода, горячая вода, отопление
- Информация о зданиях с геолокацией (широта/долгота)
- Связь с улицами, районами и микрорайонами

#### 2. 📊 Статистика и аналитика
- Количество отключений по типам
- Исторические данные за периоды
- Топ управляющих компаний по количеству аварий
- Географическое распределение по районам

#### 3. 🏥 Health & Monitoring
- Проверка состояния системы (`/health`)
- Мониторинг Redis подключения (`/health/redis`)
- Ручной прогрев кеша (`POST /health/cache/warmup`)
- Сброс и обновление кеша (`POST /health/cache/reset`)

#### 4. 🔥 Умный кеш
- Автоматический прогрев при старте приложения
- TTL-based кеширование часто используемых данных
- LRU политика вытеснения при переполнении
- Мониторинг здоровья кеша

#### 5. 📝 Swagger документация
- Полная OpenAPI спецификация
- Интерактивное тестирование API
- Описание всех моделей данных
- Примеры запросов и ответов

---

## 🛠️ Технологический стек

### Backend
- **Framework:** NestJS 11 (Node.js)
- **Language:** TypeScript 5.7
- **ORM:** TypeORM 0.3.27
- **Validation:** class-validator, class-transformer (NestJS Pipes)
- **HTTP Server:** Express
- **Documentation:** Swagger

### Базы данных
- **Primary DB:** PostgreSQL 16
- **Cache:** Redis 7 (Alpine)

### DevOps-backend
- **Containerization:** Docker, Docker Compose
- **Health Checks:** Built-in healthcheck system
- **Backups:** Automated PostgreSQL backups
- **Environment:** Multi-stage builds (dev/prod)

### Качество кода
- **Linter:** ESLint 9
- **Formatter:** Prettier
- **Type Safety:** TypeScript strict mode

---

## 🚀 Быстрый старт

### Предварительные требования

- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+ (для разработки без Docker)

### Установка и запуск

#### 1. Клонировать репозиторий

```bash
git clone <repository-url>
cd farpost_vlru
```

#### 2. Настроить переменные окружения

Используйте уже существующие: `.env.development` и `.env.production`, или создайте на их основе свои.


#### 3. Запустить все сервисы

**Development режим:**
```bash
docker compose up 
```

**Production режим:**
```bash
docker compose -f docker-compose.prod.yml up 
```

#### 4. Можно так проверить работоспособность

```bash
# Health check
curl http://localhost:3000/health

# API documentation
open http://localhost:3000/api

# Проверить Redis
curl http://localhost:3000/health/redis
```

### Доступные сервисы

| Сервис | URL | Описание |
|--------|-----|----------|
| Backend API | http://localhost:3000 | REST API сервер |
| Swagger UI | http://localhost:3000/api | Интерактивная документация |
| PostgreSQL | localhost:5432 | База данных |
| Redis | localhost:6379 | Кеш сервер |

---

## 💾 Система бэкапов

Это наша фичча

Одна из ключевых особенностей проекта - **полностью автоматизированная система резервного копирования**.

### Возможности

#### ✅ Автоматическое создание бэкапов
- **Development:** каждые 10 минут
- **Production:** каждые 12 часов
- Формат: PostgreSQL custom format (`pg_dump -Fc`)
- Ротация: автоматическое удаление старых бэкапов

#### ✅ Автоматическое восстановление
- При первом запуске контейнера
- При обнаружении бэкапов в папке `/backups`
- Восстанавливается последний доступный бэкап

#### ✅ Умная логика
1. Проверяет наличие существующей БД
2. Ищет последний бэкап в папке
3. Восстанавливает или инициализирует из дампа
4. Запускает автоматическое резервное копирование

### Структура бэкапов

```
backups/
├── Dockerfile                    # Docker образ с системой бэкапов
├── scripts/
│   ├── entrypoint.sh            # Точка входа контейнера
│   ├── init-db.sh               # Инициализация БД
│   ├── backup.sh                # Автоматический бэкап
│   └── restore.sh               # Восстановление из бэкапа
├── dev/                         # Бэкапы разработки
│   ├── backup-20251028_120000.sql
│   ├── backup-20251028_121000.sql
│   └── latest-backup.sql        # Симлинк на последний
└── prod/                        # Бэкапы продакшена
    ├── backup-20251028_000000.sql
    ├── backup-20251028_120000.sql
    └── latest-backup.sql
```

### Конфигурация

В `.env.development` или `.env.production`:

```env
# Интервал между бэкапами (секунды)
BACKUP_INTERVAL=600              # 10 минут для dev
# BACKUP_INTERVAL=43200          # 12 часов для prod

# Количество хранимых бэкапов
KEEP_BACKUPS=20                  # для dev
# KEEP_BACKUPS=30                # для prod (≈15 дней)
```


### Преимущества системы

- 🔄 **Полная автоматизация** - не требует ручного вмешательства
- 🛡️ **Защита от потери данных** - регулярные бэкапы
- ⚡ **Быстрое восстановление** - автоматически при старте
- 📦 **Компактность** - PostgreSQL custom format с сжатием
- 🔧 **Гибкость** - настраиваемые интервалы и ротация

Подробная документация: [`backups/README.md`](backups/README.md)

---

## 📚 API документация

### Swagger UI

Полная интерактивная документация доступна по адресу:
- **Development:** http://localhost:3000/api
- **Production:** http://localhost:3000/api (также, так как нет домена)

По этому пути также можно посмотреть все эндпоинты, модели данных, примеры запросов и ответов.



## 🏥 Мониторинг и здоровье системы

### Health Checks

Система включает встроенные health checks для мониторинга:


### Автоматический прогрев кеша

При запуске приложения автоматически прогреваются критичные данные в кеш Redis через вызов внутренних методов сервиса кеширования.

Это обеспечивает мгновенный отклик API с первого запроса.


---

## 📁 Структура проекта

```
farpost_vlru/
├── backend/                     # Backend приложение (NestJS)
│   ├── src/
│   │   ├── entities/           # TypeORM entities
│   │   │   ├── blackout.entity.ts
│   │   │   ├── building.entity.ts
│   │   │   ├── initiator.entity.ts
│   │   │   └── ...
│   │   ├── blackouts_map_info/ # Модуль карты отключений
│   │   ├── current_blackouts/  # Текущие отключения
│   │   ├── count_blackouts/    # Статистика
│   │   ├── management_companies/ # Управляющие компании
│   │   ├── common/             # Общие утилиты
│   │   ├── config/             # Конфигурация
│   │   └── migrations/         # Миграции БД
│   ├── dist/                   # Скомпилированный код
│   ├── test/                   # Тесты
│   ├── Dockerfile              # Multi-stage Docker build
│   ├── package.json
│   ├── tsconfig.json
│   └── BACKEND_DOCUMENTATION.md # Backend документация

│
├── backups/                    # Система бэкапов
│   ├── scripts/
│   │   ├── entrypoint.sh      # Точка входа
│   │   ├── backup.sh          # Автоматический бэкап
│   │   ├── restore.sh         # Восстановление
│   │   └── init-db.sh         # Инициализация
│   ├── dev/                   # Бэкапы разработки
│   ├── prod/                  # Бэкапы продакшена
│   ├── Dockerfile
│   ├── README.md              # Документация по бэкапам
│   └── dump-VL_OFF-*.sql      # Начальный дамп
│
│
├── .dockerignore               # Игнорируемые файлы для Docker
├── docker-compose.yml          # Development compose
├── docker-compose.prod.yml     # Production compose
├── .env.development           # Dev переменные окружения
├── .env.production            # Prod переменные окружения
├── .gitignore
└── README.md                  # Этот файл
```

---

## 🗄️ База данных

Используется указанная в Google Диске

### Миграции

Проект бекенда, также использует TypeORM migrations для управления схемой БД:

```bash
# Генерация миграции из изменений entities
npm run migration:generate -- src/migrations/MigrationName

# Применить миграции
npm run migration:run

# Откатить последнюю миграцию
npm run migration:revert

# Показать статус миграций
npm run migration:show
```



---

## ⚡ Производительность

### Кеширование

**Redis Cache Layer:**
- TTL: 5 минут для статистики
- TTL: 1 час для исторических данных
- LRU eviction policy
- Max memory: 256MB (dev) / 512MB (prod)


### Оптимизации

1. **Eager Loading** - подгрузка связанных данных одним запросом
2. **Query Pagination** - ограничение количества возвращаемых записей
3. **Database Indexes** - быстрый поиск по ключевым полям
4. **Response Compression** - сжатие HTTP ответов
5. **Connection Pooling** - переиспользование подключений к БД


## 🚢 Запуск

### Development

```bash
# Запуск всех сервисов
docker compose up -d

# Просмотр логов
docker compose logs -f backend

# Остановка
docker compose down
```

### Production

```bash
# Сборка и запуск
docker compose -f docker-compose.prod.yml up -d --build

# Проверка статуса
docker compose -f docker-compose.prod.yml ps

# Просмотр логов (ограничены 10MB × 3 файла)
docker compose -f docker-compose.prod.yml logs -f backend

# Graceful shutdown
docker compose -f docker-compose.prod.yml down
```

---



## 📄 Документация

Вся документация консолидирована для удобства:

| Документ | Описание | Ссылка |
|----------|----------|--------|
| **Backend Documentation** | API, база данных, миграции, кеширование, мониторинг | [BACKEND_DOCUMENTATION.md](backend/BACKEND_DOCUMENTATION.md) |
| **Backup System** | Автоматизированная система резервного копирования | [backups/README.md](backups/README.md) |
| **Environment Variables** | Конфигурация окружения (см. комментарии в файлах) | `.env.development`, `.env.production` |

### Что включено в Backend Documentation:

- 📚 **Архитектура и компоненты** - структура приложения, технологический стек
- 🔌 **API эндпоинты** - полное описание всех REST API
- 🗄️ **База данных и миграции** - схема БД, TypeORM миграции
- ⚡ **Кеширование** - Redis стратегия, cache warming
- 🏥 **Мониторинг** - Health checks, alerts, логирование
- ❌ **Обработка ошибок** - валидация, логирование, troubleshooting

---

## 🙏 Благодарности
- Спасибо за такую интересную и необычную тематику проекта.

