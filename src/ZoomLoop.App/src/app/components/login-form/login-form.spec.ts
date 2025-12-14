// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginForm } from './login-form';
import { DebugElement } from '@angular/core';

describe('LoginForm', () => {
  let component: LoginForm;
  let fixture: ComponentFixture<LoginForm>;
  let compiled: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    compiled = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the login form component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with null inputs', () => {
      expect(component.username).toBeNull();
      expect(component.password).toBeNull();
      expect(component.rememberMe).toBeNull();
    });

    it('should initialize form with null values', () => {
      expect(component.form.value.username).toBeNull();
      expect(component.form.value.password).toBeNull();
      expect(component.form.value.rememberMe).toBeNull();
    });

    it('should set form values when inputs are provided', () => {
      fixture.componentRef.setInput('username', 'testuser');
      fixture.componentRef.setInput('password', 'testpass');
      fixture.componentRef.setInput('rememberMe', true);
      
      component.ngOnInit();
      
      expect(component.form.value.username).toBe('testuser');
      expect(component.form.value.password).toBe('testpass');
      expect(component.form.value.rememberMe).toBe(true);
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when empty', () => {
      expect(component.form.valid).toBe(false);
    });

    it('should be invalid when only username is filled', () => {
      component.form.patchValue({ username: 'testuser' });
      expect(component.form.valid).toBe(false);
    });

    it('should be invalid when only password is filled', () => {
      component.form.patchValue({ password: 'testpass' });
      expect(component.form.valid).toBe(false);
    });

    it('should be valid when username and password are filled', () => {
      component.form.patchValue({
        username: 'testuser',
        password: 'testpass'
      });
      expect(component.form.valid).toBe(true);
    });

    it('should be valid when all fields are filled', () => {
      component.form.patchValue({
        username: 'testuser',
        password: 'testpass',
        rememberMe: true
      });
      expect(component.form.valid).toBe(true);
    });

    it('should require username', () => {
      const usernameControl = component.form.get('username');
      expect(usernameControl?.hasError('required')).toBe(true);
      
      usernameControl?.setValue('testuser');
      expect(usernameControl?.hasError('required')).toBe(false);
    });

    it('should require password', () => {
      const passwordControl = component.form.get('password');
      expect(passwordControl?.hasError('required')).toBe(true);
      
      passwordControl?.setValue('testpass');
      expect(passwordControl?.hasError('required')).toBe(false);
    });

    it('should not require rememberMe', () => {
      const rememberMeControl = component.form.get('rememberMe');
      expect(rememberMeControl?.hasError('required')).toBe(false);
    });
  });

  describe('Form Submission', () => {
    it('should emit tryToLogin when form is valid and submitted', () => {
      const emitSpy = vi.spyOn(component.tryToLogin, 'emit');
      
      component.form.patchValue({
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      });

      component.handleSubmit();

      expect(emitSpy).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      });
    });

    it('should not emit tryToLogin when form is invalid', () => {
      const emitSpy = vi.spyOn(component.tryToLogin, 'emit');
      
      component.form.patchValue({
        username: 'testuser'
        // password is missing
      });

      component.handleSubmit();

      expect(emitSpy).not.toHaveBeenCalled();
    });

    it('should emit with rememberMe true when checkbox is checked', () => {
      const emitSpy = vi.spyOn(component.tryToLogin, 'emit');
      
      component.form.patchValue({
        username: 'testuser',
        password: 'testpass',
        rememberMe: true
      });

      component.handleSubmit();

      expect(emitSpy).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass',
        rememberMe: true
      });
    });
  });
});
