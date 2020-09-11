import {User} from './user';
import {Message} from './message';

export class Chat {
  id: number;
  messages: Message[];
  users: User[];
}
