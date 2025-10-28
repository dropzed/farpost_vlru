import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CountBlackoutsService } from './count_blackouts.service';
import { BlackoutTypesCountDto } from './dto';

@ApiTags('count-blackouts')
@Controller('count-blackouts')
export class CountBlackoutsController {
  constructor(private readonly countBlackoutsService: CountBlackoutsService) {}

  @Get('types')
  @ApiOperation({ 
    summary: 'Получить количество аварий по типам', 
    description: 'Возвращает статистику по количеству аварий для каждого типа: электроснабжение, холодное водоснабжение, горячее водоснабжение и теплоснабжение' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Статистика аварий по типам успешно получена',
    type: BlackoutTypesCountDto
  })
  async getBlackoutTypesCounts(): Promise<BlackoutTypesCountDto> {
    return this.countBlackoutsService.getBlackoutTypesCounts();
  }
}
