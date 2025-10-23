# TypeORM Entities

Это entities для работы с базой данных через TypeORM.

## Структура

- **City** - Города
- **District** - Официальные районы
- **FolkDistrict** - Народные районы
- **BigFolkDistrict** - Большие народные районы
- **Street** - Улицы
- **Building** - Здания
- **Blackout** - Отключения
- **BlackoutBuilding** - Связь отключений и зданий
- **Complaint** - Жалобы
- **ComplaintInMinute** - Статистика жалоб по минутам


## API Endpoints

- `GET /blackouts/cities` - Получить все города
- `GET /blackouts/cities/:id` - Получить город по ID
- `GET /blackouts/buildings` - Получить все здания с связями
- `GET /blackouts/getAll` - Получить все отключения
