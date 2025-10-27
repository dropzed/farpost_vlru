# 📋 Управление переменными окружения

## 🎯 Простая структура - только 2 файла!

```
/
├── .env.development      # ✅ Для development (docker-compose.yml)
├── .env.production       # ✅ Для production (docker-compose.prod.yml)
└── .env.example          # 📄 Шаблон
```

**Оба файла в корне проекта и доступны для backend!**

---

## Автоматическое переключение

### Development режим
```bash
docker compose up -d
```
**Использует:** `.env.development`
- Все переменные автоматически загружаются через `env_file:`
- `NODE_ENV=development`
- Без предупреждений (WARN)

### Production режим
```bash
docker compose -f docker-compose.prod.yml up -d
```
**Использует:** `.env.production`
- Все переменные автоматически загружаются через `env_file:`
- `NODE_ENV=production`
- Без предупреждений (WARN)

---

## Как это работает

### Docker Compose
Директива `env_file:` загружает **все** переменные из файла в контейнер:

```yaml
services:
  backend:
    env_file:
      - .env.development  # Загружает ВСЕ переменные из файла
    # environment: НЕ НУЖНО - дублирование избыточно!
```

### NestJS Backend
ConfigModule читает файл по пути `../`:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'production' 
    ? '../.env.production'   // Путь из backend/ к корню
    : '../.env.development', // Путь из backend/ к корню
})
```

---

## Переменные в healthcheck и command

Используется **shell-синтаксис** `$$` для правильной интерполяции:

```yaml
# ✅ Правильно - двойной $$
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]

# ❌ Неправильно - одинарный $
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
```

---

## Создание .env файлов

### Первый запуск:
```bash
# 1. Скопировать шаблон для development
cp .env.example .env.development

# 2. Запустить
docker compose up -d
```

### Production:
```bash
# 1. Настроить .env.production (изменить пароли!)
nano .env.production

# 2. Запустить
docker compose -f docker-compose.prod.yml up -d
```

---

## Проверка

```bash
# Development
docker exec backend-nest printenv NODE_ENV
# Output: development

# Production
docker exec backend-nest-prod printenv NODE_ENV
# Output: production

# Health check
curl http://localhost:3000/health
```

---

## TypeORM конфигурация

### Development (`NODE_ENV=development`)
- ✅ `synchronize: true` - автосоздание таблиц
- ❌ `migrationsRun: false`
- ✅ `logging: ['error', 'warn', 'schema']`

### Production (`NODE_ENV=production`)
- ❌ `synchronize: false` - безопасный режим
- ✅ `migrationsRun: true` - автозапуск миграций
- ✅ `logging: ['error', 'warn', 'migration']`

---

## Основные переменные

| Переменная | Development | Production |
|------------|------------|------------|
| NODE_ENV | development | production |
| POSTGRES_USER | user | produser |
| POSTGRES_PASSWORD | user123456 | CHANGE_ME_STRONG_PASSWORD |
| POSTGRES_DB | user | blackouts |
| REDIS_PASSWORD | (пусто) | CHANGE_ME_REDIS_PASSWORD |
| BACKUP_INTERVAL | 600 (10 мин) | 43200 (12 часов) |
| REDIS_MAXMEMORY | 512mb | 2gb |

---

## Преимущества

✅ **Нет WARN** - переменные загружаются через `env_file:`
✅ **Нет дублирования** - `environment:` не нужен
✅ **Просто** - только 2 файла в корне
✅ **Безопасно** - protected by .gitignore
✅ **Прозрачно** - видно все переменные сразу

---

## Troubleshooting

### Проблема: WARN переменные не установлены

**Причина:** Docker Compose не может интерполировать `${VAR}` из `env_file`

**Решение:** Убрали `environment:` блоки, используем только `env_file:`

### Проблема: Переменные не доступны в command/healthcheck

**Решение:** Используем `$$` вместо `$`:
```yaml
command: sh -c "redis-server --maxmemory $${REDIS_MAXMEMORY}"
```

---

## .gitignore

```gitignore
# Environment files - ⚠️ ONLY 2 FILES IN ROOT
.env.development
.env.production
!.env.example
```

---

## ⚠️ Важно для Production

Перед деплоем:

1. ✅ Смените `POSTGRES_PASSWORD` на сильный
2. ✅ Смените `REDIS_PASSWORD` на сильный
3. ✅ Проверьте `NODE_ENV=production`
4. ✅ Установите `DEBUG=false`
5. ✅ Проверьте все URL и порты

---

## Быстрые команды

```bash
# Development
docker compose up -d                          # Запустить
docker compose logs -f backend                # Логи backend
docker compose down                           # Остановить

