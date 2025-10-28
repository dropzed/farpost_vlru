import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Building } from './building.entity';

@Entity('complaints')
export class Complaint {
  @ApiProperty({ description: 'Уникальный идентификатор жалобы', example: 1 })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'ID здания', example: 'building-123' })
  @Column({ type: 'varchar', length: 50, name: 'building_id' })
  buildingId: string;

  @ApiProperty({ description: 'Тип аварии', example: 'electricity', enum: ['electricity', 'cold_water', 'hot_water', 'heat'] })
  @Column({ type: 'varchar', length: 50, name: 'blackout_type' })
  blackoutType: string;

  @ApiProperty({ description: 'Здание', type: () => Building, required: false })
  @ManyToOne(() => Building, (building) => building.complaints)
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
