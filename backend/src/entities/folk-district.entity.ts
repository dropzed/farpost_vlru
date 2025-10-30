import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from './building.entity';

@Entity('folk_districts')
export class FolkDistrict {
  @ApiProperty({ description: 'Уникальный идентификатор микрорайона', example: 'folk-district-123' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Название микрорайона', example: 'Снеговая Падь' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'Здания микрорайона', type: () => [Building], required: false })
  @OneToMany(() => Building, (building) => building.folkDistrict)
  buildings: Building[];
}