# Production
docker compose -f docker-compose.prod.yml up -d       # Запустить
docker compose -f docker-compose.prod.yml logs -f     # Логи
docker compose -f docker-compose.prod.yml down        # Остановить

# Проверка
curl http://localhost:3000/health             # Health check
docker exec backend-nest printenv NODE_ENV    # NODE_ENV
```

---

✅ **Всё работает без предупреждений! Только 2 .env файла в корне!**

---

## Автоматическое переключение

### Development режим
```bash
docker compose up -d
```
**Использует:** `.env.development` (корень проекта)
- `NODE_ENV=development`
- Synchronize: true
- Полное SQL логирование
- Redis без пароля
- Backup каждые 10 минут

### Production режим
```bash
docker compose -f docker-compose.prod.yml up -d
```
**Использует:** `.env.production` (корень проекта)
- `NODE_ENV=production`
- Migrations: true
- Минимальное логирование
- Redis с паролем
- Backup каждые 12 часов

---

## ConfigModule в NestJS

В `backend/src/app.module.ts`:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'production' 
    ? '../.env.production'   // Путь относительно backend/
    : '../.env.development', // Путь относительно backend/
})
```

---

## Docker Compose конфигурация

### Development (docker-compose.yml)
```yaml
services:
  backend:
    env_file:
      - .env.development  # ✅ Из корня проекта
```

### Production (docker-compose.prod.yml)
```yaml
services:
  backend:
    env_file:
      - .env.production   # ✅ Из корня проекта
```

---

## .gitignore

```gitignore
# Environment files - ⚠️ ONLY 2 FILES IN ROOT
.env.development
.env.production
!.env.example
```

---

## Создание .env файлов

### Первый запуск:
```bash
# 1. Скопировать шаблон для development
cp .env.example .env.development

# 2. Скопировать для production (и изменить пароли!)
cp .env.production .env.production  # Уже существует
nano .env.production  # ⚠️ ИЗМЕНИТЕ ВСЕ ПАРОЛИ!
```

---

## Проверка окружения

```bash
# Development
docker exec backend-nest printenv | grep NODE_ENV
# Output: NODE_ENV=development

# Production
docker exec backend-nest-prod printenv | grep NODE_ENV
# Output: NODE_ENV=production
```

---

## TypeORM конфигурация (автоматически по NODE_ENV)

### Development
- ✅ `synchronize: true` - автосоздание таблиц
- ❌ `migrationsRun: false`
- ✅ `logging: ['error', 'warn', 'schema']`

### Production
- ❌ `synchronize: false` - безопасный режим
- ✅ `migrationsRun: true` - автозапуск миграций
- ✅ `logging: ['error', 'warn', 'migration']`

---

## Основные различия

| Параметр | Development | Production |
|----------|------------|------------|
| NODE_ENV | development | production |
| POSTGRES_USER | user | produser |
| POSTGRES_PASSWORD | user123456 | CHANGE_ME_STRONG_PASSWORD_123 |
| POSTGRES_DB | user | blackouts |
| REDIS_PASSWORD | (пусто) | CHANGE_ME_REDIS_PASSWORD_456 |
| DEBUG | true | false |
| LOG_LEVEL | debug | warn |

---

## Использование в коде

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

