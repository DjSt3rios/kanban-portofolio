import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from '../../persistence/card/card.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { BoardGateway } from '../../controllers/board/board.gateway';
import { AsyncLocalStorage } from 'async_hooks';
import { ICard } from '../../shared/dto/card.dto';
import { IUser } from '../../shared/dto/user.dto';
import { ColumnEntity } from '../../persistence/column/column.entity';
import { IColumn } from '../../shared/dto/column.dto';
import { ColumnService } from '../../persistence/column/column.service';

@Injectable()
export class BlColumnService {
  logger = new Logger('logger');

  constructor(
    @InjectRepository(ColumnEntity) public repo: Repository<ColumnEntity>,
    private cardService: ColumnService,
    private dataSource: DataSource,
    private boardGateway: BoardGateway,
    private als: AsyncLocalStorage<any>,
  ) {}

  getAll(): Promise<any[]> {
    return this.cardService.getAll();
  }

  create(data: any): Promise<any> {
    return this.createColumn(data);
  }

  delete(id: number): Promise<boolean> {
    return this.deleteColumn(id);
  }

  read(id: number): Promise<CardEntity> {
    return this.cardService.read(id);
  }

  async update(id: number, data: Partial<ICard>): Promise<any> {
    return this.updateColumn(id, data);
  }

  async createColumn(column: IColumn): Promise<ColumnEntity> {
    const createdColumn = await this.dataSource.transaction(async (manager) => {
      const lastColumn = await manager.findOne(ColumnEntity, {
        where: { id: MoreThan(0) },
        order: { position: 'DESC' },
        select: { id: true, position: true },
      });
      column.position = (lastColumn?.position || 0) + 1;
      return await manager.save(ColumnEntity, column);
    });
    if (!createdColumn) {
      this.logger.error('Failed to create column with the following data:', column);
      throw new Error('Failed to create column');
    }
    const user = this.als.getStore()?.user as IUser;
    createdColumn.cards = [];
    this.boardGateway.broadcastColumnCreated(createdColumn, user.id);
    return createdColumn;
  }

  async updateColumn(columnId: number, data: Partial<IColumn>): Promise<ColumnEntity> {
    return await this.dataSource
      .transaction(async (manager) => {
        const column = await manager.findOne(ColumnEntity, {
          where: { id: columnId },
        });

        if (!column) {
          throw new Error('Column not found');
        }

        const position = data.position !== undefined ? Number(data.position) : column.position;
        const oldPosition = column.position;

        if (oldPosition === position) {
          Object.assign(column, data);
          return await manager.save(column);
        }

        if (position < oldPosition) {
          await manager
            .createQueryBuilder()
            .update(ColumnEntity)
            .set({ position: () => 'position + 1' })
            .where('position >= :newPosition', { newPosition: position })
            .andWhere('position < :oldPosition', { oldPosition })
            .execute();
        } else if (position > oldPosition) {
          await manager
            .createQueryBuilder()
            .update(ColumnEntity)
            .set({ position: () => 'position - 1' })
            .where('position <= :newPosition', { newPosition: position })
            .andWhere('position > :oldPosition', { oldPosition })
            .execute();
        }

        Object.assign(column, data);
        column.position = position;

        await manager.save(column);
        return column;
      })
      .then((column) => {
        const user = this.als.getStore()?.user as IUser;
        this.boardGateway.broadcastColumnUpdated(column, user.id);
        return column;
      });
  }

  async deleteColumn(columnId: number) {
    const success = await this.dataSource.transaction(async (manager) => {
      const column = await manager.findOne(ColumnEntity, {
        where: { id: columnId },
      });

      if (!column) {
        throw new Error('Column not found');
      }

      const deletedPosition = column.position;

      await manager.delete(CardEntity, {
        columnId,
      });

      await manager.remove(column);

      await manager
        .createQueryBuilder()
        .update(ColumnEntity)
        .set({ position: () => 'position - 1' })
        .where('id = :columnId', { columnId })
        .andWhere('position > :deletedPosition', { deletedPosition })
        .execute();

      const user = this.als.getStore()?.user as IUser;
      this.boardGateway.broadcastColumnDeleted({ id: columnId }, user.id);
      return true;
    });
    if (!success) {
      this.logger.error('Failed to delete column with ID', columnId);
      throw new Error('Failed to delete column');
    }
    return true;
  }
}
