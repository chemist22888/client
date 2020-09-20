import {HttpEvent, HttpHandler, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../service/authentication.service';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

@Injectable()
export class ErrorInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401 ) {
          this.router.navigateByUrl('/login');
        localStorage.removeItem('access_token');
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}
