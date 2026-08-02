import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { CardDto } from '../../services/api-client/models/card-dto';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { AutoFocus } from 'primeng/autofocus';
import { Api } from '../../services/api-client/api';
import { cardControllerCreate } from '../../services/api-client/functions';
import { MessageService } from 'primeng/api';
import { NgClass } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { CardDialog } from '../card-dialog/card-dialog';

@Component({
  selector: 'app-kanban-card',
  imports: [
    CdkDrag,
    InputText,
    FormsModule,
    AutoFocus,
    NgClass,
  ],
  providers: [DialogService],
  templateUrl: './kanban-card.html',
  styleUrl: './kanban-card.scss',
})
export class KanbanCard implements OnInit {
  @Input() card: CardDto;
  @Output() destroyCard = new EventEmitter<void>();

  constructor(private api: Api, private cdr: ChangeDetectorRef, private messageService: MessageService, private dialog: DialogService) {
  }

  ngOnInit() {
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

  protected openCard(id: number) {
    if (!id) {
      return;
    }
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
}
