import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpInterceptor,
  HttpHandler
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentUser = localStorage.getItem('currentUser');

    const reqWithHeader = req.clone({
      headers: req.headers.set('x-user', currentUser || ''),
    });

    return next.handle(reqWithHeader);
  }
}
