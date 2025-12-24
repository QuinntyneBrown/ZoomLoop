// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Inject, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule
} from '@angular/material/dialog';
import { ButtonComponent } from '../button/button.component';
import { LoginDialogMode, LoginData, RegisterData, ForgotPasswordData } from './login-dialog';

/**
 * Configuration data for the LoginDialogContent component.
 */
export interface LoginDialogContentData {
  /** Initial mode for the dialog */
  mode?: LoginDialogMode;
  /** Whether the dialog is in a loading state */
  isLoading?: boolean;
  /** Error message to display */
  errorMessage?: string;
}

/**
 * Result returned when the dialog is closed.
 */
export interface LoginDialogResult {
  /** The action that was taken */
  action: 'login' | 'register' | 'forgot-password' | 'navigate-create-account' | 'cancelled';
  /** Login data if action is 'login' */
  loginData?: LoginData;
  /** Registration data if action is 'register' */
  registerData?: RegisterData;
  /** Forgot password data if action is 'forgot-password' */
  forgotPasswordData?: ForgotPasswordData;
}

/**
 * LoginDialogContent is the content component for the login dialog
 * that works with Angular Material's MatDialog.
 *
 * @example
 * ```typescript
 * const dialogRef = this.dialogService.open(LoginDialogContent, {
 *   data: { mode: 'login' },
 *   size: 'sm'
 * });
 *
 * dialogRef.afterClosed().subscribe(result => {
 *   if (result?.action === 'login') {
 *     this.authService.login(result.loginData);
 *   }
 * });
 * ```
 */
@Component({
  selector: 'zl-login-dialog-content',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, ButtonComponent],
  templateUrl: './login-dialog-content.html',
  styleUrl: './login-dialog-content.scss'
})
export class LoginDialogContent {
  mode: LoginDialogMode;
  isLoading: boolean;
  errorMessage: string;

  loginData: LoginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  registerData: RegisterData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    marketingOptIn: false
  };

  forgotPasswordData: ForgotPasswordData = {
    email: ''
  };

  showPassword = false;
  showConfirmPassword = false;

  constructor(
    @Optional() private dialogRef: MatDialogRef<LoginDialogContent, LoginDialogResult>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: LoginDialogContentData
  ) {
    this.mode = data?.mode ?? 'login';
    this.isLoading = data?.isLoading ?? false;
    this.errorMessage = data?.errorMessage ?? '';
  }

  get modalTitle(): string {
    switch (this.mode) {
      case 'login':
        return 'Sign In';
      case 'register':
        return 'Create Account';
      case 'forgot-password':
        return 'Reset Password';
      default:
        return 'Sign In';
    }
  }

  get isLoginValid(): boolean {
    return this.loginData.email.length > 0 && this.loginData.password.length > 0;
  }

  get isRegisterValid(): boolean {
    return (
      this.registerData.email.length > 0 &&
      this.registerData.password.length >= 8 &&
      this.registerData.password === this.registerData.confirmPassword &&
      this.registerData.firstName.length > 0 &&
      this.registerData.lastName.length > 0 &&
      this.isPasswordValid(this.registerData.password)
    );
  }

  get isForgotPasswordValid(): boolean {
    return this.forgotPasswordData.email.length > 0;
  }

  isPasswordValid(password: string): boolean {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasUppercase && hasNumber;
  }

  getPasswordStrength(): string {
    const password = this.registerData.password;
    if (password.length === 0) return '';
    if (password.length < 8) return 'Too short';
    if (!this.isPasswordValid(password)) return 'Weak';
    if (password.length >= 12) return 'Strong';
    return 'Good';
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'Too short':
      case 'Weak':
        return 'login-dialog-content__password-strength--weak';
      case 'Good':
        return 'login-dialog-content__password-strength--good';
      case 'Strong':
        return 'login-dialog-content__password-strength--strong';
      default:
        return '';
    }
  }

  onClose(): void {
    this.resetForms();
    this.dialogRef?.close({ action: 'cancelled' });
  }

  onLogin(): void {
    if (this.isLoginValid && !this.isLoading) {
      this.dialogRef?.close({
        action: 'login',
        loginData: { ...this.loginData }
      });
    }
  }

  onRegister(): void {
    if (this.isRegisterValid && !this.isLoading) {
      this.dialogRef?.close({
        action: 'register',
        registerData: { ...this.registerData }
      });
    }
  }

  onForgotPassword(): void {
    if (this.isForgotPasswordValid && !this.isLoading) {
      this.dialogRef?.close({
        action: 'forgot-password',
        forgotPasswordData: { ...this.forgotPasswordData }
      });
    }
  }

  switchMode(newMode: LoginDialogMode): void {
    this.mode = newMode;
    this.errorMessage = '';
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onNavigateToCreateAccount(): void {
    this.resetForms();
    this.dialogRef?.close({ action: 'navigate-create-account' });
  }

  private resetForms(): void {
    this.loginData = { email: '', password: '', rememberMe: false };
    this.registerData = {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      marketingOptIn: false
    };
    this.forgotPasswordData = { email: '' };
    this.errorMessage = '';
    this.showPassword = false;
    this.showConfirmPassword = false;
  }
}
