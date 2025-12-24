// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginDialogContent, LoginDialogContentData, LoginDialogResult } from './login-dialog-content';

describe('LoginDialogContent', () => {
  let component: LoginDialogContent;
  let fixture: ComponentFixture<LoginDialogContent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<LoginDialogContent, LoginDialogResult>>;

  const defaultData: LoginDialogContentData = {
    mode: 'login',
    isLoading: false,
    errorMessage: ''
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [LoginDialogContent, NoopAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: defaultData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialogContent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should use default mode from data', () => {
      expect(component.mode).toBe('login');
    });

    it('should use default isLoading from data', () => {
      expect(component.isLoading).toBe(false);
    });

    it('should use default errorMessage from data', () => {
      expect(component.errorMessage).toBe('');
    });
  });

  describe('modalTitle', () => {
    it('should return "Sign In" for login mode', () => {
      component.mode = 'login';
      expect(component.modalTitle).toBe('Sign In');
    });

    it('should return "Create Account" for register mode', () => {
      component.mode = 'register';
      expect(component.modalTitle).toBe('Create Account');
    });

    it('should return "Reset Password" for forgot-password mode', () => {
      component.mode = 'forgot-password';
      expect(component.modalTitle).toBe('Reset Password');
    });
  });

  describe('validation', () => {
    describe('isLoginValid', () => {
      it('should return false when email is empty', () => {
        component.loginData = { email: '', password: 'password', rememberMe: false };
        expect(component.isLoginValid).toBe(false);
      });

      it('should return false when password is empty', () => {
        component.loginData = { email: 'test@example.com', password: '', rememberMe: false };
        expect(component.isLoginValid).toBe(false);
      });

      it('should return true when both email and password are provided', () => {
        component.loginData = { email: 'test@example.com', password: 'password', rememberMe: false };
        expect(component.isLoginValid).toBe(true);
      });
    });

    describe('isRegisterValid', () => {
      const validRegisterData = {
        email: 'test@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        marketingOptIn: false
      };

      it('should return false when email is empty', () => {
        component.registerData = { ...validRegisterData, email: '' };
        expect(component.isRegisterValid).toBe(false);
      });

      it('should return false when password is less than 8 characters', () => {
        component.registerData = { ...validRegisterData, password: 'Pass1', confirmPassword: 'Pass1' };
        expect(component.isRegisterValid).toBe(false);
      });

      it('should return false when passwords do not match', () => {
        component.registerData = { ...validRegisterData, confirmPassword: 'Different1' };
        expect(component.isRegisterValid).toBe(false);
      });

      it('should return false when firstName is empty', () => {
        component.registerData = { ...validRegisterData, firstName: '' };
        expect(component.isRegisterValid).toBe(false);
      });

      it('should return false when lastName is empty', () => {
        component.registerData = { ...validRegisterData, lastName: '' };
        expect(component.isRegisterValid).toBe(false);
      });

      it('should return true when all fields are valid', () => {
        component.registerData = validRegisterData;
        expect(component.isRegisterValid).toBe(true);
      });
    });

    describe('isForgotPasswordValid', () => {
      it('should return false when email is empty', () => {
        component.forgotPasswordData = { email: '' };
        expect(component.isForgotPasswordValid).toBe(false);
      });

      it('should return true when email is provided', () => {
        component.forgotPasswordData = { email: 'test@example.com' };
        expect(component.isForgotPasswordValid).toBe(true);
      });
    });

    describe('isPasswordValid', () => {
      it('should return false for password less than 8 characters', () => {
        expect(component.isPasswordValid('Pass1')).toBe(false);
      });

      it('should return false for password without uppercase', () => {
        expect(component.isPasswordValid('password1')).toBe(false);
      });

      it('should return false for password without number', () => {
        expect(component.isPasswordValid('Password')).toBe(false);
      });

      it('should return true for valid password', () => {
        expect(component.isPasswordValid('Password1')).toBe(true);
      });
    });
  });

  describe('password strength', () => {
    it('should return empty string for empty password', () => {
      component.registerData.password = '';
      expect(component.getPasswordStrength()).toBe('');
    });

    it('should return "Too short" for password less than 8 characters', () => {
      component.registerData.password = 'Pass1';
      expect(component.getPasswordStrength()).toBe('Too short');
    });

    it('should return "Weak" for password without requirements', () => {
      component.registerData.password = 'password';
      expect(component.getPasswordStrength()).toBe('Weak');
    });

    it('should return "Good" for valid 8-11 character password', () => {
      component.registerData.password = 'Password1';
      expect(component.getPasswordStrength()).toBe('Good');
    });

    it('should return "Strong" for valid 12+ character password', () => {
      component.registerData.password = 'Password1234';
      expect(component.getPasswordStrength()).toBe('Strong');
    });
  });

  describe('actions', () => {
    it('should close dialog with cancelled action on onClose', () => {
      component.onClose();
      expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: 'cancelled' });
    });

    it('should close dialog with login data on onLogin when valid', () => {
      component.loginData = { email: 'test@example.com', password: 'password', rememberMe: true };
      component.isLoading = false;
      component.onLogin();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'login',
        loginData: { email: 'test@example.com', password: 'password', rememberMe: true }
      });
    });

    it('should not close dialog on onLogin when invalid', () => {
      component.loginData = { email: '', password: '', rememberMe: false };
      component.onLogin();

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should not close dialog on onLogin when loading', () => {
      component.loginData = { email: 'test@example.com', password: 'password', rememberMe: false };
      component.isLoading = true;
      component.onLogin();

      expect(dialogRefSpy.close).not.toHaveBeenCalled();
    });

    it('should close dialog with register data on onRegister when valid', () => {
      component.registerData = {
        email: 'test@example.com',
        password: 'Password1',
        confirmPassword: 'Password1',
        firstName: 'John',
        lastName: 'Doe',
        phone: '',
        marketingOptIn: true
      };
      component.isLoading = false;
      component.onRegister();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'register',
        registerData: component.registerData
      });
    });

    it('should close dialog with forgot password data on onForgotPassword when valid', () => {
      component.forgotPasswordData = { email: 'test@example.com' };
      component.isLoading = false;
      component.onForgotPassword();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        action: 'forgot-password',
        forgotPasswordData: { email: 'test@example.com' }
      });
    });

    it('should close dialog with navigate-create-account action', () => {
      component.onNavigateToCreateAccount();

      expect(dialogRefSpy.close).toHaveBeenCalledWith({ action: 'navigate-create-account' });
    });
  });

  describe('mode switching', () => {
    it('should switch mode and clear error message', () => {
      component.errorMessage = 'Some error';
      component.switchMode('register');

      expect(component.mode).toBe('register');
      expect(component.errorMessage).toBe('');
    });
  });

  describe('password visibility', () => {
    it('should toggle password visibility', () => {
      expect(component.showPassword).toBe(false);
      component.togglePasswordVisibility();
      expect(component.showPassword).toBe(true);
      component.togglePasswordVisibility();
      expect(component.showPassword).toBe(false);
    });

    it('should toggle confirm password visibility', () => {
      expect(component.showConfirmPassword).toBe(false);
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBe(true);
      component.toggleConfirmPasswordVisibility();
      expect(component.showConfirmPassword).toBe(false);
    });
  });
});
