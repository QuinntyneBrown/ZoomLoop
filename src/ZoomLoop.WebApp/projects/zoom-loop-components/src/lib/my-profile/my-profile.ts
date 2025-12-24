import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  imports: [CommonModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.scss'
})
export class MyProfile implements OnInit, OnChanges {
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

  profileForm!: FormGroup;
  avatarError = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile'] && this.profileForm) {
      this.updateFormValues();
    }
    if (changes['readonly'] && this.profileForm) {
      this.toggleReadonly();
    }
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      firstName: [
        this.profile.firstName,
        [Validators.required, Validators.minLength(2)]
      ],
      lastName: [
        this.profile.lastName,
        [Validators.required, Validators.minLength(2)]
      ],
      email: [
        this.profile.email,
        [Validators.required, Validators.email]
      ],
      phone: [
        this.profile.phone,
        [this.phoneValidator.bind(this)]
      ],
      bio: [this.profile.bio, [Validators.maxLength(500)]]
    });

    if (this.readonly) {
      this.profileForm.disable();
    }
  }

  private updateFormValues(): void {
    this.profileForm.patchValue({
      firstName: this.profile.firstName,
      lastName: this.profile.lastName,
      email: this.profile.email,
      phone: this.profile.phone,
      bio: this.profile.bio
    }, { emitEvent: false });
  }

  private toggleReadonly(): void {
    if (this.readonly) {
      this.profileForm.disable();
    } else {
      this.profileForm.enable();
    }
  }

  private phoneValidator(control: any): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    const digitsOnly = control.value.replace(/\D/g, '');
    if (!phoneRegex.test(control.value) || digitsOnly.length < 10) {
      return { invalidPhone: true };
    }
    return null;
  }

  getFieldState(fieldName: string): 'default' | 'error' | 'success' {
    const field = this.profileForm.get(fieldName);
    if (!field) return 'default';

    if (!field.touched && !field.dirty) return 'default';
    return field.invalid ? 'error' : 'success';
  }

  getFieldError(fieldName: string): string {
    const field = this.profileForm.get(fieldName);
    if (!field || !field.errors || (!field.touched && !field.dirty)) {
      return '';
    }

    if (field.errors['required']) {
      const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
      return `${label} is required`;
    }
    if (field.errors['minlength']) {
      return `Must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors['maxlength']) {
      return `Must not exceed ${field.errors['maxlength'].requiredLength} characters`;
    }
    if (field.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (field.errors['invalidPhone']) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  onAvatarFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.avatarError = 'Please select an image file';
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.avatarError = 'Image size must be less than 5MB';
        return;
      }

      this.avatarError = '';

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
    // Mark all fields as touched to show validation errors
    Object.keys(this.profileForm.controls).forEach(key => {
      this.profileForm.get(key)?.markAsTouched();
    });

    if (this.profileForm.valid && !this.loading) {
      const updatedProfile: UserProfile = {
        ...this.profile,
        ...this.profileForm.value
      };
      this.profileUpdate.emit(updatedProfile);
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
    const firstName = this.profileForm.get('firstName')?.value || this.profile.firstName || '';
    const lastName = this.profileForm.get('lastName')?.value || this.profile.lastName || '';
    const first = firstName.charAt(0) || '';
    const last = lastName.charAt(0) || '';
    return (first + last).toUpperCase();
  }

  get bioCharacterCount(): number {
    return this.profileForm.get('bio')?.value?.length || 0;
  }
}
