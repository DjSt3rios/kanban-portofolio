import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { BasePersistenceService } from '../base/base-persistence.service';
import { IBaseService } from '../../shared/base-service.interface';

@Injectable()
export class UserService extends BasePersistenceService implements IBaseService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {
    super(userRepo);
  }

  create(data: any): Promise<any> {
    throw new BadRequestException('Users cannot be created from this function, call auth/register');
  }
}
