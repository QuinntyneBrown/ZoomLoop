// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

export interface CreateAccountData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  marketingOptIn: boolean;
}

@Component({
  selector: 'zl-create-account-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './create-account-form.html',
  styleUrl: './create-account-form.scss'
})
export class CreateAccountForm {
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Output() submitted = new EventEmitter<CreateAccountData>();
  @Output() signInClick = new EventEmitter<void>();

  formData: CreateAccountData = {
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    marketingOptIn: false
  };

  showPassword = false;
  showConfirmPassword = false;

  get isFormValid(): boolean {
    return (
      this.formData.email.length > 0 &&
      this.formData.password.length >= 8 &&
      this.formData.password === this.formData.confirmPassword &&
      this.formData.firstName.length > 0 &&
      this.formData.lastName.length > 0 &&
      this.isPasswordValid(this.formData.password)
    );
  }

  isPasswordValid(password: string): boolean {
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return password.length >= 8 && hasUppercase && hasNumber;
  }

  getPasswordStrength(): string {
    const password = this.formData.password;
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
        return 'create-account-form__password-strength--weak';
      case 'Good':
        return 'create-account-form__password-strength--good';
      case 'Strong':
        return 'create-account-form__password-strength--strong';
      default:
        return '';
    }
  }

  onSubmit(): void {
    if (this.isFormValid && !this.isLoading) {
      this.submitted.emit({ ...this.formData });
    }
  }

  onSignInClick(): void {
    this.signInClick.emit();
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
