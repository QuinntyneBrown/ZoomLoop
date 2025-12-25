// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../../services';
import { User, UpdateProfileRequest } from '../../models';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
    dateOfBirth: ['']
  });

  isSaving = false;

  currentUser$ = this.authService.currentUser$.pipe(
    tap(user => {
      if (!user) {
        this.router.navigate(['/']);
      } else {
        this.populateForm(user);
      }
    })
  );

  userEmail$ = this.currentUser$.pipe(
    map(user => user?.email || '')
  );

  private populateForm(user: User): void {
    this.profileForm.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || ''
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const request: UpdateProfileRequest = {
      firstName: this.profileForm.value.firstName.trim(),
      lastName: this.profileForm.value.lastName.trim(),
      phone: this.profileForm.value.phone?.trim() || undefined,
      dateOfBirth: this.profileForm.value.dateOfBirth || undefined
    };

    this.authService.updateProfile(request).pipe(
      switchMap(() => this.authService.getCurrentUser())
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
          panelClass: 'success-snackbar'
        });
      },
      error: (error) => {
        this.isSaving = false;
        this.snackBar.open(error?.error?.message || 'Failed to update profile', 'Close', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/my-dashboard']);
  }
}