// Все переменные доступны
const dbHost = this.configService.get('POSTGRES_HOST');
const isProduction = this.configService.get('NODE_ENV') === 'production';
const redisPassword = this.configService.get('REDIS_PASSWORD');
```

---

## Быстрый старт

### Development
```bash
# 1. Создать .env.development (если нет)
cp .env.example .env.development

# 2. Запустить
docker compose up -d

# 3. Проверить
curl http://localhost:3000/health
```

### Production
```bash
# 1. Настроить .env.production
nano .env.production  # Измените пароли!

# 2. Запустить
docker compose -f docker-compose.prod.yml up -d

# 3. Проверить
curl http://localhost:3000/health
```

---

## Преимущества простой структуры

✅ **Только 2 файла** - легко управлять
✅ **В корне проекта** - видны сразу
✅ **Доступны backend** - путь `../`
✅ **Доступны docker** - путь `./`
✅ **Нет дублирования** - один источник правды
✅ **Просто понять** - очевидная структура

---

## ⚠️ Важно для Production

Перед деплоем в `.env.production`:

1. ✅ Смените `POSTGRES_PASSWORD`
2. ✅ Смените `REDIS_PASSWORD`  
3. ✅ Установите `NODE_ENV=production`
4. ✅ Установите `DEBUG=false`
5. ✅ Установите `LOG_LEVEL=warn`

---

## Troubleshooting

### Проблема: Переменные не загружаются

**Решение:**
```bash
# 1. Проверьте наличие файлов
ls -la .env.*

# 2. Пересоберите контейнеры
docker compose down
docker compose up -d --build
```

### Проблема: NODE_ENV не меняется

**Решение:**
- Убедитесь, что используете правильный docker-compose файл
- `docker-compose.yml` = development
- `docker-compose.prod.yml` = production

---

✅ **Теперь всё просто - только 2 файла в корне проекта!**

## Автоматическое переключение

### Development режим
```bash
docker compose up -d
```
**Использует:** `.env.development`
- `NODE_ENV=development`
- Synchronize: true (автосинхронизация БД)
- Полное SQL логирование
- Redis без пароля
- Backup каждые 10 минут

### Production режим
```bash
docker compose -f docker-compose.prod.yml up -d
```
**Использует:** `.env.production`
- `NODE_ENV=production`
- Synchronize: false (безопасный режим)
- Migrations: true (автозапуск миграций)
- Минимальное логирование
- Redis с паролем
- Backup каждые 12 часов

## ConfigModule в NestJS

В `backend/src/app.module.ts`:

```typescript
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: process.env.NODE_ENV === 'production' 
    ? '.env.production' 
    : '.env.development',
})
```

## Docker Compose конфигурация

### Development (docker-compose.yml)
```yaml
services:
  backend:
    env_file:
      - .env.development  # Автоматически загружает все переменные
```

### Production (docker-compose.prod.yml)
```yaml
services:
  backend:
    env_file:
      - .env.production   # Автоматически загружает все переменные
```

## Основные различия

| Параметр | Development | Production |
|----------|------------|------------|
| NODE_ENV | development | production |
| POSTGRES_USER | user | produser |
| POSTGRES_PASSWORD | user123456 | CHANGE_ME_STRONG_PASSWORD_123 |
| POSTGRES_DB | user | blackouts |
| REDIS_PASSWORD | (пусто) | CHANGE_ME_REDIS_PASSWORD_456 |
| BACKUP_INTERVAL | 600 (10 мин) | 43200 (12 часов) |
| KEEP_BACKUPS | 20 | 30 |
| DEBUG | true | false |
| LOG_LEVEL | debug | warn |

## Важные замечания

### 🔒 Безопасность

1. **Никогда не коммитьте** `.env.development` и `.env.production` в git
2. **Измените пароли** в `.env.production` перед деплоем
3. Используйте **сильные пароли** (минимум 16 символов)
4. Храните production credentials в безопасном месте

### 📁 .gitignore

```gitignore
# Environment files - ⚠️ KEEP ONLY TEMPLATES IN GIT
.env
backend/.env
backend/.env.development
backend/.env.production
!.env.example
!.env.production  # Template for production
*.env.local
```

## Создание новых .env файлов

### Для development:
```bash
cp .env.example .env.development
cp .env.example backend/.env.development
```

### Для production:
```bash
cp .env.production .env.production  # Уже существует
cp .env.production backend/.env.production
# ⚠️ ИЗМЕНИТЕ ВСЕ ПАРОЛИ!
```

## Проверка текущего окружения

### Внутри контейнера:
```bash
# Development
docker exec backend-nest printenv | grep NODE_ENV
# Output: NODE_ENV=development

