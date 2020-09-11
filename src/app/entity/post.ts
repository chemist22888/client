import { SafeUrl } from '@angular/platform-browser';
import {Comment} from './comment';
import {Like} from './like';

export class Post {
  id: number;
  text: string;
  coments: Comment[];
  images: string[];
  imageUrls: SafeUrl[] = [];
  likes: Like[];
}
