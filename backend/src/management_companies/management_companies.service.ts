import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Initiator } from '../entities/initiator.entity';
import { InitiatorResponseDto } from './dto/initiator-response.dto';

@Injectable()
export class ManagementCompaniesService {
  constructor(
    @InjectRepository(Initiator)
    private readonly initiatorRepository: Repository<Initiator>,
  ) {}

  async getAllInitiators(): Promise<InitiatorResponseDto[]> {
    const initiators = await this.initiatorRepository.find();
    return initiators.map(initiator => ({
      initiatorName: initiator.initiatorName,
      phoneNumber: initiator.phoneNumber,
      email: initiator.email,
    }));
  }

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
