// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap, tap, catchError } from 'rxjs/operators';
import { AuthService } from '../../services';
import { User } from '../../models';

interface DashboardCard {
  id: string;
  title: string;
  icon: string;
  description: string;
  actionLabel: string;
  adminOnly?: boolean;
  nonAdminOnly?: boolean;
}

interface DashboardViewModel {
  currentUser: User;
  isAdmin: boolean;
  visibleCards: DashboardCard[];
  userFullName: string;
  userEmail: string;
}

const DASHBOARD_CARDS: DashboardCard[] = [
  {
    id: 'personal-info',
    title: 'Personal Info',
    icon: 'person',
    description: 'Manage your personal information and profile settings',
    actionLabel: 'Edit Profile'
  },
  {
    id: 'my-cars',
    title: 'My Cars',
    icon: 'directions_car',
    description: 'View and manage your saved and purchased vehicles',
    actionLabel: 'View Cars',
    nonAdminOnly: true
  },
  {
    id: 'my-orders',
    title: 'My Orders',
    icon: 'receipt_long',
    description: 'Track your orders and view purchase history',
    actionLabel: 'View Orders',
    nonAdminOnly: true
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'notifications',
    description: 'Manage your notification preferences',
    actionLabel: 'Manage'
  },
  {
    id: 'rewards',
    title: 'Rewards',
    icon: 'star',
    description: 'View your loyalty points and rewards',
    actionLabel: 'View Rewards',
    nonAdminOnly: true
  },
  {
    id: 'saved-searches',
    title: 'Saved Searches',
    icon: 'bookmark',
    description: 'Access your saved vehicle searches',
    actionLabel: 'View Searches',
    nonAdminOnly: true
  }
];

@Component({
  selector: 'app-my-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './my-dashboard.html',
  styleUrl: './my-dashboard.scss'
})
export class MyDashboard {
  private router = inject(Router);
  private authService = inject(AuthService);

  vm$: Observable<DashboardViewModel | null> = this.authService.getCurrentUser().pipe(
    switchMap(() => this.authService.currentUser$),
    tap(user => {
      if (!user) {
        this.router.navigate(['/']);
      }
    }),
    map(user => user ? this.createViewModel(user) : null),
    shareReplay(1),
    catchError(() => {
      this.router.navigate(['/']);
      return of(null);
    })
  );

  isLoading$ = this.vm$.pipe(
    map(vm => vm === undefined),
    startWith(true)
  );

  private createViewModel(user: User): DashboardViewModel {
    const isAdmin = this.checkIfAdmin(user);
    return {
      currentUser: user,
      isAdmin,
      visibleCards: this.getVisibleCards(isAdmin),
      userFullName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email
    };
  }

  private checkIfAdmin(user: User): boolean {
    if (!user.roles) {
      return false;
    }
    return user.roles.some(role => role.name.toLowerCase() === 'administrator');
  }

  private getVisibleCards(isAdmin: boolean): DashboardCard[] {
    return DASHBOARD_CARDS.filter(card => {
      if (card.adminOnly && !isAdmin) return false;
      if (card.nonAdminOnly && isAdmin) return false;
      return true;
    });
  }

  onCardAction(cardId: string): void {
    switch (cardId) {
      case 'personal-info':
        this.router.navigate(['/my-profile']);
        break;
      case 'my-cars':
        // Navigate to my cars
        break;
      case 'my-orders':
        // Navigate to orders
        break;
      case 'notifications':
        // Navigate to notifications settings
        break;
      case 'rewards':
        // Navigate to rewards
        break;
      case 'saved-searches':
        // Navigate to saved searches
        break;
    }
  }
}
