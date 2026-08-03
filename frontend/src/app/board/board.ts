import { ChangeDetectorRef, Component, computed } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { KanbanColumn } from '../kanban-column/kanban-column';
import { Api } from '../../services/api-client/api';
import { columnControllerGetAll } from '../../services/api-client/fn/column/column-controller-get-all';
import { BroadcastSocket } from '../../services/broadcast-socket';
import { MegaMenu } from 'primeng/megamenu';
import { MegaMenuItem, MessageService } from 'primeng/api';
import { NgClass } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { Router } from '@angular/router';
import { columnControllerCreate, columnControllerUpdate } from '../../services/api-client/functions';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-board',
  imports: [
    KanbanColumn,
    MegaMenu,
    NgClass,
    Ripple,
    ButtonDirective,
    CdkDropList,
    CdkDrag,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  isLoading = true;
  items: MegaMenuItem[] | undefined;
  isColumnDrag = (drag: CdkDrag, drop: CdkDropList): boolean => {
    return drag.element.nativeElement.tagName.toLowerCase() === 'app-kanban-column';
  };

  connectedColumnIds = computed(() => {
    return this.broadcastSocket.columns().map(column => column.id.toString());
  });

  constructor(private api: Api, public broadcastSocket: BroadcastSocket, private router: Router, private authService: Auth, private wsService: BroadcastSocket, private messageService: MessageService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.loadData();
    this.items = [
      {
        label: 'New Column',
        root: true,
        command: () => this.addNewColumn(),
      },
      {
        label: 'Log out',
        root: true,
        command: () => this.logout(),
      },
    ];
  }

  loadData() {
    this.isLoading = true;
    this.api.invoke(columnControllerGetAll).then((data) => {
      this.broadcastSocket.setInitialState(data);
      this.isLoading = false;
    });
  }

  addNewColumn() {
    this.api.invoke(columnControllerCreate, {
      body: {
        title: 'New Column',
        position: null,
      },
    }).then((col) => {
      this.wsService.columns.update((cols) => {
        cols.push(col);
        return cols;
      });
      this.cdr.markForCheck();
    }).catch(() => {
      this.messageService.add({
        severity: 'danger',
        key: 'global',
        summary: 'An error occurred',
        detail: 'Failed to add column, please try again later',
        life: 3000,
      });
    });
  }

  logout() {
    this.authService.isLoggedIn.set(false);
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

  protected onColumnDrop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) return;
    const columns = this.broadcastSocket.columns();
    const column = columns[event.previousIndex];
    moveItemInArray(columns, event.previousIndex, event.currentIndex);
    columns.forEach((column, index) => {
      column.position = index + 1;
    });
    this.cdr.markForCheck();
    this.api.invoke(columnControllerUpdate, {
      body: {
        id: column.id,
        position: event.currentIndex + 1,
        title: column.title,
      },
      id: column.id,
    }).catch((err) => {
      this.messageService.add({
        severity: 'danger',
        key: 'global',
        summary: 'An error occurred',
        detail: 'Failed to add column, please try again later',
        life: 3000,
      });
    });
  }
}
