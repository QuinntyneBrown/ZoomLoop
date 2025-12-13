// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { NavigationService } from '../core/navigation.service';
import { LocalStorageService, loginCredentialsKey } from '../core';
import { LoginFormComponent } from './login-form/login-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _navigationService = inject(NavigationService);
  private readonly _localStorageService = inject(LocalStorageService);

  username: string | null = null;
  password: string | null = null;
  rememberMe: boolean | null = null;

  private _destroyed$ = new Subject<void>();

  ngOnInit() {
    this._authService.logout();

    const loginCredentials = this._localStorageService.get({ name: loginCredentialsKey });

    if (loginCredentials && loginCredentials.rememberMe) {
      this.username = loginCredentials.username;
      this.password = loginCredentials.password;
      this.rememberMe = loginCredentials.rememberMe;
    }
  }

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  handleTryToLogin($event: { username: string, password: string, rememberMe: boolean }) {
    this._localStorageService.put({ name: loginCredentialsKey, value: $event.rememberMe ? $event : null });

    this._authService
    .tryToLogin({
      username: $event.username,
      password: $event.password
    })
    .pipe(
      takeUntil(this._destroyed$),
      tap(_ => this._navigationService.redirectPreLogin())
    )
    .subscribe();
  }
}
