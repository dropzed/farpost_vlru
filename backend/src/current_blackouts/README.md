# Current Blackouts Module

Модуль для получения информации о текущих и исторических отключениях.

## Endpoints

### GET /current-blackouts

Возвращает все отключения, действующие на текущий момент времени.

**Ответ:**
```json
[
  {
    "district": "Первореченский район",
    "street": "ул. Пушкинская",
    "buildingNumber": "15А",
    "startDate": "2019-12-15T10:00:00.000Z",
    "endDate": "2019-12-15T18:00:00.000Z",
    "type": "electricity",
    "description": "Плановые ремонтные работы"
  }
]
```

### GET /current-blackouts/date/:date

Возвращает все отключения, которые были активны на указанную дату.

**Параметры:**
- `date` - дата в формате YYYY-MM-DD (от 2019-12-01 до 2019-12-31)

**Примеры:**
```bash
curl http://localhost:3000/current-blackouts/date/2019-12-15
curl http://localhost:3000/current-blackouts/date/2019-12-04
```

**Ответ:** такой же как у GET /current-blackouts

**Ошибки:**
- 400 - Некорректный формат даты или дата вне допустимого диапазона

## Описание полей

- `district` - название района
- `street` - название улицы
- `buildingNumber` - номер дома
- `startDate` - время начала отключения
- `endDate` - время окончания отключения (может быть null)
- `type` - тип отключения (electricity, cold_water, hot_water, heat)
- `description` - причина/описание отключения
