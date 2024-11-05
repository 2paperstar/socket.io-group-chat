import { Message } from './message.type';

export interface Room {
  id: string;
  name: string;
  description: string;
  users: string[];
  messages: Message[];
}
