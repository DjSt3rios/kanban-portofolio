import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ICard } from '../../shared/dto/card.dto';

@Injectable()
@WebSocketGateway()
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  broadcastCardDeleted(card: Partial<ICard>) {
    this.server.emit('card_deleted', card);
  }

  broadcastCardCreated(payload: ICard) {
    this.server.emit('card_created', payload);
  }

  broadcastCardUpdated(payload: Partial<ICard>) {
    this.server.emit('card_updated', payload);
  }
}
