// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginDialog } from './login-dialog';
import { AuthService } from '../../core/auth.service';
import { LocalStorageService } from '../../core/local-storage.service';
import { DialogRef } from '@angular/cdk/dialog';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginDialog', () => {
  let component: LoginDialog;
  let fixture: ComponentFixture<LoginDialog>;
  let authService: AuthService;
  let localStorageService: LocalStorageService;
  let dialogRef: DialogRef;

  beforeEach(async () => {
    const dialogRefMock = {
      close: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LoginDialog],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        LocalStorageService,
        { provide: DialogRef, useValue: dialogRefMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginDialog);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    localStorageService = TestBed.inject(LocalStorageService);
    dialogRef = TestBed.inject(DialogRef);
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create the login dialog component', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Dialog State', () => {
    it('should close dialog when close() is called', () => {
      component.close();
      expect(dialogRef.close).toHaveBeenCalled();
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

      const loginData = {
        username: 'testuser',
        password: 'testpass',
        rememberMe: false
      };

      component.handleTryToLogin(loginData);

      // Use setTimeout in a promise to wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should keep dialog open on login error', async () => {
      vi.spyOn(authService, 'tryToLogin').mockReturnValue(throwError(() => new Error('Login failed')));
      vi.spyOn(localStorageService, 'put');
      const closeSpy = dialogRef.close as any;
      closeSpy.mockClear();

      const loginData = {
        username: 'testuser',
        password: 'wrongpass',
        rememberMe: false
      };

      component.handleTryToLogin(loginData);

      // Use setTimeout in a promise to wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(dialogRef.close).not.toHaveBeenCalled();
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
