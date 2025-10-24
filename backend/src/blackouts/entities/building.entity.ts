import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Street } from './street.entity';
import { District } from './district.entity';
import { FolkDistrict } from './folk-district.entity';
import { BigFolkDistrict } from './big-folk-district.entity';
import { City } from './city.entity';
import { BlackoutBuilding } from './blackout-building.entity';
import { Complaint } from './complaint.entity';

@Entity('buildings')
export class Building {
  @ApiProperty({ description: 'Уникальный идентификатор здания', example: 'building-123' })
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @ApiProperty({ description: 'ID улицы', example: 'street-456' })
  @Column({ type: 'varchar', length: 50, name: 'street_id' })
  streetId: string;

  @ApiProperty({ description: 'Номер дома', example: '15А', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  number: string;

  @ApiProperty({ description: 'ID района', example: 'district-789' })
  @Column({ type: 'varchar', length: 50, name: 'district_id' })
  districtId: string;

  @ApiProperty({ description: 'Является ли здание фиктивным', example: false, default: false })
  @Column({ type: 'boolean', name: 'is_fake', default: false })
  isFake: boolean;

  @ApiProperty({ description: 'ID микрорайона', example: 'folk-district-101' })
  @Column({ type: 'varchar', length: 50, name: 'folk_district_id' })
  folkDistrictId: string;

  @ApiProperty({ description: 'ID большого микрорайона', example: 'big-folk-district-202' })
  @Column({ type: 'varchar', length: 50, name: 'big_folk_district_id' })
  bigFolkDistrictId: string;

  @ApiProperty({ description: 'Тип здания', example: 'Жилой дом' })
  @Column({ type: 'varchar', length: 100 })
  type: string;

  @ApiProperty({ description: 'ID города', example: 'city-vlru' })
  @Column({ type: 'varchar', length: 50, name: 'city_id' })
  cityId: string;

  @ApiProperty({ description: 'Широта', example: 43.115141, required: false })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  latitude: number;

  @ApiProperty({ description: 'Долгота', example: 131.885341, required: false })
  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude: number;

  @ApiProperty({ description: 'Улица', type: () => Street, required: false })
  @ManyToOne(() => Street, (street) => street.buildings)
  @JoinColumn({ name: 'street_id' })
  street: Street;

  @ApiProperty({ description: 'Район', type: () => District, required: false })
  @ManyToOne(() => District, (district) => district.buildings)
  @JoinColumn({ name: 'district_id' })
  district: District;

  @ApiProperty({ description: 'Микрорайон', type: () => FolkDistrict, required: false })
  @ManyToOne(() => FolkDistrict, (folkDistrict) => folkDistrict.buildings)
  @JoinColumn({ name: 'folk_district_id' })
  folkDistrict: FolkDistrict;

  @ApiProperty({ description: 'Большой микрорайон', type: () => BigFolkDistrict, required: false })
  @ManyToOne(() => BigFolkDistrict, (bigFolkDistrict) => bigFolkDistrict.buildings)
  @JoinColumn({ name: 'big_folk_district_id' })
  bigFolkDistrict: BigFolkDistrict;

  @ApiProperty({ description: 'Город', type: () => City, required: false })
  @ManyToOne(() => City, (city) => city.buildings)
  @JoinColumn({ name: 'city_id' })
  city: City;

  @ApiProperty({ description: 'Аварии, связанные со зданием', type: () => [BlackoutBuilding], required: false })
  @OneToMany(() => BlackoutBuilding, (blackoutBuilding) => blackoutBuilding.building)
  blackoutBuildings: BlackoutBuilding[];

  @ApiProperty({ description: 'Жалобы, связанные со зданием', type: () => [Complaint], required: false })
  @OneToMany(() => Complaint, (complaint) => complaint.building)
  complaints: Complaint[];
}
