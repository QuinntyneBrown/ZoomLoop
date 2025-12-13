// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { accessTokenKey, baseUrl, usernameKey } from './constants';
import { Observable, of, ReplaySubject } from 'rxjs';
import { User, AccessRight } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _httpClient = inject(HttpClient);
  private _localStorageService = inject(LocalStorageService);
  
  private _currentUserSubject: ReplaySubject<User | null> = new ReplaySubject(1);
  public currentUser$: Observable<User | null> = this._currentUserSubject.asObservable();

  public logout() {
    this._localStorageService.put({ name: accessTokenKey, value: null});
    this._localStorageService.put({ name: usernameKey, value: null });
    this._currentUserSubject.next(null);
  }

  public tryToLogin(options: { username: string; password: string }): Observable<any> {
    return this._httpClient.post<any>('/api/user/token', options)
    .pipe(
      tap(response => {
        this._localStorageService.put({ name: accessTokenKey, value: response.accessToken });
        this._localStorageService.put({ name: usernameKey, value: options.username});
      }),
      switchMap(_ => this.getCurrentUser()),
      tap(x => this._currentUserSubject.next(x))
    );
  }

  public getCurrentUser(): Observable<User | null> {
    return this._httpClient.get<{ user: User }>('/api/user/current')
    .pipe(
      map(response => response.user),
      catchError(_ => of(null))
    );
  }

  public tryToInitializeCurrentUser(): Observable<User | null> {
    return this.getCurrentUser()
    .pipe(
      tap(user => this._currentUserSubject.next(user)),
      catchError(_ => of(null))
    );
  }

  public hasReadWritePrivileges$(aggregate:string): Observable<boolean> {
    return this.currentUser$
    .pipe(
      map(user => user ? this._hasPrivilege(user, aggregate, AccessRight.Read) && this._hasPrivilege(user, aggregate, AccessRight.Write) : false)
    )
  }

  _hasPrivilege(user: User, aggregate: string, accessRight: AccessRight):boolean {
    let hasPrivilege = false;

    for(let i = 0; i < user.roles.length; i++) {
      const privileges = user.roles[i].privileges || [];
      for(let j = 0; j < privileges.length; j++) {
        let privilege = privileges[j];
        if(privilege.accessRight == accessRight && privilege.aggregate == aggregate) {
          hasPrivilege = true;
        }
      }
    }

    return hasPrivilege;
  }
}
