import { Component } from '@angular/core';
import { CardDto } from '../../services/api-client/models/card-dto';
import { Api } from '../../services/api-client/api';
import { MessageService } from 'primeng/api';
import { DialogConfig } from '@angular/cdk/dialog';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { ButtonDirective } from 'primeng/button';
import { cardControllerUpdate } from '../../services/api-client/functions';
import { InputText } from 'primeng/inputtext';
import { IftaLabel } from 'primeng/iftalabel';

@Component({
  selector: 'app-card-dialog',
  imports: [
    FormsModule,
    Textarea,
    ButtonDirective,
    InputText,
    IftaLabel,
  ],
  providers: [DialogConfig],
  templateUrl: './card-dialog.html',
  styleUrl: './card-dialog.scss',
})
export class CardDialog {
  card: CardDto;

  constructor(private api: Api, private messageService: MessageService, private dialogConfig: DynamicDialogConfig, public ref: DynamicDialogRef) {
    this.card = this.dialogConfig?.data?.card;
  }

  saveCard() {
    if (!this.card?.id) {
      return;
    }
    this.api.invoke(cardControllerUpdate, { id: this.card.id, body: this.card }).then((result) => {
      if (!result?.id) {
        this.messageService.add({
          severity: 'error',
          summary: 'An error has occurred',
          detail: 'Failed to save the card',
          key: 'global',
        });
        return;
      }
      this.card = result;
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Card updated successfully',
        key: 'global',
      });
      this.ref.close();
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'An error has occurred',
        detail: 'Failed to save the card',
        key: 'global',
      });
    });
  }
}
