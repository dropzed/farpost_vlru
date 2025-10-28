import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ManagementCompaniesService } from './management_companies.service';
import { InitiatorResponseDto } from './dto/initiator-response.dto';

@ApiTags('Управляющие компании')
@Controller('management-companies')
export class ManagementCompaniesController {
  constructor(
    private readonly managementCompaniesService: ManagementCompaniesService,
  ) {}

  @Get('initiators')
  @ApiOperation({ summary: 'Получить список всех управляющих компаний' })
  @ApiResponse({ status: 200, description: 'Список компаний', type: [InitiatorResponseDto] })
  async getAllInitiators(): Promise<InitiatorResponseDto[]> {
    return this.managementCompaniesService.getAllInitiatorsWithCache();
  }

  @Get('initiators/search')
  @ApiOperation({ summary: 'Поиск управляющей компании по названию' })
  @ApiQuery({ name: 'name', required: true, description: 'Название управляющей компании для поиска' })
  @ApiResponse({ status: 200, description: 'Результаты поиска', type: [InitiatorResponseDto] })
  @ApiResponse({ status: 404, description: 'Управляющие компании не найдены' })
  async searchInitiators(@Query('name') name: string): Promise<InitiatorResponseDto[]> {
    return this.managementCompaniesService.searchInitiatorsByName(name);
  }
}
