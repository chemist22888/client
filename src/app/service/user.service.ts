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
    // header = header.append('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODY3MjkyNzEsInVzZXJfbmFtZSI6ImxvZ2luMSIsImF1dGhvcml0aWVzIjpbIkFETUlOIl0sImp0aSI6IjI2M2QwYjNjLTA2MDItNGU0Yi1hMWVjLTkxM2MzZGZkOTE2NCIsImNsaWVudF9pZCI6ImNsaWVudElkUGFzc3dvcmQiLCJzY29wZSI6WyJyZWFkIl19.bZQ2cgeNeHbRW60iN8iEXmfKxkAIMydW80NLAp-Rp6M');
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
