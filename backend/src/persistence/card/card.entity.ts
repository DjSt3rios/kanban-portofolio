import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ICard } from '../../shared/dto/card.dto';
import type { IColumn } from '../../shared/dto/column.dto';
import { ColumnEntity } from '../column/column.entity';

@Entity('card')
export class CardEntity implements ICard {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'int', name: 'column_id' })
  columnId: number;

  @Column({ type: 'varchar', length: 32 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', name: 'position' })
  position: number;

  @ManyToOne(() => ColumnEntity)
  @JoinColumn({ name: 'column_id' })
  column: IColumn;
}
