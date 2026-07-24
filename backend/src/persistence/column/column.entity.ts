import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IColumn } from '../../shared/dto/column.dto';
import { CardEntity } from '../card/card.entity';

@Entity('column')
export class ColumnEntity implements IColumn {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  title: string;

  @Column({ type: 'int', name: 'position' })
  position: number;

  @OneToMany(() => CardEntity, (card) => card.column, { eager: true })
  cards: CardEntity[];
}
