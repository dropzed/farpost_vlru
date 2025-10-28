import { ApiProperty } from '@nestjs/swagger';

export class BlackoutTypesCountDto {
  @ApiProperty({ description: 'Количество аварий электроснабжения', example: 150 })
  electricity: number;

  @ApiProperty({ description: 'Количество аварий холодного водоснабжения', example: 45 })
  cold_water: number;

  @ApiProperty({ description: 'Количество аварий горячего водоснабжения', example: 30 })
  hot_water: number;

  @ApiProperty({ description: 'Количество аварий теплоснабжения', example: 25 })
  heat: number;
}
