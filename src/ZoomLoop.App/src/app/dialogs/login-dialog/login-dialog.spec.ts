// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginDialog } from './login-dialog';
import { AuthService } from '../../core/auth.service';
import { LocalStorageService } from '../../core/local-storage.service';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginDialog', () => {
  let component: LoginDialog;
  let fixture: ComponentFixture<LoginDialog>;
  let authService: AuthService;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        LocalStorageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialog);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    localStorageService = TestBed.inject(LocalStorageService);
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the login dialog component', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with dialog closed', () => {
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Dialog State', () => {
    it('should open dialog when open() is called', () => {
      component.open();
      expect(component.isOpen()).toBe(true);
    });

    it('should close dialog when close() is called', () => {
      component.open();
      expect(component.isOpen()).toBe(true);
      
      component.close();
      expect(component.isOpen()).toBe(false);
    });

    it('should close dialog on backdrop click', () => {
      component.open();
      expect(component.isOpen()).toBe(true);

      const event = new MouseEvent('click');
      Object.defineProperty(event, 'target', { value: event.currentTarget, writable: false });
      
      component.handleBackdropClick(event);
      expect(component.isOpen()).toBe(false);
    });

    it('should not close dialog when clicking inside dialog', () => {
      component.open();
      expect(component.isOpen()).toBe(true);

      const event = new MouseEvent('click');
      const backdrop = document.createElement('div');
      const dialog = document.createElement('div');
      Object.defineProperty(event, 'target', { value: dialog, writable: false });
      Object.defineProperty(event, 'currentTarget', { value: backdrop, writable: false });
      
      component.handleBackdropClick(event);
      expect(component.isOpen()).toBe(true);
    });
  });

  describe('Login Flow', () => {
    it('should call authService.tryToLogin when handleTryToLogin is called', () => {
      const tryToLoginSpy = vi.spyOn(authService, 'tryToLogin').mockReturnValue(of({}));
      const localStoragePutSpy = vi.spyOn(localStorageService, 'put');

      const loginData = {
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      };

      component.handleTryToLogin(loginData);

      expect(tryToLoginSpy).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'testpass'
      });
    });

    it('should store credentials in localStorage when rememberMe is true', () => {
      vi.spyOn(authService, 'tryToLogin').mockReturnValue(of({}));
      const localStoragePutSpy = vi.spyOn(localStorageService, 'put');

      const loginData = {
        username: 'testuser',
        password: 'testpass',
        rememberMe: true
      };

      component.handleTryToLogin(loginData);

      expect(localStoragePutSpy).toHaveBeenCalledWith({
        name: 'zoomloop:loginCredentialsKey',
        value: loginData
      });
    });

    it('should not store credentials when rememberMe is false', () => {
      vi.spyOn(authService, 'tryToLogin').mockReturnValue(of({}));
      const localStoragePutSpy = vi.spyOn(localStorageService, 'put');

      const loginData = {
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      };

      component.handleTryToLogin(loginData);

      expect(localStoragePutSpy).toHaveBeenCalledWith({
        name: 'zoomloop:loginCredentialsKey',
        value: null
      });
    });

    it('should close dialog after successful login', async () => {
      vi.spyOn(authService, 'tryToLogin').mockReturnValue(of({}));
      vi.spyOn(localStorageService, 'put');

      component.open();
      expect(component.isOpen()).toBe(true);

      const loginData = {
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      };

      component.handleTryToLogin(loginData);

      // Use setTimeout in a promise to wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(component.isOpen()).toBe(false);
    });
  });

  describe('Cleanup', () => {
    it('should complete destroyed$ on ngOnDestroy', () => {
      const destroyedSpy = vi.spyOn(component['_destroyed$'], 'complete');
      
      component.ngOnDestroy();
      
      expect(destroyedSpy).toHaveBeenCalled();
    });
  });
});
