import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ColumnDto } from '../../services/api-client/models/column-dto';
import { CardDto } from '../../services/api-client/models/card-dto';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { cardControllerUpdate, columnControllerUpdate } from '../../services/api-client/functions';
import { HttpClient } from '@angular/common/http';
import { KanbanCard } from '../kanban-card/kanban-card';
import { InputText } from 'primeng/inputtext';
import { Inplace } from 'primeng/inplace';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from 'primeng/autofocus';
import { Api } from '../../services/api-client/api';
import { MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-kanban-column',
  imports: [
    CdkDropList,
    KanbanCard,
    InputText,
    Inplace,
    FormsModule,
    AutoFocus,
    ButtonDirective,
  ],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn implements OnChanges {
  @Input() column!: ColumnDto;
  @Output() reloadBoard = new EventEmitter<void>();
  title: string;

  constructor(private http: HttpClient, private api: Api, private cdr: ChangeDetectorRef, private messageService: MessageService) {
  }

  ngOnChanges(changes: SimpleChanges<any>) {
    if (changes.column) {
      this.title = this.column?.title;
    }
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
        position: movedCard.position + 1,
        title: movedCard.title,
      },
    }).subscribe({
      error: (err) => {
        this.reloadBoard.emit();
      },
    });
  }

  onClosed() {
    if (this.title === this.column?.title) {
      return;
    }
    this.column.title = this.title;
    this.api.invoke(columnControllerUpdate, {
      id: this.column.id,
      body: {
        ...this.column,
        title: this.title,
      },
    }).then((res) => {
      if (!res?.title) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to change column title, please try again later',
          key: 'global',
          closable: false,
        });
        return;
      }
      this.column.title = this.title;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Column title changed!',
        key: 'global',
        closable: false,
      });
      this.cdr.markForCheck();
    }).catch((err) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to change column title, please try again later',
        key: 'global',
        closable: false,
      });
      this.reloadBoard.emit();
      console.error(err);
    });

  }

  protected onKeyUp(event: KeyboardEvent, closeCallback: Function) {
    if (event.key !== 'Enter') {
      return;
    }
    closeCallback();
  }

  protected newCard() {
    if (this.column?.cards?.findIndex((card) => card.title === '') !== -1) {
      return;
    }
    this.column.cards.push({
      title: '',
      position: 999,
      description: '',
      columnId: this.column.id,
      id: undefined,
    });
  }

  protected cardCreationFailed() {
    const cardIndex = this.column.cards.findIndex((card) => !card.id);
    if (cardIndex === -1) {
      return;
    }
    this.column.cards.splice(cardIndex, 1);
  }
}
