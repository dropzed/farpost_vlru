import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { City } from './city.entity';
import { Building } from './building.entity';

@Entity('streets')
export class Street {
  @ApiProperty({ description: 'Уникальный идентификатор улицы', example: 'street-123' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Название улицы', example: 'Светланская' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'ID города', example: 'city-vlru' })
  @Column({ type: 'varchar', length: 50, name: 'city_id' })
  cityId: string;

  @ApiProperty({ description: 'Город', type: () => City, required: false })
  @ManyToOne(() => City, (city) => city.streets)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ApiProperty({ description: 'Здания на улице', type: () => [Building], required: false })
  @OneToMany(() => Building, (building) => building.street)
  buildings: Building[];
}
