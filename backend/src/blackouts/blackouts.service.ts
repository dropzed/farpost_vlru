import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blackout, City, Building } from './entities';

@Injectable()
export class BlackoutsService {
  constructor(
    @InjectRepository(Blackout)
    private readonly blackoutsRepo: Repository<Blackout>,
    @InjectRepository(City)
    private readonly citiesRepo: Repository<City>,
    @InjectRepository(Building)
    private readonly buildingsRepo: Repository<Building>,
  ) {}

  findAll() {
    return this.blackoutsRepo.find();
  }

  findAllCities() {
    return this.citiesRepo.find();
  }

  findCityById(id: string) {
    return this.citiesRepo.findOne({ where: { id } });
  }

  findAllBuildings() {
    return this.buildingsRepo.find({
      relations: ['city', 'street', 'district', 'folkDistrict', 'bigFolkDistrict'],
    });
  }
}
