import { Injectable } from '@angular/core';
import {BehaviorSubject, config, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../entity/user';
import {HttpParams,HttpClient, HttpHeaders} from '@angular/common/http';
import * as constants from '../configs/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }


  token(username: string, password: string): Observable<any> {
    let headers: HttpHeaders = new HttpHeaders();
    const token = btoa(`${constants.API_USER}:${constants.API_SECRET}`);
    headers = headers.append('Authorization', `Basic ${token}`);

    let data = new FormData();
      data.append('grant_type','password');
        data.append('username',username);
    data.append('password',password);

    const payload = new HttpParams()
  .set('grant_type', 'password')
  .set('username', username)
  .set('password',password);

    return this.http.post('http://localhost:8080/oauth/token', data, {headers}).pipe(map(auth => {
      console.log(auth);
      if (auth['access_token']) {
          localStorage.setItem('access_token', auth['access_token']);
        }
      return auth;
      }));
  }


  login(username: string, password: string) {
    return this.http.post<any>(`editthis`, { username, password })
      .pipe(map(user => {
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }
}
