# Документация по обработке ошибок и валидации данных

## Обзор

В бэкенд проекта добавлена комплексная система обработки ошибок и валидации данных с использованием лучших практик NestJS.

## Установленные пакеты

```bash
npm install class-validator class-transformer
```

## Компоненты

### 1. Глобальный фильтр исключений

**Файл:** `src/common/filters/http-exception.filter.ts`

Централизованная обработка всех исключений:
- Перехватывает все ошибки (HttpException и неожиданные ошибки)
- Логирует подробную информацию об ошибках
- Возвращает структурированные ответы об ошибках

**Формат ответа:**
```json
{
  "statusCode": 500,
  "timestamp": "2025-10-26T11:20:00.000Z",
  "path": "/api/blackouts/cities/invalid-id",
  "method": "GET",
  "error": "Not Found",
  "message": "Город с ID \"invalid-id\" не найден"
}
```

### 2. Interceptor для логирования

**Файл:** `src/common/interceptors/logging.interceptor.ts`

Автоматическое логирование всех запросов и ответов:
- Входящие запросы с параметрами
- Время выполнения запроса
- Ошибки выполнения

### 3. Глобальный ValidationPipe

Настроен в `src/main.ts` с опциями:
- `whitelist: true` - удаляет свойства, не указанные в DTO
- `forbidNonWhitelisted: true` - возвращает ошибку при дополнительных свойствах
- `transform: true` - автоматическое преобразование типов
- `enableImplicitConversion: true` - неявное преобразование примитивных типов

## Обновленные контроллеры

### BlackoutsController

**Новые возможности:**
- Обработка ошибок для всех эндпоинтов
- Валидация ID города
- Правильные HTTP статусы (404 для не найденных ресурсов)

**Эндпоинты:**
- `GET /blackouts/getAll` - получить все аварии
- `GET /blackouts/cities` - получить все города
- `GET /blackouts/cities/:id` - получить город по ID (с валидацией)
- `GET /blackouts/buildings` - получить все здания

### BlackoutsMapInfoController

**Эндпоинты:**
- `GET /blackouts-map-info/december-2019` - получить поломки за декабрь 2019

### CountBlackoutsController

**Эндпоинты:**
- `GET /count-blackouts/types` - получить статистику по типам аварий

## DTOs с валидацией

### GetCityByIdDto
```typescript
{
  id: string; // Обязательно, только буквы, цифры, дефисы и подчеркивания
}
```

### December2019BlackoutDto
```typescript
{
  latitude: number;        // Обязательно
  longitude: number;       // Обязательно
  fullAddress: string;     // Обязательно
  type?: string;          // Опционально, enum: electricity/cold_water/hot_water/heat
  description?: string;    // Опционально
}
```

### BlackoutTypesCountDto
```typescript
{
  electricity: number;  // >= 0
  cold_water: number;   // >= 0
  hot_water: number;    // >= 0
  heat: number;         // >= 0
}
```

## Обновленные сервисы

Все сервисы теперь имеют:
- Логирование операций
- Обработку ошибок
- Типизированные возвращаемые значения
- Информативные сообщения в логах

### BlackoutsService
- `findAll()` - все аварии
- `findAllCities()` - все города
- `findCityById(id)` - город по ID (возвращает null если не найден)
- `findAllBuildings()` - все здания с отношениями

### BlackoutsMapInfoService
- `getDecember2019Blackouts()` - поломки за декабрь 2019

### CountBlackoutsService
- `getBlackoutTypesCounts()` - статистика по типам

## Примеры обработки ошибок

### 1. Не найденный ресурс (404)
```typescript
async getCityById(@Param('id') id: string): Promise<City> {
  const city = await this.blackoutsService.findCityById(id);
  
  if (!city) {
    throw new NotFoundException(`Город с ID "${id}" не найден`);
  }
  
  return city;
}
```

### 2. Внутренняя ошибка сервера (500)
```typescript
async getAllBlackouts(): Promise<Blackout[]> {
  try {
    return await this.blackoutsService.findAll();
  } catch (error) {
    throw new InternalServerErrorException('Ошибка при получении списка аварий');
  }
}
```

### 3. Ошибка валидации (400)
Автоматически обрабатывается ValidationPipe при некорректных данных.

## API документация (Swagger)

Все эндпоинты документированы с:
- Описанием операции
- Параметрами запроса
- Возможными кодами ответов (200, 400, 404, 500)
- Примерами запросов/ответов

Доступ к документации: `http://localhost:3000/api`

## Тестирование

### Успешный запрос
```bash
curl http://localhost:3000/blackouts/cities/city-vlru
```

### Ресурс не найден
```bash
curl http://localhost:3000/blackouts/cities/non-existent-id
# Ответ: 404 с сообщением "Город с ID "non-existent-id" не найден"
```

### Невалидные данные
```bash
curl http://localhost:3000/blackouts/cities/
# Ответ: 404 или 400 в зависимости от маршрута
```

## Логирование

Все логи содержат:
- Метод HTTP и URL
- Параметры запроса (body, query, params)
- Время выполнения
- Статус ответа
- Детали ошибок (с stack trace)

Пример лога:
```
[LoggingInterceptor] Incoming request: GET /blackouts/cities/city-vlru
[BlackoutsService] Fetching city with ID: city-vlru
[LoggingInterceptor] Response: GET /blackouts/cities/city-vlru - 45ms
```
