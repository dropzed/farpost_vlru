import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Проверка работы сервера',
    description: 'Эндпоинт для проверки доступности и работоспособности API сервера'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Сервер работает корректно',
    schema: {
      type: 'string',
      example: 'Hello World!'
    }
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Внутренняя ошибка сервера' 
  })
  getHello(): string {
    try {
      return this.appService.getHello();
    } catch (error) {
      throw new InternalServerErrorException('Ошибка при проверке работы сервера');
    }
  }
}
