import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Building } from './building.entity';

@Entity('big_folk_districts')
export class BigFolkDistrict {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => Building, (building) => building.bigFolkDistrict)
  buildings: Building[];
}
