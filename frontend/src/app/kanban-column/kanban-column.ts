import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ColumnDto } from '../../services/api-client/models/column-dto';
import { CardDto } from '../../services/api-client/models/card-dto';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { cardControllerUpdate, columnControllerDelete, columnControllerUpdate } from '../../services/api-client/functions';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { KanbanCard } from '../kanban-card/kanban-card';
import { InputText } from 'primeng/inputtext';
import { Inplace } from 'primeng/inplace';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from 'primeng/autofocus';
import { Api } from '../../services/api-client/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { ConfirmPopup } from 'primeng/confirmpopup';
import { BroadcastSocket } from '../../services/broadcast-socket';

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
    ConfirmPopup,
    CdkDragHandle,
  ],
  providers: [ConfirmationService],
  templateUrl: './kanban-column.html',
  styleUrl: './kanban-column.scss',
})
export class KanbanColumn implements OnChanges {
  @Input() column!: ColumnDto;
  @Input() connectedListIds: string[] = [];
  @Output() reloadBoard = new EventEmitter<void>();
  title: string;


  isCardDrag = (drag: CdkDrag, drop: CdkDropList): boolean => {
    return drag.element.nativeElement.tagName.toLowerCase() !== 'app-kanban-column';
  };

  constructor(private http: HttpClient, private api: Api, private cdr: ChangeDetectorRef, private messageService: MessageService, private confirmService: ConfirmationService, private wsService: BroadcastSocket) {
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
    if (this.title === this.column?.title || this.title?.length < 3) {
      this.title = this.column?.title;
      return;
    }
    this.column.title = this.title;
    this.api.invoke(columnControllerUpdate, {
      id: this.column.id,
      body: {
        ...this.column,
        title: this.title,
      },
    }).then(() => {
      this.column.title = this.title;

      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Column title changed!',
        key: 'global',
        closable: false,
      });
      this.cdr.markForCheck();
    }).catch((err: HttpErrorResponse) => {
      const messages = err?.error?.message;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to change column title' + (messages?.length ? ': ' + messages.join() : ''),
        key: 'global',
        closable: false,
        life: 6000,
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

  protected destroyCard(cardId: number | null) {
    const cardIndex = this.column.cards.findIndex((card) => card.id === cardId || !card.id);
    if (cardIndex === -1) {
      return;
    }
    this.column.cards.splice(cardIndex, 1);
  }

  confirmColumnDeletion(event: Event) {
    this.confirmService.confirm({
      target: event.currentTarget as EventTarget,
      message: 'Do you want to delete this column?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger',
      },
      accept: () => {
        this.deleteColumn();
      },
    });
  }

  async deleteColumn() {
    this.api.invoke(columnControllerDelete, {
      id: this.column.id,
    }).then(() => {
      this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Column deleted', life: 3000, key: 'global' });
      this.wsService.columns.update(currentCols => {
        return currentCols
          .filter(col => col.id !== this.column.id)
          .map(col => col.position > this.column.position
            ? { ...col, position: col.position - 1 }
            : col,
          );
      });
    }).catch(() => {
      this.messageService.add({ severity: 'danger', summary: 'Deletion failed', detail: 'Could not delete column, please try again later', life: 3000, key: 'global' });
    });
  }
}
