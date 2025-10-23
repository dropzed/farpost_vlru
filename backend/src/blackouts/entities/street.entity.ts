import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { City } from './city.entity';
import { Building } from './building.entity';

@Entity('streets')
export class Street {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'city_id' })
  cityId: string;

  @ManyToOne(() => City, (city) => city.streets)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => Building, (building) => building.street)
  buildings: Building[];
}
