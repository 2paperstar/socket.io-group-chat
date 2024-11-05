import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ClientToServerEvents,
  ListResponse,
  Room,
  RoomCreation,
  ServerToClientEvents,
  SocketData,
} from 'shared';
import { ChatRepository } from './chat.repository';
import { Namespace, Server, Socket } from 'socket.io';

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
    client.emit('created', room);
    return room;
  }
}
