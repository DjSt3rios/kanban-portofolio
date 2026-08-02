import { Injectable } from '@nestjs/common';
import { BasePersistenceService } from '../base/base-persistence.service';
import { IBaseService } from '../../shared/base-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class CardService extends BasePersistenceService implements IBaseService {
  constructor(@InjectRepository(CardEntity) public cardRepo: Repository<CardEntity>) {
    super(cardRepo);
  }

  getAll(): Promise<any[]> {
    return this.cardRepo.find({
      where: {
        id: MoreThan(0),
      },
      order: {
        position: 'ASC',
      },
    });
  }
}
