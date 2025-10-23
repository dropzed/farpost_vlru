import { Controller, Get, Param } from '@nestjs/common';
import { BlackoutsService } from './blackouts.service';

@Controller('blackouts')
export class BlackoutsController {
  constructor(private readonly blackoutsService: BlackoutsService) {}

  @Get('getAll')
  getAllBlackouts() {
    return this.blackoutsService.findAll();
  }

  @Get('cities')
  getAllCities() {
    return this.blackoutsService.findAllCities();
  }

  @Get('cities/:id')
  getCityById(@Param('id') id: string) {
    return this.blackoutsService.findCityById(id);
  }

  @Get('buildings')
  getAllBuildings() {
    return this.blackoutsService.findAllBuildings();
  }
}
