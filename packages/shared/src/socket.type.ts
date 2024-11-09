import { Message } from './message.type';
import { Room } from './room.type';

export type RoomCreation = Pick<Room, 'name' | 'description'>;
export type RoomSummary = Pick<Room, 'id' | 'name' | 'description'>;
export type ListResponse = RoomSummary[];

export type MessageOnServer = Message & SocketData & { isMe: boolean };

export interface ServerToClientEvents {
  created: (data: RoomSummary) => void;
  message: (data: MessageOnServer) => void;
  joined: (data: SocketData) => void;
  left: (data: SocketData) => void;
}

export interface ClientToServerEvents {
  list: (cb: (data: ListResponse) => void) => void;
  create: (data: RoomCreation, cb: (data: RoomSummary) => void) => void;
  join: (id: string, cb: (messages: MessageOnServer[]) => void) => void;
  leave: () => void;
  send: (content: string, cb: (message: MessageOnServer) => void) => void;
}

export interface SocketData {
  userId: string;
  userName: string;
}
