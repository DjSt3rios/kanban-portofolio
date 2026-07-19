import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IColumn } from '../../shared/dto/column.dto';

@Entity('column')
export class ColumnEntity implements IColumn {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', length: 32 })
  title: string;

  @Column({ type: 'int', name: 'position' })
  position: number;
}
