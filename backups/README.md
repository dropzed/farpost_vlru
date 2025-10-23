# Система автоматических бэкапов PostgreSQL

## Описание

Автоматическая система бэкапов интегрирована в Docker Compose для разработки и продакшена.

## Функционал

### При запуске контейнера:
1. Проверяется наличие существующих бэкапов в папке `backups/`
2. Если найден бэкап - восстанавливается последний
3. Если бэкапов нет - инициализируется из файла `dump-VL_OFF-202510222210.sql`

### Автоматическое создание бэкапов:

**Разработка (docker-compose.yml):**
- Интервал: каждые 10 минут (600 секунд)
- Хранится: 20 последних бэкапов
- Формат файла: `backup-YYYYMMDD_HHMMSS.sql`

**Продакшен (docker-compose.prod.yml):**
- Интервал: каждые 12 часов (43200 секунд)
- Хранится: 30 последних бэкапов (≈15 дней истории)
- Формат файла: `backup-YYYYMMDD_HHMMSS.sql`
- Логирование ограничено (max 10MB × 3 файла)

## Структура файлов

```
backups/
├── Dockerfile              # Образ PostgreSQL с бэкапами
├── dump-VL_OFF-*.sql      # Начальный SQL дамп (custom формат)
├── scripts/                # Скрипты бэкапа
│   ├── init-db.sh         # Скрипт инициализации из дампа
│   ├── backup.sh          # Скрипт автоматического бэкапа
│   ├── restore.sh         # Скрипт восстановления из бэкапа
│   └── entrypoint.sh      # Точка входа контейнера
├── dev/                    # Бэкапы для разработки
│   ├── backup-*.sql       # Автоматические бэкапы (каждые 10 минут)
│   └── latest-backup.sql  # Симлинк на последний бэкап
└── prod/                   # Бэкапы для продакшена
    ├── backup-*.sql       # Автоматические бэкапы (каждые 12 часов)
    └── latest-backup.sql  # Симлинк на последний бэкап
```

## Формат бэкапов

Система использует **PostgreSQL custom format** (`pg_dump -Fc`) для всех бэкапов:


### Ручное создание бэкапа:
```bash
# Для разработки
docker exec db-postgres pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -Fc > backups/dev/manual-backup-$(date +%Y%m%d_%H%M%S).sql

# Для продакшена
docker exec db-postgres-prod pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -Fc > backups/prod/manual-backup-$(date +%Y%m%d_%H%M%S).sql
```

### Восстановление из конкретного бэкапа:
```bash
# Для разработки
docker exec -i db-postgres pg_restore -U $POSTGRES_USER -d $POSTGRES_DB --clean --if-exists /host-backup/backup-YYYYMMDD_HHMMSS.sql

# Для продакшена
docker exec -i db-postgres-prod pg_restore -U $POSTGRES_USER -d $POSTGRES_DB --clean --if-exists /host-backup/backup-YYYYMMDD_HHMMSS.sql
```

## Переменные окружения

- `BACKUP_INTERVAL` - интервал между бэкапами в секундах
- `KEEP_BACKUPS` - количество хранимых бэкапов

## Отличия продакшена от разработки

1. **Интервал бэкапов:** 12 часов вместо 10 минут
2. **Количество бэкапов:** 30 вместо 20
3. **Healthcheck:** более длительные интервалы и таймауты
4. **Restart policy:** always (всегда перезапускается)
