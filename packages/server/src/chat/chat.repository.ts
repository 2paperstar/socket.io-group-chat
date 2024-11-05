import { Injectable } from '@nestjs/common';
import { Room, RoomCreation, SocketData } from 'shared';

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

  create(id: string, data: RoomCreation) {
    const room = {
      id: String(this.#rooms.length + 1),
      name: data.name,
      users: [],
      description: data.description,
      messages: [],
    };
    this.#rooms.push(room);
    return { id: room.id, name: room.name, description: room.description };
  }
}
