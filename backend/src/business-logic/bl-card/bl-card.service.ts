import { Injectable, Logger } from '@nestjs/common';
import { IBaseService } from '../../shared/base-service.interface';
import { DataSource, Repository } from 'typeorm';
import { CardEntity } from '../../persistence/card/card.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardService } from '../../persistence/card/card.service';
import { ICard } from '../../shared/dto/card.dto';
import { BoardGateway } from '../../controllers/board/board.gateway';
import { AsyncLocalStorage } from 'async_hooks';
import { IUser } from '../../shared/dto/user.dto';

@Injectable()
export class BlCardService implements IBaseService {
  logger = new Logger('logger');

  constructor(
    @InjectRepository(CardEntity) public repo: Repository<CardEntity>,
    private cardService: CardService,
    private dataSource: DataSource,
    private boardGateway: BoardGateway,
    private als: AsyncLocalStorage<any>,
  ) {}

  getAll(): Promise<any[]> {
    return this.cardService.getAll();
  }

  create(data: any): Promise<any> {
    return this.createCard(data);
  }

  delete(id: number): Promise<boolean> {
    return this.deleteCard(id);
  }

  read(id: number): Promise<CardEntity> {
    return this.cardService.read(id);
  }

  async update(id: number, data: Partial<ICard>): Promise<any> {
    return this.updateCard(id, data);
  }

  async createCard(card: ICard): Promise<CardEntity> {
    const createdCard = await this.dataSource.transaction(async (manager) => {
      const lastCardInColumn = await manager.findOne(CardEntity, {
        where: { columnId: card.columnId },
        order: { position: 'DESC' },
        select: { position: true },
      });
      card.position = (lastCardInColumn?.position || 0) + 1;
      return await manager.save(CardEntity, card);
    });
    if (!createdCard) {
      this.logger.error('Failed to create card with the following data:', card);
      throw new Error('Failed to create card');
    }
    const user = this.als.getStore()?.user as IUser;
    this.boardGateway.broadcastCardCreated(createdCard, user.id);
    return createdCard;
  }

  async updateCard(cardId: number, data: Partial<ICard>): Promise<CardEntity> {
    return await this.dataSource
      .transaction(async (manager) => {
        const card = await manager.findOne(CardEntity, {
          where: { id: cardId },
        });

        if (!card) {
          throw new Error('Card not found');
        }

        const columnId = data.columnId !== undefined ? Number(data.columnId) : card.columnId;
        const position = data.position !== undefined ? Number(data.position) : card.position;

        const oldPosition = card.position;
        const oldColumnId = card.columnId;

        if (oldColumnId === columnId && oldPosition === position) {
          Object.assign(card, data);
          return await manager.save(card);
        }

        if (oldColumnId === columnId) {
          if (position < oldPosition) {
            await manager
              .createQueryBuilder()
              .update(CardEntity)
              .set({ position: () => 'position + 1' })
              .where('columnId = :columnId', { columnId: oldColumnId })
              .andWhere('position >= :newPosition', { newPosition: position })
              .andWhere('position < :oldPosition', { oldPosition })
              .execute();
          } else if (position > oldPosition) {
            await manager
              .createQueryBuilder()
              .update(CardEntity)
              .set({ position: () => 'position - 1' })
              .where('columnId = :columnId', { columnId: oldColumnId })
              .andWhere('position <= :newPosition', { newPosition: position })
              .andWhere('position > :oldPosition', { oldPosition })
              .execute();
          }
        } else {
          await manager
            .createQueryBuilder()
            .update(CardEntity)
            .set({ position: () => 'position - 1' })
            .where('columnId = :oldColumnId', { oldColumnId })
            .andWhere('position > :oldPosition', { oldPosition })
            .execute();

          await manager
            .createQueryBuilder()
            .update(CardEntity)
            .set({ position: () => 'position + 1' })
            .where('columnId = :newColumnId', { newColumnId: columnId })
            .andWhere('position >= :newPosition', { newPosition: position })
            .execute();
        }

        Object.assign(card, data);
        card.columnId = columnId;
        card.position = position;

        await manager.save(card);
        return card;
      })
      .then((card) => {
        const user = this.als.getStore()?.user as IUser;
        this.boardGateway.broadcastCardUpdated(card, user.id);
        return card;
      });
  }

  async deleteCard(cardId: number) {
    const success = await this.dataSource.transaction(async (manager) => {
      const card = await manager.findOne(CardEntity, {
        where: { id: cardId },
      });

      if (!card) {
        throw new Error('Card not found');
      }

      const deletedPosition = card.position;
      const columnId = card.columnId;

      await manager.remove(card);

      await manager
        .createQueryBuilder()
        .update(CardEntity)
        .set({ position: () => 'position - 1' })
        .where('columnId = :columnId', { columnId })
        .andWhere('position > :deletedPosition', { deletedPosition })
        .execute();

      const user = this.als.getStore()?.user as IUser;
      this.boardGateway.broadcastCardDeleted(card, user.id);
      return true;
    });
    if (!success) {
      this.logger.error('Failed to delete card with ID', cardId);
      throw new Error('Failed to delete card');
    }
    return true;
  }
}
