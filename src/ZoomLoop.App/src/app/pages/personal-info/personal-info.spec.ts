// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonalInfo } from './personal-info';
import { ProfileService } from '../../core/profile.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Profile } from '../../models';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

describe('PersonalInfo', () => {
  let component: PersonalInfo;
  let fixture: ComponentFixture<PersonalInfo>;
  let mockProfileService: any;
  let mockRouter: any;
  let mockSnackBar: any;

  const mockProfile: Profile = {
    profileImageUrl: 'https://example.com/photo.jpg',
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '555-1234',
    dateOfBirth: new Date('1990-01-01'),
    homeAddress: {
      address1: '123 Main St',
      address2: 'Apt 4B',
      city: 'New York',
      province: 'NY',
      postalCode: '10001'
    }
  };

  beforeEach(async () => {
    mockProfileService = {
      getCurrentProfile: vi.fn().mockReturnValue(of(mockProfile)),
      updateProfile: vi.fn().mockReturnValue(of(mockProfile))
    };

    mockRouter = {
      navigate: vi.fn()
    };

    mockSnackBar = {
      open: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [PersonalInfo],
      providers: [
        provideNoopAnimations(),
        { provide: ProfileService, useValue: mockProfileService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfo);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create the personal info component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form on ngOnInit', () => {
      fixture.detectChanges();
      expect(component.form).toBeDefined();
      expect(component.form.get('profileImageUrl')).toBeDefined();
      expect(component.form.get('firstName')).toBeDefined();
      expect(component.form.get('lastName')).toBeDefined();
      expect(component.form.get('phoneNumber')).toBeDefined();
      expect(component.form.get('dateOfBirth')).toBeDefined();
      expect(component.form.get('homeAddress')).toBeDefined();
    });

    it('should load profile on initialization', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(mockProfileService.getCurrentProfile).toHaveBeenCalled();
      expect(component.form.value.firstName).toBe('John');
      expect(component.form.value.lastName).toBe('Doe');
      expect(component.form.value.phoneNumber).toBe('555-1234');
    });

    it('should populate address fields from profile', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const address = component.form.value.homeAddress;
      expect(address.address1).toBe('123 Main St');
      expect(address.city).toBe('New York');
      expect(address.postalCode).toBe('10001');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should require firstName', () => {
      const firstNameControl = component.form.get('firstName');
      firstNameControl?.setValue('');
      expect(firstNameControl?.hasError('required')).toBe(true);

      firstNameControl?.setValue('John');
      expect(firstNameControl?.hasError('required')).toBe(false);
    });

    it('should require lastName', () => {
      const lastNameControl = component.form.get('lastName');
      lastNameControl?.setValue('');
      expect(lastNameControl?.hasError('required')).toBe(true);

      lastNameControl?.setValue('Doe');
      expect(lastNameControl?.hasError('required')).toBe(false);
    });

    it('should require phoneNumber', () => {
      const phoneControl = component.form.get('phoneNumber');
      phoneControl?.setValue('');
      expect(phoneControl?.hasError('required')).toBe(true);

      phoneControl?.setValue('555-1234');
      expect(phoneControl?.hasError('required')).toBe(false);
    });

    it('should require dateOfBirth', () => {
      const dobControl = component.form.get('dateOfBirth');
      dobControl?.setValue('');
      expect(dobControl?.hasError('required')).toBe(true);

      dobControl?.setValue('1990-01-01');
      expect(dobControl?.hasError('required')).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(async () => {
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should not submit when form is invalid', async () => {
      component.form.patchValue({ firstName: '' });
      await component.onSubmit();

      expect(mockProfileService.updateProfile).not.toHaveBeenCalled();
    });

    it('should mark all fields as touched when submitting invalid form', async () => {
      component.form.patchValue({ firstName: '' });
      await component.onSubmit();

      expect(component.form.get('firstName')?.touched).toBe(true);
    });

    it('should submit when form is valid', async () => {
      component.form.patchValue({
        profileImageUrl: 'https://example.com/new-photo.jpg',
        firstName: 'Jane',
        lastName: 'Smith',
        phoneNumber: '555-5678',
        dateOfBirth: new Date('1995-05-05'),
        homeAddress: {
          address1: '456 Oak Ave',
          address2: '',
          city: 'Boston',
          province: 'MA',
          postalCode: '02101'
        }
      });

      await component.onSubmit();

      expect(mockProfileService.updateProfile).toHaveBeenCalled();
    });

    it('should set isSaving to true during save', async () => {
      const submitPromise = component.onSubmit();
      expect(component.isSaving()).toBe(true);

      await submitPromise;
      expect(component.isSaving()).toBe(false);
    });
  });

  describe('Cancel', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should navigate to home when cancel is clicked', () => {
      component.cancel();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
