import { Injectable } from '@nestjs/common';
import { Room } from 'shared';

@Injectable()
export class ChatRepository {
  #rooms: Room[] = [
    {
      id: '1',
      name: 'General',
      users: [],
      description: 'General chat room',
      messages: [],
    },
  ];

  list() {
    return this.#rooms.map(({ id, name, description }) => ({
      id,
      name,
      description,
    }));
  }
}
