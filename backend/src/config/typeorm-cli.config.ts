import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

// Загружаем переменные окружения
config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('POSTGRES_HOST', 'localhost'),
  port: configService.get('POSTGRES_PORT', 5432),
  username: configService.get('POSTGRES_USER', 'user'),
  password: configService.get('POSTGRES_PASSWORD', 'user123456'),
  database: configService.get('POSTGRES_DB', 'user'),
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
