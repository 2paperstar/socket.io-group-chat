import { Room } from 'room.type';

export type RoomSummary = Pick<Room, 'id' | 'name' | 'description'>;
export type ListResponse = RoomSummary[];

export interface ServerToClientEvents {
  created: (cb: (data: RoomSummary) => void) => void;
}

export interface ClientToServerEvents {
  list: (cb: (data: ListResponse) => void) => void;
}
