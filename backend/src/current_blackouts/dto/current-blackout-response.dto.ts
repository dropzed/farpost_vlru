import { ApiProperty } from '@nestjs/swagger';

export class CurrentBlackoutResponseDto {
  @ApiProperty({ description: 'Название района', example: 'Первореченский район' })
  district: string;

  @ApiProperty({ description: 'Название улицы', example: 'ул. Пушкинская' })
  street: string;

  @ApiProperty({ description: 'Номер дома', example: '15А' })
  buildingNumber: string;

  @ApiProperty({ description: 'Время начала отключения', example: '2019-12-15T10:00:00.000Z' })
  startDate: Date;

  @ApiProperty({ description: 'Время окончания отключения (может быть null для текущих)', example: '2019-12-15T18:00:00.000Z', required: false })
  endDate: Date | null;

  @ApiProperty({ description: 'Тип отключения', example: 'electricity', enum: ['electricity', 'cold_water', 'hot_water', 'heat'] })
  type: string;

  @ApiProperty({ description: 'Причина отключения', example: 'Плановые ремонтные работы' })
  description: string;
}
