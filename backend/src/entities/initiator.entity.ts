import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Blackout } from './blackout.entity';

@Entity('initiators')
export class Initiator {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Название инициатора', example: 'ООО Энергосервис' })
  @Column({ type: 'text', name: 'initiator_name' })
  initiatorName: string;

  @ApiProperty({ description: 'Номер телефона', example: '+7 (423) 123-45-67', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true, name: 'phone_number' })
  phoneNumber: string;

  @ApiProperty({ description: 'Email', example: 'contact@energoservice.ru', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @ApiProperty({ description: 'Аварии инициатора', type: () => [Blackout], required: false })
  @OneToMany(() => Blackout, (blackout) => blackout.initiator)
  blackouts: Blackout[];
}
