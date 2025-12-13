// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from '../../components/input';
import { ButtonComponent } from '../../components/button';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {
  @Input()
  username: string | null = null;

  @Input()
  password: string | null = null;

  @Input()
  rememberMe: boolean | null = null;

  readonly form = new FormGroup({
    username: new FormControl(this.username, [Validators.required]),
    password: new FormControl(this.password, [Validators.required]),
    rememberMe: new FormControl(this.rememberMe, [])
  });

  @Output() readonly tryToLogin: EventEmitter<{ username: string, password: string, rememberMe: boolean }> = new EventEmitter();

  ngAfterContentInit(): void {
    this.form.patchValue({
      username: this.username,
      password: this.password,
      rememberMe: this.rememberMe
    });
  }

  handleSubmit(): void {
    if (this.form.valid) {
      this.tryToLogin.emit(this.form.value as { username: string, password: string, rememberMe: boolean });
    }
  }
}
