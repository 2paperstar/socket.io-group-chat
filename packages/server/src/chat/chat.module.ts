import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';

@Module({
  providers: [ChatGateway, ChatRepository],
})
export class ChatModule {}
