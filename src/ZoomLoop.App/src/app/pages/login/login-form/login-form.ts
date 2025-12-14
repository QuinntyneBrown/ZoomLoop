// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Input } from '../../../components/input';
import { Button } from '../../../components/button';

@Component({
  selector: 'zl-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Input, Button],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.scss']
})
export class LoginForm implements OnInit {
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
