import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Blackout } from './blackout.entity';
import { Building } from './building.entity';

@Entity('blackouts_buildings')
export class BlackoutBuilding {
  @ApiProperty({ description: 'Уникальный идентификатор записи', example: 1 })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'ID аварии', example: 'blackout-123' })
  @Column({ type: 'varchar', length: 50, name: 'blackout_id' })
  blackoutId: string;

  @ApiProperty({ description: 'ID здания', example: 'building-456' })
  @Column({ type: 'varchar', length: 50, name: 'building_id' })
  buildingId: string;

  @ApiProperty({ description: 'Авария', type: () => Blackout, required: false })
  @ManyToOne(() => Blackout, (blackout) => blackout.blackoutBuildings)
  @JoinColumn({ name: 'blackout_id' })
  blackout: Blackout;

  @ApiProperty({ description: 'Здание', type: () => Building, required: false })
  @ManyToOne(() => Building, (building) => building.blackoutBuildings)
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
