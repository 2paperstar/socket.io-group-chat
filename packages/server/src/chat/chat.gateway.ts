import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ClientToServerEvents,
  ListResponse,
  Message,
  MessageOnServer,
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
export class ChatGateway implements OnGatewayConnection {
  constructor(private readonly chatRepository: ChatRepository) {}

  @WebSocketServer()
  server: Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>;

  handleConnection(client: Client) {
    client.data.userId = client.id;
    client.data.userName = client.handshake.query.userName.toString();
  }

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
  ): MessageOnServer[] {
    client.join(`room:${id}`);
    client.in(`room:${id}`).emit('joined', client.data);
    return this.chatRepository.getMessages(id).map((v) => ({
      ...v,
      userName: this.server.sockets.sockets.get(v.userId).data.userName,
    }));
  }

  @SubscribeMessage('leave')
  leave(@ConnectedSocket() client: Client) {
    client.rooms.forEach((room) => {
      if (room.startsWith('room:')) {
        client.leave(room);
        client.in(room).emit('left', client.data);
      }
    });
  }

  @SubscribeMessage('send')
  message(
    @ConnectedSocket() client: Client,
    @MessageBody() content: string,
  ): MessageOnServer {
    const room = [...client.rooms].find((room) => room.startsWith('room:'));
    if (!room) {
      throw new Error('Not in a room');
    }
    const message = {
      ...this.chatRepository.message(client.id, room.slice(5), content),
      userName: client.data.userName,
    };
    client.to(room).emit('message', message);
    return message;
  }
}
