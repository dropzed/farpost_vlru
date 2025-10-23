#!/bin/bash
set -e

# запуск PostgreSQL в фоне
/usr/local/bin/docker-entrypoint.sh postgres &
POSTGRES_PID=$!

# ожидание готовности базы данных
echo "Ожидание готовности базы данных..."
until pg_isready -U "${POSTGRES_USER:-postgres}" -d "${POSTGRES_DB:-postgres}" -h 127.0.0.1; do
  sleep 2
done

echo "База данных готова к работе"

# запуск скрипта автоматического создания бэкапа в фоне (пока запущен проект)
/usr/local/bin/backup.sh &

# ожидание завершения процесса PostgreSQL
wait $POSTGRES_PID
