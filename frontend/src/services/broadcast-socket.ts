import { effect, inject, Service, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { CardDto } from './api-client/models/card-dto';
import { ColumnDto } from './api-client/models/column-dto';
import { Auth } from './auth';

@Service()
export class BroadcastSocket {
  private socket: Socket;

  readonly columns = signal<ColumnDto[]>([]);
  readonly isLoading = signal<boolean>(true);

  constructor() {
    const authService = inject(Auth);
    effect(() => {
      const isLoggedIn = authService.isLoggedIn;
      if (isLoggedIn()) {
        this.startConnection();
      }
    });
  }

  startConnection() {
    this.socket = io('/', {
      path: '/socket.io', auth: {
        token: localStorage.getItem('token'),
      },
    });
    this.setupListeners();
  }

  setInitialState(columns: ColumnDto[]) {
    this.columns.set(columns);
    this.isLoading.set(false);
  }

  private setupListeners() {
    this.socket.on('card_created', (newCard: CardDto) => {
      this.columns.update(currentCols => {
        return currentCols.map(col => {
          if (col.id !== newCard.columnId) return col;

          const updatedCards = [...col.cards, newCard].sort((a, b) => a.position - b.position);
          return { ...col, cards: updatedCards };
        });
      });
    });

    this.socket.on('card_deleted', (deletedCard: CardDto) => {
      this.columns.update(currentCols => {
        return currentCols.map(col => {
          if (col.id !== deletedCard.columnId) return col;

          const updatedCards = col.cards
            .filter(c => c.id !== deletedCard.id)
            .map(c => c.position > deletedCard.position ? { ...c, position: c.position - 1 } : c);

          return { ...col, cards: updatedCards };
        });
      });
    });

    this.socket.on('card_updated', (updatedCard: CardDto) => {
      this.columns.update(currentCols => {
        let sourceColId = -1;
        let oldPos = -1;

        for (const col of currentCols) {
          const found = col.cards.find(c => c.id === updatedCard.id);
          if (found) {
            sourceColId = col.id;
            oldPos = found.position;
            break;
          }
        }

        return currentCols.map(col => {
          let cards = [...col.cards];

          if (col.id === sourceColId) {
            cards = cards
              .filter(c => c.id !== updatedCard.id)
              .map(c => c.position > oldPos ? { ...c, position: c.position - 1 } : c);
          }

          if (col.id === updatedCard.columnId) {
            cards = cards.map(c => c.position >= updatedCard.position ? { ...c, position: c.position + 1 } : c);
            cards.push(updatedCard);
          }

          if (col.id === sourceColId || col.id === updatedCard.columnId) {
            cards.sort((a, b) => a.position - b.position);
          }

          return { ...col, cards };
        });
      });
    });

    this.socket.on('column_created', (newColumn: ColumnDto) => {
      this.columns.update(currentCols => {
        const columnToAdd = { ...newColumn, cards: newColumn.cards || [] };
        return [...currentCols, columnToAdd].sort((a, b) => a.position - b.position);
      });
    });

    this.socket.on('column_deleted', (deletedColumn: ColumnDto) => {
      this.columns.update(currentCols => {
        return currentCols
          .filter(col => col.id !== deletedColumn.id)
          .map(col => col.position > deletedColumn.position
            ? { ...col, position: col.position - 1 }
            : col,
          );
      });
    });

    this.socket.on('column_updated', (updatedColumn: ColumnDto) => {
      this.columns.update(currentCols => {
        const oldCol = currentCols.find(c => c.id === updatedColumn.id);
        if (!oldCol) return currentCols;

        const oldPos = oldCol.position;
        const newPos = updatedColumn.position;

        let updatedCols = currentCols.map(col => {
          if (col.id === updatedColumn.id) {
            return { ...col, ...updatedColumn, cards: col.cards };
          }

          if (oldPos !== newPos) {
            if (newPos < oldPos && col.position >= newPos && col.position < oldPos) {
              return { ...col, position: col.position + 1 };
            } else if (newPos > oldPos && col.position <= newPos && col.position > oldPos) {
              return { ...col, position: col.position - 1 };
            }
          }

          return col;
        });

        if (oldPos !== newPos) {
          updatedCols.sort((a, b) => a.position - b.position);
        }

        return updatedCols;
      });
    });
  }
}
