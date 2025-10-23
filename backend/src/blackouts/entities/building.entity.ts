import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Street } from './street.entity';
import { District } from './district.entity';
import { FolkDistrict } from './folk-district.entity';
import { BigFolkDistrict } from './big-folk-district.entity';
import { City } from './city.entity';
import { BlackoutBuilding } from './blackout-building.entity';
import { Complaint } from './complaint.entity';

@Entity('buildings')
export class Building {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'street_id' })
  streetId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  number: string;

  @Column({ type: 'varchar', length: 50, name: 'district_id' })
  districtId: string;

  @Column({ type: 'boolean', name: 'is_fake', default: false })
  isFake: boolean;

  @Column({ type: 'varchar', length: 50, name: 'folk_district_id' })
  folkDistrictId: string;

  @Column({ type: 'varchar', length: 50, name: 'big_folk_district_id' })
  bigFolkDistrictId: string;

  @Column({ type: 'varchar', length: 100 })
  type: string;

  @Column({ type: 'varchar', length: 50, name: 'city_id' })
  cityId: string;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  latitude: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ManyToOne(() => Street, (street) => street.buildings)
  @JoinColumn({ name: 'street_id' })
  street: Street;

  @ManyToOne(() => District, (district) => district.buildings)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ManyToOne(() => FolkDistrict, (folkDistrict) => folkDistrict.buildings)
  @JoinColumn({ name: 'folk_district_id' })
  folkDistrict: FolkDistrict;

  @ManyToOne(() => BigFolkDistrict, (bigFolkDistrict) => bigFolkDistrict.buildings)
  @JoinColumn({ name: 'big_folk_district_id' })
  bigFolkDistrict: BigFolkDistrict;

  @ManyToOne(() => City, (city) => city.buildings)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToMany(() => BlackoutBuilding, (blackoutBuilding) => blackoutBuilding.building)
  blackoutBuildings: BlackoutBuilding[];

  @OneToMany(() => Complaint, (complaint) => complaint.building)
  complaints: Complaint[];
}
