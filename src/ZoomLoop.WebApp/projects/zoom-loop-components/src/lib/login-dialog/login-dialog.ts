// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

export type LoginDialogMode = 'login' | 'register' | 'forgot-password';

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingOptIn: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

@Component({
  selector: 'zl-login-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, InputComponent, ButtonComponent],
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.scss'
})
export class LoginDialog {
  @Input() isOpen = false;
  @Input() mode: LoginDialogMode = 'login';
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Output() closed = new EventEmitter<void>();
  @Output() login = new EventEmitter<LoginData>();
  @Output() register = new EventEmitter<RegisterData>();
  @Output() forgotPassword = new EventEmitter<ForgotPasswordData>();
  @Output() modeChanged = new EventEmitter<LoginDialogMode>();

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
        return 'login-dialog__password-strength--weak';
      case 'Good':
        return 'login-dialog__password-strength--good';
      case 'Strong':
        return 'login-dialog__password-strength--strong';
      default:
        return '';
    }
  }

  onClose(): void {
    this.resetForms();
    this.closed.emit();
  }

  onLogin(): void {
    if (this.isLoginValid && !this.isLoading) {
      this.login.emit({ ...this.loginData });
    }
  }

  onRegister(): void {
    if (this.isRegisterValid && !this.isLoading) {
      this.register.emit({ ...this.registerData });
    }
  }

  onForgotPassword(): void {
    if (this.isForgotPasswordValid && !this.isLoading) {
      this.forgotPassword.emit({ ...this.forgotPasswordData });
    }
  }

  switchMode(newMode: LoginDialogMode): void {
    this.mode = newMode;
    this.errorMessage = '';
    this.modeChanged.emit(newMode);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
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
