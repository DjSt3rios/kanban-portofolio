import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CardDto } from '../../services/api-client/models/card-dto';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from 'primeng/autofocus';
import { Api } from '../../services/api-client/api';
import { cardControllerCreate, cardControllerDelete } from '../../services/api-client/functions';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { NgClass } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { CardDialog } from '../card-dialog/card-dialog';
import { ContextMenu } from 'primeng/contextmenu';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { BroadcastSocket } from '../../services/broadcast-socket';

@Component({
  selector: 'app-kanban-card',
  imports: [
    CdkDrag,
    InputText,
    FormsModule,
    AutoFocus,
    NgClass,
    ContextMenu,
    ConfirmDialog,
  ],
  providers: [DialogService],
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.scss',
})
export class KanbanCard implements OnInit {
  @Input() card: CardDto;
  @Output() destroyCard = new EventEmitter<number | null>();

  items: MenuItem[] | undefined;

  constructor(private api: Api, private cdr: ChangeDetectorRef, private messageService: MessageService, private dialog: DialogService, private confirmService: ConfirmationService, private wsService: BroadcastSocket) {
  }

  ngOnInit() {
    this.items = [
      { label: 'Edit', command: () => this.openCard() },
      { label: 'Delete', command: (cmd) => this.deleteCardConfirmation(cmd) },
    ];
  }

  protected createCard() {
    if (this.card?.id || !this.card?.title?.length) {
      this.destroyCard.emit();
      return;
    }

    this.api.invoke(cardControllerCreate, {
      body: {
        columnId: this.card.columnId,
        description: '',
        position: this.card.position,
        title: this.card.title,
      },
    }).then(result => {
      if (!result?.id) {
        return;
      }
      this.card.id = result?.id;
      this.cdr.detectChanges();
      this.messageService.add({
        closable: false,
        key: 'global',
        severity: 'success',
        summary: 'Card created',
        detail: 'Your card has been created',
      });
    }).catch(() => {
      this.messageService.add({
        closable: false,
        key: 'global',
        severity: 'error',
        summary: 'Something went wrong',
        detail: 'Failed to create card, please try again later',
      });
      this.destroyCard.emit();
    });

  }

  protected openCard() {
    const ref = this.dialog.open(CardDialog, {
      data: {
        card: this.card,
      },
      closable: true,
      closeOnEscape: true,
      header: 'Edit card',
      resizable: false,
      width: '600px',
      height: 'auto',
    });
    ref.onClose.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  protected onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.createCard();
    }
  }

  private deleteCardConfirmation(cmd: any) {
    this.confirmService.confirm({
      message: 'Do you want to delete this card?',
      icon: 'pi pi-info-circle',
      key: 'dialog',
      header: 'Delete confirmation',
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
        this.confirmService.close();
        this.deleteCard();
      },
      reject: () => {
        this.confirmService.close();
      },
    });
  }

  deleteCard() {
    this.api.invoke(cardControllerDelete, {
      id: this.card.id,
    }).then(() => {
      this.messageService.add({
        closable: false,
        key: 'global',
        severity: 'success',
        summary: 'Card deleted',
        detail: 'Your card has been deleted',
        life: 4000,
      });
      this.destroyCard.emit(this.card.id);
    }).catch(() => {
      this.messageService.add({
        closable: false,
        key: 'global',
        severity: 'error',
        summary: 'Something went wrong',
        detail: 'Failed to delete card, please try again later',
        life: 4000,
      });
    });
  }
}
