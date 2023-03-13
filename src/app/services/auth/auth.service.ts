import { StorageService } from './../storage/storage.service';
import { CredentialsResponseData } from './../../models/credentials/credentials/credentials.response';
import { ResponseModel } from './../../models/response.model';
import { CredentialsRequest } from './../../models/credentials/credentials/credentials.request';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private _httpClient: HttpClient,

    private _storageService: StorageService
  ) {}

  login(credentials: CredentialsRequest): Observable<void> {
    return this._httpClient
      .post<ResponseModel<CredentialsResponseData>>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/login',
        { data: credentials }
      )
      .pipe(
        tap((resp) => {
          this._setStorage(resp.data);
        }),
        map((_) => void 0)
      );
  }

  register(credentials: CredentialsRequest): Observable<void> {
    return this._httpClient
      .post<ResponseModel<CredentialsResponseData>>(
        'https://us-central1-courses-auth.cloudfunctions.net/auth/register2',
        { data: credentials }
      )
      .pipe(map((_) => void 0));
  }

  logout(): Observable<void> {
    return this._storageService.clearStorage();
  }

  refreshToken(): Observable<{ data: { accessToken: string } }> {
    const refreshToken = this._storageService.getItem('refreshToken');
    if (refreshToken) {
      return this._httpClient
        .post<{ data: { accessToken: string } }>(
          'https://us-central1-courses-auth.cloudfunctions.net/auth/refresh',
          { data: { refreshToken } }
        )
        .pipe(
          tap((resp) => {
            this._storageService.setItem('accessToken', resp.data.accessToken);
          })
        );
    }
    return of();
  }

  private _setStorage(loginResponse: CredentialsResponseData): void {
    this._storageService.setItem('accessToken', loginResponse.accessToken);
    this._storageService.setItem('refreshToken', loginResponse.refreshToken);
    this._storageService.setItem(
      'emailVerified',
      JSON.stringify(loginResponse.emailVerified)
    );
    this._storageService.setItem('id', loginResponse.id);
  }
}
