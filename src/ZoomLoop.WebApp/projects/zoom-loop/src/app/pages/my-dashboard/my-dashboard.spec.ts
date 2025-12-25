// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach, Mock, afterEach } from 'vitest';
import { BehaviorSubject, of, throwError, firstValueFrom } from 'rxjs';
import { MyDashboard } from './my-dashboard';
import { AuthService } from '../../services';
import { User } from '../../models';

describe('MyDashboard', () => {
  let component: MyDashboard;
  let fixture: ComponentFixture<MyDashboard>;
  let authServiceSpy: { currentUser$: BehaviorSubject<User | null>; getCurrentUser: Mock };
  let routerSpy: { navigate: Mock };

  const mockUserWithAdminRole: User = {
    userId: '123',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    emailVerified: true,
    phoneVerified: false,
    createdAt: '2024-01-01T00:00:00Z',
    roles: [
      { roleId: '1', name: 'Administrator' },
      { roleId: '2', name: 'User' }
    ]
  };

  const mockUserWithUserRole: User = {
    userId: '456',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    emailVerified: true,
    phoneVerified: false,
    createdAt: '2024-01-01T00:00:00Z',
    roles: [
      { roleId: '2', name: 'User' }
    ]
  };

  const mockUserWithNoRoles: User = {
    userId: '789',
    email: 'noroles@example.com',
    firstName: 'No',
    lastName: 'Roles',
    emailVerified: true,
    phoneVerified: false,
    createdAt: '2024-01-01T00:00:00Z',
    roles: []
  };

  beforeEach(async () => {
    authServiceSpy = {
      currentUser$: new BehaviorSubject<User | null>(null),
      getCurrentUser: vi.fn().mockReturnValue(of(mockUserWithUserRole))
    };

    routerSpy = {
      navigate: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [MyDashboard],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MyDashboard);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    authServiceSpy.currentUser$.complete();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('role detection via vm$', () => {
    it('should set isAdmin to true when user has Administrator role', async () => {
      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      const result = await firstValueFrom(component.vm$);
      expect(result?.isAdmin).toBe(true);
    });

    it('should set isAdmin to false when user has only User role', async () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      const result = await firstValueFrom(component.vm$);
      expect(result?.isAdmin).toBe(false);
    });

    it('should set isAdmin to false when user has no roles', async () => {
      authServiceSpy.currentUser$.next(mockUserWithNoRoles);
      const result = await firstValueFrom(component.vm$);
      expect(result?.isAdmin).toBe(false);
    });

    it('should return null when user is null', async () => {
      authServiceSpy.currentUser$.next(null);
      const result = await firstValueFrom(component.vm$);
      expect(result).toBeNull();
    });

    it('should handle case-insensitive Administrator role check', async () => {
      const userWithLowercaseAdmin: User = {
        ...mockUserWithNoRoles,
        roles: [{ roleId: '1', name: 'administrator' }]
      };
      authServiceSpy.currentUser$.next(userWithLowercaseAdmin);
      const result = await firstValueFrom(component.vm$);
      expect(result?.isAdmin).toBe(true);
    });
  });

  describe('card visibility via vm$', () => {
    it('should hide nonAdminOnly cards when user is admin', async () => {
      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      const result = await firstValueFrom(component.vm$);

      const visibleCardIds = result?.visibleCards.map((c: any) => c.id);

      expect(visibleCardIds).toContain('personal-info');
      expect(visibleCardIds).toContain('notifications');
      expect(visibleCardIds).not.toContain('my-cars');
      expect(visibleCardIds).not.toContain('my-orders');
      expect(visibleCardIds).not.toContain('rewards');
      expect(visibleCardIds).not.toContain('saved-searches');
    });

    it('should show nonAdminOnly cards when user is not admin', async () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      const result = await firstValueFrom(component.vm$);

      const visibleCardIds = result?.visibleCards.map((c: any) => c.id);

      expect(visibleCardIds).toContain('personal-info');
      expect(visibleCardIds).toContain('notifications');
      expect(visibleCardIds).toContain('my-cars');
      expect(visibleCardIds).toContain('my-orders');
      expect(visibleCardIds).toContain('rewards');
      expect(visibleCardIds).toContain('saved-searches');
    });

    it('should show all non-restricted cards when user has no roles', async () => {
      authServiceSpy.currentUser$.next(mockUserWithNoRoles);
      const result = await firstValueFrom(component.vm$);

      const visibleCardIds = result?.visibleCards.map((c: any) => c.id);

      expect(visibleCardIds).toContain('personal-info');
      expect(visibleCardIds).toContain('notifications');
      expect(visibleCardIds).toContain('my-cars');
      expect(visibleCardIds).toContain('my-orders');
      expect(visibleCardIds).toContain('rewards');
      expect(visibleCardIds).toContain('saved-searches');
    });
  });

  describe('user display via vm$', () => {
    it('should display user full name', async () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      const result = await firstValueFrom(component.vm$);

      expect(result?.userFullName).toBe('Regular User');
    });

    it('should display user email', async () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      const result = await firstValueFrom(component.vm$);

      expect(result?.userEmail).toBe('user@example.com');
    });
  });

  describe('navigation', () => {
    it('should navigate to home when user becomes null', async () => {
      authServiceSpy.currentUser$.next(null);
      await firstValueFrom(component.vm$);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('card actions', () => {
    it('should navigate to my-profile on personal-info card action', () => {
      component.onCardAction('personal-info');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/my-profile']);
    });
  });

  describe('getCurrentUser', () => {
    it('should call getCurrentUser on vm$ subscription', async () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      await firstValueFrom(component.vm$);

      expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    });

    it('should navigate to home on getCurrentUser error', async () => {
      authServiceSpy.getCurrentUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
      try {
        await firstValueFrom(component.vm$);
      } catch {
        // Expected to error
      }

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
