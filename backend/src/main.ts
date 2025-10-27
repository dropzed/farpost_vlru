import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);
  const swaggerPath = configService.get('SWAGGER_PATH', 'api');

  const config = new DocumentBuilder()
    .setTitle('Blackouts API')
    .setDescription('API для управления данными об авариях электро-, водо- и теплоснабжения. Предоставляет информацию о текущих и прошлых авариях, статистику по типам аварий, а также данные о городах, зданиях и инфраструктуре.')
    .setVersion('1.0')
    .addTag('app', 'Общие эндпоинты приложения')
    .addTag('blackouts', 'Операции с авариями - получение информации об авариях, городах и зданиях')
    .addTag('count-blackouts', 'Статистика и аналитика по авариям')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(swaggerPath, app, document);

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);
}
bootstrap();
