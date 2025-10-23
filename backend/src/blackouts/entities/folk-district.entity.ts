import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Building } from './building.entity';

@Entity('folk_districts')
export class FolkDistrict {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => Building, (building) => building.folkDistrict)
  buildings: Building[];
}
