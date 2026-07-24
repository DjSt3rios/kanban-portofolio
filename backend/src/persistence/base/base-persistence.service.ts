import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IBaseService } from '../../shared/base-service.interface';

@Injectable()
export class BasePersistenceService implements IBaseService {
  logger = new Logger('BasePersistenceService');

  constructor(public repo: Repository<any>) {}

  getAll(): Promise<any[]> {
    return this.repo.find().catch(() => []);
  }

  read(id: number): Promise<any> {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid ID');
    }
    return this.repo.findOneBy({ id }).catch((err) => {
      this.logger.error(err);
      throw new Error('An error has occurred, please try again later');
    });
  }

  create(data: any): Promise<any> {
    if (!data || typeof data !== 'object' || !Object.keys(data).length) {
      throw new BadRequestException('Invalid data');
    }
    return this.repo
      .insert(data)
      .then((res) => {
        return this.repo.findOneBy({ id: res?.identifiers[0]?.id });
      })
      .catch((err) => {
        this.logger.error(err);
        throw new Error('An error has occurred, please try again later');
      });
  }

  update(id: number, data: Record<string, any>): Promise<any> {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid ID');
    }
    if (!data || typeof data !== 'object' || !Object.keys(data).length) {
      throw new BadRequestException('Invalid data');
    }
    return this.repo
      .update({ id }, data)
      .then(() => {
        return this.repo.findOneBy({ id });
      })
      .catch((err) => {
        this.logger.error(err);
        throw new Error('An error has occurred, please try again later');
      });
  }

  delete(id: number) {
    if (!id || typeof id !== 'number') {
      throw new BadRequestException('Invalid ID');
    }
    return this.repo
      .delete({ id })
      .then(() => {
        return {
          success: true,
        };
      })
      .catch((err) => {
        this.logger.error(err);
        throw new Error('An error has occurred, please try again later');
      });
  }
}
