import { Component, signal } from '@angular/core';
import { KanbanColumn } from './kanban-column/kanban-column';
import { ColumnDto } from '../services/api-client/models/column-dto';

@Component({
  selector: 'app-root',
  imports: [
    KanbanColumn,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('frontend');
  columns: ColumnDto[] = [];
}
