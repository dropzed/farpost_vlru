import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Blackout } from './blackout.entity';
import { Building } from './building.entity';

@Entity('blackouts_buildings')
export class BlackoutBuilding {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'blackout_id' })
  blackoutId: string;

  @Column({ type: 'varchar', length: 50, name: 'building_id' })
  buildingId: string;

  @ManyToOne(() => Blackout, (blackout) => blackout.blackoutBuildings)
  @JoinColumn({ name: 'blackout_id' })
  blackout: Blackout;

  @ManyToOne(() => Building, (building) => building.blackoutBuildings)
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
