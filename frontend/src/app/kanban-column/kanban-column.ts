import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnDto } from '../../services/api-client/models/column-dto';
import { CardDto } from '../../services/api-client/models/card-dto';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { cardControllerUpdate } from '../../services/api-client/functions';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-kanban-column',
  imports: [
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn {
  @Input() column!: ColumnDto;
  @Input() cards!: CardDto[];
  @Output() reloadBoard = new EventEmitter<void>();

  constructor(private http: HttpClient) {
  }

  onCardDrop(event: CdkDragDrop<CardDto[]>, targetColumnId: number) {
    const previousArray = event.previousContainer.data;
    const currentArray = event.container.data;
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;

    if (event.previousContainer === event.container && previousIndex === currentIndex) {
      return;
    }

    const movedCard = previousArray[previousIndex];

    if (event.previousContainer === event.container) {
      moveItemInArray(currentArray, previousIndex, currentIndex);

      currentArray.forEach((card, index) => card.position = index);
    } else {
      transferArrayItem(previousArray, currentArray, previousIndex, currentIndex);

      movedCard.columnId = targetColumnId;
      previousArray.forEach((card, index) => card.position = index);
      currentArray.forEach((card, index) => card.position = index);
    }

    cardControllerUpdate(this.http, '', {
      id: movedCard.id,
      body: {
        columnId: movedCard.columnId,
        description: movedCard.description,
        id: movedCard.id,
        position: movedCard.position,
        title: movedCard.title,
      },
    }).subscribe({
      error: (err) => {
        this.reloadBoard.emit();
      },
    });
  }
}
