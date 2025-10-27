FROM postgres:17

# установка зависимости file для определения типа файлов
RUN apt-get update && apt-get install -y file && rm -rf /var/lib/apt/lists/*

# копирование SQL дампа для начальной инициализации (custom формат)
COPY dump-VL_OFF-202510280004.sql /docker-entrypoint-initdb.d/01-init.dump

# копирование скрипта бэкапа и восстановления
COPY scripts/restore.sh /docker-entrypoint-initdb.d/02-restore.sh
COPY scripts/backup.sh /usr/local/bin/backup.sh
COPY scripts/entrypoint.sh /usr/local/bin/entrypoint.sh
COPY scripts/init-db.sh /docker-entrypoint-initdb.d/00-init-db.sh

# установка права на выполнение в контейнере
RUN chmod +x /usr/local/bin/backup.sh && \
    chmod +x /usr/local/bin/entrypoint.sh && \
    chmod +x /docker-entrypoint-initdb.d/00-init-db.sh && \
    chmod +x /docker-entrypoint-initdb.d/02-restore.sh

CMD ["/usr/local/bin/entrypoint.sh"]