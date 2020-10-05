import {Post} from './post';
import {Wall} from './wall';
import {SafeUrl} from '@angular/platform-browser';

export class User {
  id: number;
  username: string;
  password: string;
  // wall: Wall;
  friends: User[];
  friendStatus: number;
  avatar: number;
  role: string;
  constructor(id, username?) {
    this.id = id;
    this.username = username;
  }
  posts: Post[];

}
