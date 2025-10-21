# Environment Setup Guide

### 1. Файлы окружений

**Backend:**

- `.env.development` - Настройки для разработки
- `.env.production` - Настройки для продакшена

**Root:**

- `.env` - Переменные для Docker Compose

### 2. Multi-stage Dockerfile

Dockerfile in backend dir поддерживает 3 стадии:

- **builder** - Сборка приложения
- **production** - Оптимизированный образ для продакшена (slim, без dev-зависимостей)
- **development** - Образ для разработки с hot-reload

### 3. Docker Compose конфигурации

- `docker-compose.yml` - Основной файл, поддерживает development через переменные, при желании, можно его превратить в
  production
- `docker-compose.prod.yml` - Отдельный файл для продакшена

## Как использовать

### Development (разработка)

```bash

# Запуск в режиме разработки (по умолчанию)
docker compose up --build

# Остановка
docker compose down

# Просмотр логов
docker compose logs -f backend

# Пересобрать без кэша
docker compose build --no-cache backend
```

В режиме разработки:

- ✅ Hot-reload включен (изменения в `src/` применяются автоматически)
- ✅ Debug логи
- ✅ synchronize: true в TypeORM
- ✅ Node modules в volume для быстрой пересборки

### Production (продакшен)

**Вариант 1: Отдельный compose файл**

```bash

docker compose -f docker-compose.prod.yml up --build -d
docker compose -f docker-compose.prod.yml down
```

**Вариант 2: Основной файл с переменными**

```bash

ENV=production BUILD_TARGET=production docker compose up --build -d
```

В режиме продакшена:

- ✅ Оптимизированный образ (node:bullseye-slim)
- ✅ Только production зависимости
- ✅ Минимальные логи
- ✅ Compiled JavaScript (не TypeScript)
- ✅ Автоматический рестарт

### Переключение окружений

Отредактируйте `.env` в корне проекта:

Пример: 

```bash
# Для development
ENV=development
BUILD_TARGET=development

# Для production
ENV=production
BUILD_TARGET=production
```

Затем:

```bash
docker compose up --build
```

## Структура переменных окружения

### Backend (.env.development / .env.production)

```env
NODE_ENV=development|production  # Режим работы Node.js
PORT=3000                        # Порт приложения
POSTGRES_HOST=db-postgres        # Хост БД
POSTGRES_PORT=5432               # Порт БД
POSTGRES_USER=user               # Пользователь БД
POSTGRES_PASSWORD=secret         # Пароль БД
POSTGRES_DB=dbname               # Имя БД
DEBUG=true|false                 # Режим отладки
LOG_LEVEL=debug|info|error       # Уровень логирования на будущее
```

### Root (.env)

```env
ENV=development                  # Какой .env.* файл использовать
BUILD_TARGET=development         # Какую стадию Dockerfile использовать
NODE_ENV=development             # Override для Node.js
PORT=3000                        # Внешний порт
```

## Проверка конфигурации

```bash
# Посмотреть финальную конфигурацию
docker compose config

# Проверить какие переменные используются
docker compose config | grep -A 5 "environment:"

# Посмотреть какие файлы загружаются
docker compose config | grep -A 2 "env_file:"
```

## Важные моменты

### ⚠️ Безопасность

1. Файлы `.env.development` и `.env.production` в `.gitignore`
2. Перед деплоем изменить пароли в `.env.production`

### 🔥 Hot-Reload в Development

В `docker-compose.yml` примонтирован `src/` как read-only volume:

```yaml
volumes:
  - ./backend/src:/app/src:ro
```

Изменения в коде применяются автоматически благодаря `npm run start:dev`.

### 📦 Node Modules

В development node_modules в отдельном volume - это ускоряет пересборку и избегает конфликтов с хостовой системой.

## Troubleshooting

### Проблема: Backend не подключается к БД

**Решение:** Проверьте что `POSTGRES_HOST=db-postgres`, будет указан хост (имя контейнера, localhost, или нужного хоста)

### Проблема: Hot-reload не работает

**Решение:**

1. Проверьте что volume примонтирован: `docker compose config | grep volumes`
2. Убедитесь что используется development target

### Проблема: Порт 5432 занят

**Решение:** Измените порт в `docker-compose.yml`:

```yaml
ports:
  - "5433:5432"  # Внешний порт 5433, внутри контейнера 5432
```

## В будущем

1. Добавить migrations вместо `synchronize: true`
2. Настроить health checks для backend
3. Добавить Redis для кеширования
4. Настроить nginx для reverse proxy
