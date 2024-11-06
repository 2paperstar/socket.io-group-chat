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
  Message,
  RoomCreation,
  ServerToClientEvents,
  SocketData,
} from 'shared';
import { Server, Socket } from 'socket.io';
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
  server: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

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
  join(
    @ConnectedSocket() client: Client,
    @MessageBody() id: string,
  ): Message[] {
    client.join(`room:${id}`);
    return this.chatRepository.getMessages(id);
  }

  @SubscribeMessage('leave')
  leave(@ConnectedSocket() client: Client) {
    client.rooms.forEach((room) => {
      if (room.startsWith('room:')) {
        client.leave(room);
      }
    });
  }

  @SubscribeMessage('send')
  message(
    @ConnectedSocket() client: Client,
    @MessageBody() content: string,
  ): Message {
    const room = [...client.rooms].find((room) => room.startsWith('room:'));
    if (!room) {
      throw new Error('Not in a room');
    }
    const message = this.chatRepository.message(
      client.id,
      room.slice(5),
      content,
    );
    client.to(room).emit('message', message);
    return message;
  }
}
