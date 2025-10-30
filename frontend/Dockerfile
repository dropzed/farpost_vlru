FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm run build:client && pnpm run build:server

FROM node:20-alpine AS production

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod=false

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server/node-build.mjs"]