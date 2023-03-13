import { StorageService } from './../services/storage/storage.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserInterceptor implements HttpInterceptor {
  constructor(private _storageService: StorageService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(this._addAuthToken(req));
  }

  private _addAuthToken(req: HttpRequest<any>) {
    const accessToken = this._storageService.getItem('accessToken');
    const routes = ['auth/me', 'auth/add-bio', 'auth/my-bio'];
    if (accessToken && routes.find((url) => req.url.endsWith(url))) {
      return req.clone({
        setHeaders: { Authorization: `Bearer ${accessToken}` },
      });
    }
    return req;
  }
}
