import { ApiProperty } from '@nestjs/swagger';

export class December2019BlackoutDto {
  @ApiProperty({
    description: 'Широта местоположения',
    example: 43.2319367,
  })
  latitude: number;

  @ApiProperty({
    description: 'Долгота местоположения',
    example: 131.9992973,
  })
  longitude: number;

  @ApiProperty({
    description: 'Полный адрес',
    example: 'Владивосток, ул. Белинского ул., д. 21',
  })
  fullAddress: string;

  @ApiProperty({
    description: 'Тип поломки',
    enum: ['electricity', 'heat', 'cold_water', 'hot_water'],
    example: 'electricity',
  })
  type: string;

  @ApiProperty({
    description: 'Описание поломки',
    example: 'Плановые работы по ремонту и диагностике электросетей',
  })
  description: string;
}
