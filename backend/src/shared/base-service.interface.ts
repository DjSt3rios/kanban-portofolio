import { Repository } from 'typeorm';

export interface IBaseService {
  repo: Repository<any>;

  read(id: number): Promise<any>;

  create(data: any): Promise<any>;

  update(id: number, data: Record<string, any>): Promise<any>;

  delete(id: number): any;
}
