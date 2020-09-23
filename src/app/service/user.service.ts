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
    return this.http.get<string>(`${constants.BASE_URL}/me`,
      { headers: header});
  }
  applyRequest(username: string) {
    return this.http.post(`${constants.BASE_URL}/applyFriendReq`, new HttpParams().set('username', username));
  }
  acceptRequest(username: string) {
    return this.http.post(`${constants.BASE_URL}/acceptFriendReq`, new HttpParams().set('username', username));
  }
  declineRequest(username: string) {
    return this.http.post(`${constants.BASE_URL}/declineFriendReq`, new HttpParams().set('username', username));
  }
  unbond(username: string) {
    return this.http.post(`${constants.BASE_URL}/unbond`, new HttpParams().set('username', username));
  }
  cancelRequest(username: string) {
    return this.http.post(`${constants.BASE_URL}/cancelFriendReq`, new HttpParams().set('username', username));
  }
  likePost(postId: number) {
    return this.http.post(`${constants.BASE_URL}/likePost`, new HttpParams().set('postId', '' + postId));
  }
}
