// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileService } from '../../core/profile.service';
import { Profile } from '../../models';
import { AddressEditor, Address } from '../../components/address-editor';

@Component({
  selector: 'zl-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    AddressEditor
  ],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.scss']
})
export class PersonalInfo implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _profileService = inject(ProfileService);
  private readonly _router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  form!: FormGroup;
  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.form = this._fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      address: this._fb.group({
        addressLine1: [''],
        addressLine2: [''],
        city: [''],
        province: [''],
        postalCode: [''],
        country: ['']
      })
    });

    this.loadProfile();
  }

  async loadProfile() {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const profile = await firstValueFrom(this._profileService.getCurrentProfile());
      
      if (profile) {
        this.form.patchValue({
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          address: {
            addressLine1: profile.addressLine1,
            addressLine2: profile.addressLine2,
            city: profile.city,
            province: profile.province,
            postalCode: profile.postalCode,
            country: profile.country
          }
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      const errorMsg = error?.error?.message || error?.message || 'Failed to load profile';
      this.errorMessage.set(errorMsg);
      this._snackBar.open(errorMsg, 'Close', { duration: 5000 });
    } finally {
      this.isLoading.set(false);
    }
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set(null);

    try {
      const formValue = this.form.value;
      const address = formValue.address as Address;

      const profile: Profile = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneNumber: formValue.phoneNumber,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode,
        country: address.country,
        isVerified: false
      };

      await firstValueFrom(this._profileService.updateProfile(profile));
      
      this._snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
      
      // Optionally navigate away or reload
      // this._router.navigate(['/']);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const errorMsg = error?.error?.message || error?.message || 'Failed to update profile. Please try again.';
      this.errorMessage.set(errorMsg);
      this._snackBar.open(errorMsg, 'Close', { duration: 5000 });
    } finally {
      this.isSaving.set(false);
    }
  }

  cancel() {
    this._router.navigate(['/']);
  }
}
