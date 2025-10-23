import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Street } from './street.entity';
import { Building } from './building.entity';

@Entity('cities')
export class City {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => Street, (street) => street.city)
  streets: Street[];

  @OneToMany(() => Building, (building) => building.city)
  buildings: Building[];
}
