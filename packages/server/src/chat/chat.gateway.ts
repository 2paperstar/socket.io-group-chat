import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { ListResponse, Room } from 'shared';
import { ChatRepository } from './chat.repository';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly chatRepository: ChatRepository) {}

  @SubscribeMessage('list')
  list(): ListResponse {
    return this.chatRepository.list();
  }
}
