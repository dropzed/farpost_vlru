# Папка бэкапов для продакшена

Эта папка содержит автоматические бэкапы базы данных для production окружения.

## Параметры, указаны для примера тут

- **Интервал создания:** каждые 12 часов (2 раза в день)
- **Количество хранимых бэкапов:** 30 штук (~15 дней истории)
- **Формат:** PostgreSQL custom format (сжатый)
- **Автоочистка:** да (удаляются самые старые)

## Файлы

- `backup-YYYYMMDD_HHMMSS.sql` - автоматические бэкапы
- `latest-backup.sql` - симлинк на последний бэкап

## Использование

### Восстановление из последнего бэкапа:
```bash
docker exec -i db-postgres-prod pg_restore -U postgres -d VL_OFF --clean --if-exists /host-backup/latest-backup.sql
```

### Восстановление из конкретного бэкапа:
```bash
docker exec -i db-postgres-prod pg_restore -U postgres -d VL_OFF --clean --if-exists /host-backup/backup-20241024_120000.sql
```

### Просмотр содержимого бэкапа:
```bash
docker exec db-postgres-prod pg_restore -l /host-backup/latest-backup.sql
```

## Мониторинг

### Проверить сколько бэкапов:
```bash
ls -1 backup-*.sql | wc -l
```

### Найти самый новый:
```bash
ls -t backup-*.sql | head -1
```

### Общий размер:
```bash
du -sh .
```

### История бэкапов (последние 10):
```bash
ls -lt backup-*.sql | head -10
```
