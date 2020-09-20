import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {User} from '../entity/user';
import {Observable} from 'rxjs';
import * as constants from '../configs/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}
  getLogin() {
    let header = new HttpHeaders();
    header = header.append('foo', 'foo');
    return this.http.get<string>('http://localhost:8080/me',
      { headers: header});
  }
  applyRequest(username: string) {
    return this.http.post(`http://localhost:8080/applyFriendReq`, new HttpParams().set('username', username));
  }
  acceptRequest(username: string) {
    return this.http.post(`http://localhost:8080/acceptFriendReq`, new HttpParams().set('username', username));
  }
  declineRequest(username: string) {
    return this.http.post(`http://localhost:8080/declineFriendReq`, new HttpParams().set('username', username));
  }
  unbond(username: string) {
    return this.http.post(`http://localhost:8080/unbond`, new HttpParams().set('username', username));
  }
  cancelRequest(username: string) {
    return this.http.post(`http://localhost:8080/cancelFriendReq`, new HttpParams().set('username', username));
  }
  likePost(postId: number) {
    return this.http.post(`http://localhost:8080/likePost`, new HttpParams().set('postId', '' + postId));
  }
}
