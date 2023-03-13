import { AuthService } from './../services/auth/auth.service';
import { StorageService } from './../services/storage/storage.service';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private _authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          return this._authService.refreshToken().pipe(
            switchMap((resp) => {
              const newRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${resp.data.accessToken}`,
                },
              });
              return next.handle(newRequest);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}
