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
   //k/ // headers = headers.append('Content-Type', 'application/json; charset=utf-8');


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
        // login successful if there's a jwt token in the response
      if (auth['access_token']) {

          localStorage.setItem('access_token', auth['access_token']);

          // store user details and jwt token in local storage to keep user logged in between page refreshes
          // this.currentUserSubject.next(user);
        }

      return auth;
      }));
  }


  login(username: string, password: string) {
    return this.http.post<any>(`editthis`, { username, password })
      .pipe(map(user => {
        // login successful if there's a jwt token in the response
        if (user) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
