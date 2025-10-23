#!/bin/bash
set -e

echo "Инициализация базы данных из начального дампа..."

DUMP_FILE="/docker-entrypoint-initdb.d/01-init.dump"

if [ -f "$DUMP_FILE" ]; then
    echo "Найден начальный дамп: $DUMP_FILE"
    
    export PGPASSWORD="$POSTGRES_PASSWORD"
    
    # восстановление из custom формата
    pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --no-owner --no-acl -v "$DUMP_FILE" 2>&1 || {
        echo "Предупреждение: некоторые объекты не удалось восстановить из начального дампа"
    }
    
    echo "Начальный дамп успешно восстановлен"
else
    echo "Начальный дамп не найден, пропускаем..."
fi
