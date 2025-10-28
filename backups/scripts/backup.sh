#!/bin/bash
set -e

BACKUP_DIR="/host-backup"
BACKUP_INTERVAL="${BACKUP_INTERVAL:-600}"  # По умолчанию 10 минут
KEEP_BACKUPS="${KEEP_BACKUPS:-10}"  # Сколько бекапов хранить

echo "Старт службы автоматического бэкапа..."
echo "Интервал бэкапа: $BACKUP_INTERVAL секунд"
echo "Количество хранимых бекапов: $KEEP_BACKUPS"

# ожидание готовности базы данных, чтобы избежать ошибок при первом бэкапе
echo "Ожидание готовности базы данных перед первым бэкапом..."
sleep 30

while true; do
  TIMESTAMP=$(date +%Y%m%d_%H%M%S)
  BACKUP_FILE="$BACKUP_DIR/backup-$TIMESTAMP.sql"
  TEMP_FILE="$BACKUP_FILE.tmp"
  
  echo "[$(date)] Создание бэкапа базы данных..."
  
  export PGPASSWORD="$POSTGRES_PASSWORD"
  
  # custom формат (-Fc) для совместимости с начальным дампом
  if pg_dump -h "${DB_HOST:-localhost}" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc > "$TEMP_FILE"; then
    mv "$TEMP_FILE" "$BACKUP_FILE"
    echo "[$(date)] Бэкап успешно создан: $BACKUP_FILE"
    
    # удаление старых бекапы, только последние N остаются
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/backup-*.sql 2>/dev/null | wc -l)
    if [ "$BACKUP_COUNT" -gt "$KEEP_BACKUPS" ]; then
      echo "Удаление старых бекапов (оставляем $KEEP_BACKUPS последних)..."
      ls -1t "$BACKUP_DIR"/backup-*.sql | tail -n +$((KEEP_BACKUPS + 1)) | xargs rm -f
    fi
    
    # создание симлинка на последний бекап
    ln -sf "$(basename "$BACKUP_FILE")" "$BACKUP_DIR/latest-backup.sql"
  else
    echo "[$(date)] Ошибка при создании бэкапа"
    rm -f "$TEMP_FILE"
  fi
  
  echo "Ожидание $BACKUP_INTERVAL секунд до следующего бэкапа..."
  sleep "$BACKUP_INTERVAL"
done
