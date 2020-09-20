import {User} from './user';
import {Chat} from './chat';
import {SafeUrl} from "@angular/platform-browser";

export class Message {
  id: number;
  text: string;
  chatId: number;
  user: User;
  imageUrls: SafeUrl[] = [];
}
