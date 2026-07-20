import { Component, Input } from '@angular/core';
import { ColumnDto } from '../../services/api-client/models/column-dto';
import { CardDto } from '../../services/api-client/models/card-dto';
import { OrderList } from 'primeng/orderlist';

@Component({
  selector: 'app-kanban-column',
  imports: [
    OrderList,
  ],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn {
  @Input() column!: ColumnDto;
  @Input() cards!: CardDto[];

}
