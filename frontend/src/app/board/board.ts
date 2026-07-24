import { Component } from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { KanbanColumn } from '../kanban-column/kanban-column';
import { Api } from '../../services/api-client/api';
import { columnControllerGetAll } from '../../services/api-client/fn/column/column-controller-get-all';
import { BroadcastSocket } from '../../services/broadcast-socket';

@Component({
  selector: 'app-board',
  imports: [
    CdkDropListGroup,
    KanbanColumn,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  isLoading = true;

  constructor(private api: Api, public broadcastSocket: BroadcastSocket) {
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.api.invoke(columnControllerGetAll).then((data) => {
      this.broadcastSocket.setInitialState(data);
      this.isLoading = false;
    });
  }
}
