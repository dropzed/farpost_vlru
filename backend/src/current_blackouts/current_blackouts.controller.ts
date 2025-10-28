import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentBlackoutsService } from './current_blackouts.service';
import { CurrentBlackoutResponseDto } from './dto';

@ApiTags('current-blackouts')
@Controller('current-blackouts')
export class CurrentBlackoutsController {
  constructor(private readonly currentBlackoutsService: CurrentBlackoutsService) {}

  @Get('date/:date')
  @ApiOperation({ 
    summary: 'Получить отключения на конкретную дату', 
    description: 'Возвращает все отключения, которые были активны на указанную дату. Формат даты: YYYY-MM-DD. Можно указать любую дату.' 
  })
  @ApiParam({ 
    name: 'date', 
    description: 'Дата в формате YYYY-MM-DD. Примеры: 2019-12-15, 2024-01-10, 2025-10-27', 
    type: String, 
    example: '2019-12-15' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Список отключений на указанную дату успешно получен', 
    type: [CurrentBlackoutResponseDto] 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Некорректный формат даты' 
  })
  async getBlackoutsByDate(@Param('date') dateStr: string): Promise<CurrentBlackoutResponseDto[]> {
    return this.currentBlackoutsService.getBlackoutsByDateString(dateStr);
  }
}
