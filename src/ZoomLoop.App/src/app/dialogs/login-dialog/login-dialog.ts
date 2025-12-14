// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { LocalStorageService, loginCredentialsKey } from '../../core';
import { LoginForm } from '../../components/login-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zl-login-dialog',
  standalone: true,
  imports: [CommonModule, LoginForm],
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss']
})
export class LoginDialog implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _localStorageService = inject(LocalStorageService);

  readonly isOpen = signal(false);
  private _destroyed$ = new Subject<void>();

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  open() {
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
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
        tap(_ => this.close())
      )
      .subscribe();
  }

  handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
