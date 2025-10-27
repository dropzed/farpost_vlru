import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('complaints_in_minute')
export class ComplaintInMinute {
  @ApiProperty({ description: 'Уникальный идентификатор записи', example: 1 })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @ApiProperty({ description: 'Время жалобы', example: '14:30:00' })
  @Column({ type: 'time', name: 'complaint_time' })
  complaintTime: string;

  @ApiProperty({ description: 'Тип аварии', example: 'electricity', enum: ['electricity', 'cold_water', 'hot_water', 'heat'] })
  @Column({ type: 'varchar', length: 50, name: 'blackout_type' })
  blackoutType: string;

  @ApiProperty({ description: 'Количество жалоб', example: 5, default: 0 })
  @Column({ type: 'int', name: 'complaints_count', default: 0 })
  complaintsCount: number;
}
