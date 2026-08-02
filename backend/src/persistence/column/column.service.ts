import { Injectable } from '@nestjs/common';
import { BasePersistenceService } from '../base/base-persistence.service';
import { IBaseService } from '../../shared/base-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { ColumnEntity } from './column.entity';

@Injectable()
export class ColumnService extends BasePersistenceService implements IBaseService {
  constructor(@InjectRepository(ColumnEntity) public columnRepository: Repository<ColumnEntity>) {
    super(columnRepository);
  }

  async create(data: any): Promise<any> {
    if (!data?.position) {
      data.position = await this.getLastPosition();
    }
    return super.create(data);
  }

  async getLastPosition(): Promise<number> {
    const lastColumn = await this.columnRepository.findOne({
      where: {
        id: MoreThan(0),
      },
      order: {
        position: 'DESC',
      },
      select: {
        id: true,
        position: true,
      },
    });
    return (lastColumn?.position || 0) + 1;
  }

  getAll(): Promise<any[]> {
    return this.columnRepository.find({
      where: {
        id: MoreThan(0),
      },
      order: {
        position: 'ASC',
        cards: {
          position: 'ASC',
        },
      },
    });
  }
}
