import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { User } from '../entity/user';
import { map } from 'rxjs/operators';
import * as constants from '../configs/constants';
import {Post} from "../entity/post";
import {Observable} from "rxjs";
import {Comment} from "../entity/comment";

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) { }
  foo() {
    return this.http.post('http://localhost:8080/wtf', {});
  }
  registrateUser(username: string, password: string, email: string) {
    const httpBody = new HttpParams()
      .set('username', username)
      .set('password', password)
      .set('email', email);

    return this.http.post('http://localhost:8080/registerUser', httpBody);
  }
  confirmRegistration(id: string) {
    const httpBody = new HttpParams()
      .set('id', id);
    return this.http.post('http://localhost:8080/confirmRegistration', httpBody);
  }
  login(token: string) {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Authorization', `Basic ${token}`);
    console.log(headers);
    return this.http.get<User>('http://localhost:8080/user/login1', { headers });
  }

  loadImage(name: number) {
     return this.http.get(constants.BASE_URL + '/image/' + name, { responseType: 'blob' });
  }

  uploadImage(base64textString) {
    return this.http.post<number>('http://localhost:8080/loadImage', 'data:image/png;base64,'
      + base64textString);
  }
  user(login: string) {
    console.log(login);

    return this.http.get<User>(`http://localhost:8080/user/${login}`, {});
  }
  writePost(text: string, images: number[]) {
    const post = new Post();
    post.text = text;
    post.images = images;

    return this.http.post<Post>('http://localhost:8080/write', post);
  }
  loadAvatar(image: number) {
    return this.http.post('http://localhost:8080' + `/loadAvatar`, new HttpParams().set('image', String(image)));
  }
  sendComment(text: string, postId: number) {
    return this.http.post<Comment>('http://localhost:8080' + `/writeComent`, new HttpParams()
      .set('text', text)
      .set('postId', String(postId)));

  }
}