# Production
docker exec backend-nest-prod printenv | grep NODE_ENV
# Output: NODE_ENV=production
```

### В логах приложения:
```bash
# Development
docker logs backend-nest | grep "Starting Nest"

# Production
docker logs backend-nest-prod | grep "Starting Nest"
```

## TypeORM конфигурация

В зависимости от NODE_ENV автоматически:

### Development (`NODE_ENV=development`)
- ✅ `synchronize: true` - автосоздание/обновление таблиц
- ❌ `migrationsRun: false` - миграции не запускаются
- ✅ `logging: ['error', 'warn', 'schema']` - полное логирование схемы

### Production (`NODE_ENV=production`)
- ❌ `synchronize: false` - безопасный режим, ручное управление
- ✅ `migrationsRun: true` - автозапуск миграций при старте
- ✅ `logging: ['error', 'warn', 'migration']` - только ошибки и миграции

## Переменные для backend

Все переменные автоматически доступны через `ConfigService`:

```typescript
import { ConfigService } from '@nestjs/config';

constructor(private configService: ConfigService) {}

// Использование
const dbHost = this.configService.get('POSTGRES_HOST');
const isProduction = this.configService.get('NODE_ENV') === 'production';
```

## Troubleshooting

### Проблема: Используется неправильный .env файл

**Решение:**
1. Проверьте, что файлы `.env.development` и `.env.production` существуют
2. Пересоберите контейнеры:
```bash
docker compose down
docker compose up -d --build
```

### Проблема: Переменные не загружаются

**Решение:**
1. Убедитесь, что в docker-compose есть `env_file:`
2. Проверьте путь к файлу относительно docker-compose.yml
3. Перезапустите контейнеры

### Проблема: NODE_ENV всегда production

**Решение:**
- В NestJS используйте `process.env.NODE_ENV` из контейнера
- ConfigModule должен правильно загружать нужный файл

## Лучшие практики

1. ✅ Используйте отдельные файлы для dev и prod
2. ✅ Храните шаблоны в git (`.env.example`)
3. ✅ Не коммитьте настоящие credentials
4. ✅ Используйте сильные пароли в production
5. ✅ Регулярно обновляйте пароли
6. ✅ Документируйте все переменные
7. ✅ Используйте секретные хранилища для prod credentials

## Рекомендации для production

### Перед деплоем:

1. **Смените все пароли** в `.env.production`:
   - `POSTGRES_PASSWORD`
   - `REDIS_PASSWORD`
   
2. **Проверьте настройки**:
   - `NODE_ENV=production`
   - `DEBUG=false`
   - `LOG_LEVEL=warn`

3. **Настройте backup**:
   - `BACKUP_INTERVAL=43200` (12 часов)
   - `KEEP_BACKUPS=30` (30 последних бэкапов)

4. **Проверьте безопасность**:
   - Redis с паролем
   - PostgreSQL с сильным паролем
   - Файрволл настроен
   - SSL/TLS включен (если нужно)

## Примеры использования

### Быстрый старт Development
```bash
# 1. Создать .env файлы
cp .env.example .env.development

# 2. Запустить
docker compose up -d

# 3. Проверить
curl http://localhost:3000/health
```

### Быстрый старт Production
```bash
# 1. Создать и настроить .env
cp .env.production .env.production
nano .env.production  # Измените пароли!

# 2. Запустить
docker compose -f docker-compose.prod.yml up -d

# 3. Проверить
curl http://localhost:3000/health
```

---

✅ Теперь проект автоматически использует правильные .env файлы в зависимости от режима запуска!
