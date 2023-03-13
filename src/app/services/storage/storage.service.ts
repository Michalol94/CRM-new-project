import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  constructor(private _storage: Storage) {}

  setItem(name: string, data: string) {
    this._storage.setItem(name, data);
  }

  getItem(name: string): string | null {
    return this._storage.getItem(name);
  }

  clearStorage(): Observable<void> {
    return of(this._storage.clear());
  }
}
