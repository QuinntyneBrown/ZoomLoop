// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CreateAccountForm, CreateAccountData } from 'zoom-loop-components';
import { AuthService } from '../../services';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, CreateAccountForm],
  templateUrl: './create-account.html',
  styleUrl: './create-account.scss'
})
export class CreateAccount {
  private router = inject(Router);
  private authService = inject(AuthService);

  isLoading = false;
  errorMessage = '';

  onSubmit(data: CreateAccountData): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      marketingOptIn: data.marketingOptIn
    }).pipe(
      switchMap(() =>
        this.authService.login({
          email: data.email,
          password: data.password,
          rememberMe: false
        }).pipe(
          catchError(() => {
            this.router.navigate(['/']);
            return of(null);
          })
        )
      )
    ).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result !== null) {
          this.router.navigate(['/my-dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }

  onSignInClick(): void {
    this.router.navigate(['/']);
  }
}
