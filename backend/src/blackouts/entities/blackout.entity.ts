import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BlackoutBuilding } from './blackout-building.entity';

@Entity('blackouts')
export class Blackout {
  @ApiProperty({ description: 'Уникальный идентификатор аварии', example: 'blackout-123' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'Дата и время начала аварии', example: '2025-01-15T10:00:00Z' })
  @Column({ type: 'timestamp', name: 'start_date' })
  startDate: Date;

  @ApiProperty({ description: 'Дата и время окончания аварии', example: '2025-01-15T18:00:00Z', required: false })
  @Column({ type: 'timestamp', nullable: true, name: 'end_date' })
  endDate: Date;

  @ApiProperty({ description: 'Прогнозируемая дата окончания аварии', example: '2025-01-15T20:00:00Z', required: false })
  @Column({ type: 'timestamp', nullable: true, name: 'predicted_end_date' })
  predictedEndDate: Date;

  @ApiProperty({ description: 'Описание аварии', example: 'Плановые ремонтные работы', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Тип аварии', example: 'electricity', enum: ['electricity', 'cold_water', 'hot_water', 'heat'], required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @ApiProperty({ description: 'Имя инициатора аварии', example: 'ООО Энергосервис', required: false })
  @Column({ type: 'text', nullable: true, name: 'initiator_name' })
  initiatorName: string;

  @ApiProperty({ description: 'Источник информации об аварии', example: 'https://example.com/news', required: false })
  @Column({ type: 'text', nullable: true })
  source: string;

  @ApiProperty({ description: 'Связанные здания', type: () => [BlackoutBuilding], required: false })
  @OneToMany(() => BlackoutBuilding, (blackoutBuilding) => blackoutBuilding.blackout)
  blackoutBuildings: BlackoutBuilding[];
}
