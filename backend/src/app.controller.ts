import { Controller, Get, InternalServerErrorException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


}
