import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlackoutsMapInfoService } from './blackouts_map_info.service';
import { December2019BlackoutDto } from './dto';

@ApiTags('blackouts-map-info')
@Controller('blackouts-map-info')
export class BlackoutsMapInfoController {
  constructor(
    private readonly blackoutsMapInfoService: BlackoutsMapInfoService,
  ) {}

  @Get('december-2019')
  @ApiOperation({
    summary: 'Получить все поломки за декабрь 2019 года',
    description:
      'Возвращает список всех поломок (электричество, отопление, вода) за декабрь 2019 года с координатами и адресами для отображения на карте',
  })
  @ApiResponse({
    status: 200,
    description: 'Список поломок успешно получен',
    type: [December2019BlackoutDto],
  })
  async getDecember2019Blackouts(): Promise<December2019BlackoutDto[]> {
    return this.blackoutsMapInfoService.getDecember2019BlackoutsWithCache();
  }
}
