import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Building } from './building.entity';

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'building_id' })
  buildingId: string;

  @Column({ type: 'varchar', length: 50, name: 'blackout_type' })
  blackoutType: string;

  @ManyToOne(() => Building, (building) => building.complaints)
  @JoinColumn({ name: 'building_id' })
  building: Building;
}
