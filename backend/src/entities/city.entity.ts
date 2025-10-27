import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Street } from './street.entity';
import { Building } from './building.entity';

@Entity('cities')
export class City {
  @ApiProperty({ description: 'Уникальный идентификатор города', example: 'city-vlru' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Название города', example: 'Владивосток' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;


  // TODO вывод происходит только названий улиц и их айди в сервисе, если выводятся все связи тоже, раскомментировать
  // @ApiProperty({ description: 'Улицы города', type: () => [Street], required: false })
  @OneToMany(() => Street, (street) => street.city)
  streets: Street[];

  // @ApiProperty({ description: 'Здания города', type: () => [Building], required: false })
  @OneToMany(() => Building, (building) => building.city)
  buildings: Building[];
}
