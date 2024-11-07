import { Message } from 'message.type';
import { Room } from 'room.type';

export type RoomCreation = Pick<Room, 'name' | 'description'>;
export type RoomSummary = Pick<Room, 'id' | 'name' | 'description'>;
export type ListResponse = RoomSummary[];

export interface ServerToClientEvents {
  created: (data: RoomSummary) => void;
  message: (data: Message) => void;
  joined: () => void;
  left: () => void;
}

export interface ClientToServerEvents {
  list: (cb: (data: ListResponse) => void) => void;
  create: (data: RoomCreation, cb: (data: RoomSummary) => void) => void;
  join: (id: string, cb: (messages: Message[]) => void) => void;
  leave: () => void;
  send: (content: string, cb: (message: Message) => void) => void;
}

export interface SocketData {
  userId: string;
}
