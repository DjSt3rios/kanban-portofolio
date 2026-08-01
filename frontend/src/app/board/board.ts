import { Component } from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { KanbanColumn } from '../kanban-column/kanban-column';
import { Api } from '../../services/api-client/api';
import { columnControllerGetAll } from '../../services/api-client/fn/column/column-controller-get-all';
import { BroadcastSocket } from '../../services/broadcast-socket';
import { MegaMenu } from 'primeng/megamenu';
import { MegaMenuItem } from 'primeng/api';
import { NgClass } from '@angular/common';
import { Ripple } from 'primeng/ripple';
import { ButtonDirective } from 'primeng/button';
import { Router } from '@angular/router';
import { columnControllerCreate } from '../../services/api-client/functions';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-board',
  imports: [
    CdkDropListGroup,
    KanbanColumn,
    MegaMenu,
    NgClass,
    Ripple,
    ButtonDirective,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  isLoading = true;
  items: MegaMenuItem[] | undefined;

  constructor(private api: Api, public broadcastSocket: BroadcastSocket, private router: Router, private authService: Auth) {
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
    });
  }

  logout() {
    this.authService.isLoggedIn.set(false);
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
  }

}
