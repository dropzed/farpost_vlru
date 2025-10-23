# Папка бэкапов для разработки

Эта папка содержит автоматические бэкапы базы данных для окружения разработки.

## Параметры, указаны для примера тут

- **Интервал создания:** каждые 10 минут
- **Количество хранимых бэкапов:** 20 штук
- **Формат:** PostgreSQL custom format (сжатый)
- **Автоочистка:** да (удаляются самые старые)

## Файлы

- `backup-YYYYMMDD_HHMMSS.sql` - автоматические бэкапы
- `latest-backup.sql` - симлинк на последний бэкап, делается при остановке контейнера (если он остановлен корректно)

## Использование

### Восстановление из последнего бэкапа:
```bash
docker exec -i db-postgres pg_restore -U postgres -d VL_OFF --clean --if-exists /host-backup/latest-backup.sql
```

### Восстановление из конкретного бэкапа:
```bash
docker exec -i db-postgres pg_restore -U postgres -d VL_OFF --clean --if-exists /host-backup/backup-20241024_123000.sql
```

### Просмотр содержимого бэкапа:
```bash
docker exec db-postgres pg_restore -l /host-backup/latest-backup.sql
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
