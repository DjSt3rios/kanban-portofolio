import { Injectable } from '@nestjs/common';
import { BasePersistenceService } from '../base/base-persistence.service';
import { IBaseService } from '../../shared/base-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from './card.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CardService extends BasePersistenceService implements IBaseService {
  constructor(@InjectRepository(CardEntity) cardRepo: Repository<CardEntity>) {
    super(cardRepo);
  }
}
