import { SafeUrl } from '@angular/platform-browser';
import {Comment} from './comment';
import {Like} from './like';
import {User} from "./user";

export class Post {
  id: number;
  text: string;
  coments: Comment[];
  images: number[];
  imageUrls: SafeUrl[] = [];
  likes: Like[];
  likers: User[];
  liked: boolean;
}
