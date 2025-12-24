import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../input/input.component';
import { ButtonComponent } from '../button/button.component';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

@Component({
  selector: 'zl-my-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, InputComponent, ButtonComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent {
  @Input() profile: UserProfile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    avatarUrl: ''
  };

  @Input() loading = false;
  @Input() readonly = false;
  @Input() showAvatar = true;
  @Input() showBio = true;
  @Input() compact = false;

  @Output() profileUpdate = new EventEmitter<UserProfile>();
  @Output() cancel = new EventEmitter<void>();
  @Output() avatarChange = new EventEmitter<File>();

  errors: { [key: string]: string } = {};
  touched: { [key: string]: boolean } = {};

  get isValid(): boolean {
    return this.validateForm();
  }

  get hasChanges(): boolean {
    return true; // In a real app, you'd compare with original profile
  }

  onFieldChange(field: keyof UserProfile, value: string): void {
    this.profile = {
      ...this.profile,
      [field]: value
    };
    this.touched[field] = true;
    this.validateField(field);
  }

  onFieldBlur(field: keyof UserProfile): void {
    this.touched[field] = true;
    this.validateField(field);
  }

  validateField(field: keyof UserProfile): void {
    switch (field) {
      case 'firstName':
        if (!this.profile.firstName?.trim()) {
          this.errors['firstName'] = 'First name is required';
        } else if (this.profile.firstName.length < 2) {
          this.errors['firstName'] = 'First name must be at least 2 characters';
        } else {
          delete this.errors['firstName'];
        }
        break;

      case 'lastName':
        if (!this.profile.lastName?.trim()) {
          this.errors['lastName'] = 'Last name is required';
        } else if (this.profile.lastName.length < 2) {
          this.errors['lastName'] = 'Last name must be at least 2 characters';
        } else {
          delete this.errors['lastName'];
        }
        break;

      case 'email':
        if (!this.profile.email?.trim()) {
          this.errors['email'] = 'Email is required';
        } else if (!this.isValidEmail(this.profile.email)) {
          this.errors['email'] = 'Please enter a valid email address';
        } else {
          delete this.errors['email'];
        }
        break;

      case 'phone':
        if (this.profile.phone && !this.isValidPhone(this.profile.phone)) {
          this.errors['phone'] = 'Please enter a valid phone number';
        } else {
          delete this.errors['phone'];
        }
        break;
    }
  }

  validateForm(): boolean {
    this.validateField('firstName');
    this.validateField('lastName');
    this.validateField('email');
    this.validateField('phone');
    return Object.keys(this.errors).length === 0;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  }

  getFieldState(field: keyof UserProfile): 'default' | 'error' | 'success' {
    if (!this.touched[field]) return 'default';
    return this.errors[field] ? 'error' : 'success';
  }

  onAvatarFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errors['avatar'] = 'Please select an image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errors['avatar'] = 'Image size must be less than 5MB';
        return;
      }

      delete this.errors['avatar'];

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.profile.avatarUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      this.avatarChange.emit(file);
    }
  }

  onSubmit(): void {
    // Mark all fields as touched
    Object.keys(this.profile).forEach(key => {
      this.touched[key] = true;
      this.validateField(key as keyof UserProfile);
    });

    if (this.isValid && !this.loading) {
      this.profileUpdate.emit(this.profile);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    fileInput?.click();
  }

  getInitials(): string {
    const first = this.profile.firstName?.charAt(0) || '';
    const last = this.profile.lastName?.charAt(0) || '';
    return (first + last).toUpperCase();
  }
}
