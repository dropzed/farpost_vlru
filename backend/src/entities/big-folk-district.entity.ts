import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from './building.entity';

@Entity('big_folk_districts')
export class BigFolkDistrict {
  @ApiProperty({ description: 'Уникальный идентификатор большого микрорайона', example: 'big-folk-district-123' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Название большого микрорайона', example: 'Вторая Речка' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @ApiProperty({ description: 'Здания большого микрорайона', type: () => [Building], required: false })
  @OneToMany(() => Building, (building) => building.bigFolkDistrict)
  buildings: Building[];
}
