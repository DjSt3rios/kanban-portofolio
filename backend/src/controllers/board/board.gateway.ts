import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { ICard } from '../../shared/dto/card.dto';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../../shared/dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../persistence/user/user.entity';
import { Repository } from 'typeorm';
import { IColumn } from '../../shared/dto/column.dto';

@Injectable()
@WebSocketGateway()
export class BoardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  clients: Map<string, IUser> = new Map<string, IUser>();

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth.token;
    if (!token) {
      client.disconnect(true);
      return;
    }
    const payload = await this.jwtService.verifyAsync(token);
    if (!payload) {
      client.disconnect(true);
      return;
    }
    const user = await this.userRepo.findOneBy({
      id: payload?.sub,
      username: payload?.username,
    });
    if (!user) {
      client.disconnect(true);
      return;
    }
    this.clients.set(client.id, user);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client.id);
  }

  broadcastCardDeleted(card: Partial<ICard>, excludeUser: number) {
    const clientId = this.userIdToClientId(excludeUser);
    this.server.except(clientId).emit('card_deleted', card);
  }

  broadcastCardCreated(payload: ICard, excludeUser: number) {
    const clientId = this.userIdToClientId(excludeUser);
    this.server.except(clientId).emit('card_created', payload);
  }

  broadcastCardUpdated(payload: Partial<ICard>, excludeUser: number) {
    const clientId = this.userIdToClientId(excludeUser);
    this.server.except(clientId).emit('card_updated', payload);
  }

  userIdToClientId(userId: number) {
    for (const [clientId, user] of this.clients.entries()) {
      if (user.id === userId) {
        return clientId;
      }
    }
  }

  broadcastColumnDeleted(column: Partial<IColumn>, excludeUser: number) {
    const clientId = this.userIdToClientId(excludeUser);
    this.server.except(clientId).emit('column_deleted', column);
  }

  broadcastColumnCreated(payload: IColumn, excludeUser: number) {
    const clientId = this.userIdToClientId(excludeUser);
    this.server.except(clientId).emit('column_created', payload);
  }

  broadcastColumnUpdated(payload: Partial<IColumn>, excludeUser: number) {
    const clientId = this.userIdToClientId(excludeUser);
    this.server.except(clientId).emit('column_updated', payload);
  }
}
