import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlackoutsService } from './blackouts.service';
import { Blackout, City, Building } from './entities';

@ApiTags('blackouts')
@Controller('blackouts')
export class BlackoutsController {
  constructor(private readonly blackoutsService: BlackoutsService) {}

  @Get('getAll')
  @ApiOperation({ summary: 'Получить все аварии', description: 'Возвращает список всех зарегистрированных аварий электро-, водо- и теплоснабжения' })
  @ApiResponse({ status: 200, description: 'Список всех аварий успешно получен', type: [Blackout] })
  getAllBlackouts() {
    return this.blackoutsService.findAll();
  }

  @Get('cities')
  @ApiOperation({ summary: 'Получить все города', description: 'Возвращает список всех городов в системе' })
  @ApiResponse({ status: 200, description: 'Список всех городов успешно получен', type: [City] })
  getAllCities() {
    return this.blackoutsService.findAllCities();
  }

  @Get('cities/:id')
  @ApiOperation({ summary: 'Получить город по ID', description: 'Возвращает данные конкретного города по его идентификатору' })
  @ApiParam({ name: 'id', description: 'Уникальный идентификатор города', type: String, example: 'city-vlru' })
  @ApiResponse({ status: 200, description: 'Данные города успешно получены', type: City })
  @ApiResponse({ status: 404, description: 'Город с указанным ID не найден' })
  getCityById(@Param('id') id: string) {
    return this.blackoutsService.findCityById(id);
  }

  @Get('buildings')
  @ApiOperation({ summary: 'Получить все здания', description: 'Возвращает список всех зданий с информацией о городе, улице, районах и микрорайонах' })
  @ApiResponse({ status: 200, description: 'Список всех зданий успешно получен', type: [Building] })
  getAllBuildings() {
    return this.blackoutsService.findAllBuildings();
  }
}
