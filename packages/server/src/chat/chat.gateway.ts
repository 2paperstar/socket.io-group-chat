import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ClientToServerEvents,
  ListResponse,
  RoomCreation,
  ServerToClientEvents,
  SocketData,
} from 'shared';
import { Namespace, Socket } from 'socket.io';
import { ChatRepository } from './chat.repository';

type Client = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  {},
  SocketData
>;

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  constructor(private readonly chatRepository: ChatRepository) {}

  @WebSocketServer()
  server: Namespace<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

  @SubscribeMessage('list')
  list(): ListResponse {
    return this.chatRepository.list();
  }

  @SubscribeMessage('create')
  create(@ConnectedSocket() client: Client, @MessageBody() data: RoomCreation) {
    const room = this.chatRepository.create(client.id, data);
    client.broadcast.emit('created', room);
    return room;
  }

  @SubscribeMessage('join')
  join(@ConnectedSocket() client: Client, @MessageBody() id: string) {
    client.join(`room:${id}`);
  }

  @SubscribeMessage('leave')
  leave(@ConnectedSocket() client: Client) {
    client.rooms.forEach((room) => {
      if (room.startsWith('room:')) {
        client.leave(room);
      }
    });
  }
}
