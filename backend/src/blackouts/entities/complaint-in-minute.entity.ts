import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('complaints_in_minute')
export class ComplaintInMinute {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'time', name: 'complaint_time' })
  complaintTime: string;

  @Column({ type: 'varchar', length: 50, name: 'blackout_type' })
  blackoutType: string;

  @Column({ type: 'int', name: 'complaints_count', default: 0 })
  complaintsCount: number;
}
