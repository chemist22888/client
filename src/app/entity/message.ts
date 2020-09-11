import {User} from './user';
import {Chat} from './chat';

export class Message {
  id: number;
  text: string;
  user: User;
  chat: Chat;
}
