import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ConfigService } from '@nestjs/config';
import { Initiator } from '../entities';
import { InitiatorResponseDto } from './dto/initiator-response.dto';

@Injectable()
export class ManagementCompaniesService {
  private readonly logger = new Logger(ManagementCompaniesService.name);

  constructor(
    @InjectRepository(Initiator)
    private readonly initiatorRepository: Repository<Initiator>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}

  /**
   * Получить всех инициаторов с кешированием
   */
  async getAllInitiatorsWithCache(): Promise<InitiatorResponseDto[]> {
    const cacheKey = '/management-companies/initiators';
    
    // Проверка кэша
    const cached = await this.cacheManager.get<InitiatorResponseDto[]>(cacheKey);
    
    if (cached) {
      this.logger.debug(`✅ Cache HIT for key: ${cacheKey}`);
      return cached;
    }
    
    this.logger.debug(`❌ Cache MISS for key: ${cacheKey}`);
    
    // Получение данных из БД
    const data = await this.getAllInitiators();
    
    // Сохранение в кэш
    const ttl = this.configService.get<number>('CACHE_TTL_INITIATORS', 21600) * 1000;
    await this.cacheManager.set(cacheKey, data, ttl);
    this.logger.debug(`💾 Saved to cache: ${cacheKey} (TTL: ${ttl}ms)`);
    
    return data;
  }

  /**
   * Получить всех инициаторов из БД (без кеша)
   */
  async getAllInitiators(): Promise<InitiatorResponseDto[]> {
    const initiators = await this.initiatorRepository.find();
    return initiators.map(initiator => ({
      initiatorName: initiator.initiatorName,
      phoneNumber: initiator.phoneNumber,
      email: initiator.email,
    }));
  }

  /**
   * Поиск инициаторов по названию
   */
  async searchInitiatorsByName(name: string): Promise<InitiatorResponseDto[]> {
    const initiators = await this.initiatorRepository.find({
      where: {
        initiatorName: ILike(`%${name}%`),
      },
    });

    if (initiators.length === 0) {
      throw new NotFoundException(`Управляющие компании с названием "${name}" не найдены`);
    }

    return initiators.map(initiator => ({
      initiatorName: initiator.initiatorName,
      phoneNumber: initiator.phoneNumber,
      email: initiator.email,
    }));
  }
}
