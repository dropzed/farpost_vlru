#!/bin/bash
set -e

BACKUP_DIR="/host-backup"

echo "Проверка наличия существующего бэкапа для восстановления..."

if [ -d "$BACKUP_DIR" ]; then
    # поиск последнего бэкапа (поддержка 2х форматов - custom и текстовый SQL)
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/backup-*.sql 2>/dev/null | head -1)
    
    if [ -n "$LATEST_BACKUP" ]; then
        echo "Найден существующий бэкап: $LATEST_BACKUP"
        echo "Восстанавливаем базу данных из бэкапа..."
        
        export PGPASSWORD="$POSTGRES_PASSWORD"
        
        # определение типа файла и восстанавливаем соответствующим образом
        if file "$LATEST_BACKUP" | grep -q "PostgreSQL custom database dump"; then
            echo "Обнаружен custom формат PostgreSQL, используем pg_restore..."
            pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-acl -v "$LATEST_BACKUP" 2>&1 || echo "Предупреждение: некоторые объекты не удалось восстановить"
        else
            echo "Обнаружен текстовый SQL формат, используем psql..."
            psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -v ON_ERROR_STOP=0 -f "$LATEST_BACKUP" 2>&1 || echo "Предупреждение: некоторые объекты не удалось восстановить"
        fi
        
        echo "Восстановление из бэкапа завершено"
    else
        echo "Существующий бэкап не найден. База будет инициализирована из SQL дампа"
    fi
else
    echo "Директория $BACKUP_DIR не найдена. База будет инициализирована из SQL дампа"
fi

echo "Инициализация завершена"
