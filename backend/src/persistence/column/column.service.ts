import { Injectable } from '@nestjs/common';
import { BasePersistenceService } from '../base/base-persistence.service';
import { IBaseService } from '../../shared/base-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';

@Injectable()
export class ColumnService extends BasePersistenceService implements IBaseService {
  constructor(@InjectRepository(ColumnEntity) columnService: Repository<ColumnEntity>) {
    super(columnService);
  }
}
