// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnDestroy, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { LocalStorageService, loginCredentialsKey } from '../../core';
import { LoginForm } from '../../components/login-form';
import { Button } from '../../components/button';

@Component({
  selector: 'zl-login-dialog',
  standalone: true,
  imports: [LoginForm, Button],
  templateUrl: './login-dialog.html',
  styleUrls: ['./login-dialog.scss']
})
export class LoginDialog implements OnDestroy {
  private readonly _authService = inject(AuthService);
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _dialogRef = inject(DialogRef);

  private _destroyed$ = new Subject<void>();

  ngOnDestroy() {
    this._destroyed$.next();
    this._destroyed$.complete();
  }

  close() {
    this._dialogRef.close();
  }

  handleTryToLogin($event: { username: string, password: string, rememberMe: boolean }) {
    // Note: Following the same pattern as the Login page component
    // Storing passwords in localStorage is not recommended for production use
    this._localStorageService.put({ name: loginCredentialsKey, value: $event.rememberMe ? $event : null });

    this._authService
      .tryToLogin({
        username: $event.username,
        password: $event.password
      })
      .pipe(
        takeUntil(this._destroyed$),
        tap({
          next: () => this.close(),
          error: () => {
            // Keep dialog open on error - error handling should be done at a higher level
          }
        })
      )
      .subscribe({
        error: () => {
          // Error already handled in tap operator
        }
      });
  }
}
