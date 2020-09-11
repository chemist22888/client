import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as constants from '../configs/constants';
@Injectable()
export class LoginInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // console.log(`Basic ${constants.TOKEN_API}`);


    let  authHeader;
    if (!req.headers.get('authorization')) {
      if (localStorage.getItem('access_token')) {
        authHeader = `Bearer ${localStorage.getItem('access_token')}`;

        const paramReq = req.clone({
          headers: req.headers.set('authorization', authHeader)
        });
        return next.handle(paramReq);
      }
    }
    return next.handle(req);
  }
}
