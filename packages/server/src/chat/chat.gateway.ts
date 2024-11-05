import { Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'net';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @SubscribeMessage('list')
  list(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    data: any,
  ): string {
    return 'Hello world!';
  }
}
