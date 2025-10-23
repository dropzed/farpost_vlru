import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { BlackoutBuilding } from './blackout-building.entity';

@Entity('blackouts')
export class Blackout {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'end_date' })
  endDate: Date;

  @Column({ type: 'timestamp', nullable: true, name: 'predicted_end_date' })
  predictedEndDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'text', nullable: true, name: 'initiator_name' })
  initiatorName: string;

  @Column({ type: 'text', nullable: true })
  source: string;

  @OneToMany(() => BlackoutBuilding, (blackoutBuilding) => blackoutBuilding.blackout)
  blackoutBuildings: BlackoutBuilding[];
}
