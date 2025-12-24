// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { vi, describe, it, expect, beforeEach, Mock, afterEach } from 'vitest';
import { BehaviorSubject, of, throwError } from 'rxjs';
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
      { roleId: '1', name: 'Admin' },
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

  describe('role detection', () => {
    it('should set isAdmin to true when user has Admin role', () => {
      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      component.ngOnInit();
      expect(component.isAdmin).toBe(true);
    });

    it('should set isAdmin to false when user has only User role', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();
      expect(component.isAdmin).toBe(false);
    });

    it('should set isAdmin to false when user has no roles', () => {
      authServiceSpy.currentUser$.next(mockUserWithNoRoles);
      component.ngOnInit();
      expect(component.isAdmin).toBe(false);
    });

    it('should set isAdmin to false when user is null', () => {
      authServiceSpy.currentUser$.next(null);
      component.ngOnInit();
      expect(component.isAdmin).toBe(false);
    });

    it('should handle case-insensitive Admin role check', () => {
      const userWithLowercaseAdmin: User = {
        ...mockUserWithNoRoles,
        roles: [{ roleId: '1', name: 'admin' }]
      };
      authServiceSpy.currentUser$.next(userWithLowercaseAdmin);
      component.ngOnInit();
      expect(component.isAdmin).toBe(true);
    });

    it('should handle ADMIN role in uppercase', () => {
      const userWithUppercaseAdmin: User = {
        ...mockUserWithNoRoles,
        roles: [{ roleId: '1', name: 'ADMIN' }]
      };
      authServiceSpy.currentUser$.next(userWithUppercaseAdmin);
      component.ngOnInit();
      expect(component.isAdmin).toBe(true);
    });
  });

  describe('card visibility', () => {
    it('should hide nonAdminOnly cards when user is admin', () => {
      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      component.ngOnInit();

      const visibleCardIds = component.visibleCards.map(c => c.id);

      expect(visibleCardIds).toContain('personal-info');
      expect(visibleCardIds).toContain('notifications');
      expect(visibleCardIds).not.toContain('my-cars');
      expect(visibleCardIds).not.toContain('my-orders');
      expect(visibleCardIds).not.toContain('rewards');
      expect(visibleCardIds).not.toContain('saved-searches');
    });

    it('should show nonAdminOnly cards when user is not admin', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();

      const visibleCardIds = component.visibleCards.map(c => c.id);

      expect(visibleCardIds).toContain('personal-info');
      expect(visibleCardIds).toContain('notifications');
      expect(visibleCardIds).toContain('my-cars');
      expect(visibleCardIds).toContain('my-orders');
      expect(visibleCardIds).toContain('rewards');
      expect(visibleCardIds).toContain('saved-searches');
    });

    it('should show all non-restricted cards when user has no roles', () => {
      authServiceSpy.currentUser$.next(mockUserWithNoRoles);
      component.ngOnInit();

      const visibleCardIds = component.visibleCards.map(c => c.id);

      expect(visibleCardIds).toContain('personal-info');
      expect(visibleCardIds).toContain('notifications');
      expect(visibleCardIds).toContain('my-cars');
      expect(visibleCardIds).toContain('my-orders');
      expect(visibleCardIds).toContain('rewards');
      expect(visibleCardIds).toContain('saved-searches');
    });
  });

  describe('user display', () => {
    it('should display user full name', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();

      expect(component.userFullName).toBe('Regular User');
    });

    it('should display user email', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();

      expect(component.userEmail).toBe('user@example.com');
    });

    it('should return empty string for full name when no user', () => {
      authServiceSpy.currentUser$.next(null);
      component.ngOnInit();

      expect(component.userFullName).toBe('');
    });

    it('should return empty string for email when no user', () => {
      authServiceSpy.currentUser$.next(null);
      component.ngOnInit();

      expect(component.userEmail).toBe('');
    });
  });

  describe('navigation', () => {
    it('should navigate to home when user becomes null', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();

      authServiceSpy.currentUser$.next(null);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('role updates', () => {
    it('should update isAdmin when user roles change', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();
      expect(component.isAdmin).toBe(false);

      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      expect(component.isAdmin).toBe(true);
    });

    it('should update visible cards when roles change', () => {
      authServiceSpy.currentUser$.next(mockUserWithUserRole);
      component.ngOnInit();
      expect(component.visibleCards.map(c => c.id)).toContain('my-cars');

      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      expect(component.visibleCards.map(c => c.id)).not.toContain('my-cars');
    });
  });

  describe('cleanup', () => {
    it('should unsubscribe on destroy', () => {
      component.ngOnInit();
      const unsubscribeSpy = vi.spyOn(component['authSubscription']!, 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('loading state', () => {
    it('should start with isLoading true', () => {
      expect(component.isLoading).toBe(true);
    });

    it('should set isLoading to false after getCurrentUser succeeds', () => {
      authServiceSpy.getCurrentUser.mockReturnValue(of(mockUserWithUserRole));
      component.ngOnInit();

      expect(component.isLoading).toBe(false);
    });

    it('should set isLoading to false and navigate on getCurrentUser error', () => {
      authServiceSpy.getCurrentUser.mockReturnValue(throwError(() => new Error('Unauthorized')));
      component.ngOnInit();

      expect(component.isLoading).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should call getCurrentUser on init', () => {
      component.ngOnInit();

      expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    });
  });

  describe('HTTP-driven role updates', () => {
    it('should fetch fresh user data from backend on init', () => {
      authServiceSpy.getCurrentUser.mockReturnValue(of(mockUserWithAdminRole));
      authServiceSpy.currentUser$.next(mockUserWithAdminRole);
      component.ngOnInit();

      expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
      expect(component.isAdmin).toBe(true);
    });
  });
});
