import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Blackouts API')
    .setDescription('API для управления данными об авариях электро-, водо- и теплоснабжения. Предоставляет информацию о текущих и прошлых авариях, статистику по типам аварий, а также данные о городах, зданиях и инфраструктуре.')
    .setVersion('1.0')
    .addTag('app', 'Общие эндпоинты приложения')
    .addTag('blackouts', 'Операции с авариями - получение информации об авариях, городах и зданиях')
    .addTag('count-blackouts', 'Статистика и аналитика по авариям')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
