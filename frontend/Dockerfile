# Этап сборки
FROM node:20-alpine AS builder

# Устанавливаем pnpm глобально
RUN npm install -g pnpm

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json pnpm-lock.yaml* ./

# Устанавливаем зависимости
RUN pnpm install

# Копируем исходный код
COPY . .

# Собираем приложение
RUN pnpm run build

# Этап продакшн
FROM node:20-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

# Копируем только необходимые файлы
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --production

# Копируем собранное приложение из этапа сборки
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Устанавливаем порт (Vite по умолчанию использует 5173, но вы можете изменить)
EXPOSE 8081

# Запускаем приложение
CMD ["pnpm", "run", "dev"]