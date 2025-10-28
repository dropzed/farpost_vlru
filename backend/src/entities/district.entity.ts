import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from './building.entity';

@Entity('districts')
export class District {
  @ApiProperty({ description: 'Уникальный идентификатор района', example: 'district-123' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Название района', example: 'Первореченский' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({ description: 'Здания района', type: () => [Building], required: false })
  @OneToMany(() => Building, (building) => building.district)
  buildings: Building[];
}
