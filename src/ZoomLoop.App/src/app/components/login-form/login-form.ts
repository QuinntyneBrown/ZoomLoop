// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Output, EventEmitter, Input as InputDecorator, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Input } from '../input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'zl-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Input, MatButtonModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss']
})
export class LoginForm implements OnInit {
  @InputDecorator()
  username: string | null = null;

  @InputDecorator()
  password: string | null = null;

  @InputDecorator()
  rememberMe: boolean | null = null;

  readonly form = new FormGroup({
    username: new FormControl(this.username, [Validators.required]),
    password: new FormControl(this.password, [Validators.required]),
    rememberMe: new FormControl(this.rememberMe, [])
  });

  @Output() readonly tryToLogin: EventEmitter<{ username: string, password: string, rememberMe: boolean }> = new EventEmitter();

  ngOnInit(): void {
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
