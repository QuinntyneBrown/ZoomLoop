// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
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
export class MyDashboard implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authSubscription?: Subscription;

  currentUser: User | null = null;
  isAdmin = false;
  isLoading = true;

  dashboardCards: DashboardCard[] = [
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

  ngOnInit(): void {
    // Subscribe to user updates
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAdmin = this.checkIfAdmin(user);
      if (!user) {
        this.router.navigate(['/']);
      }
    });

    // Fetch current user from backend to get latest roles
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.router.navigate(['/']);
      }
    });
  }

  private checkIfAdmin(user: User | null): boolean {
    if (!user || !user.roles) {
      return false;
    }
    return user.roles.some(role => role.name.toLowerCase() === 'Administrator'.toLowerCase());
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  get visibleCards(): DashboardCard[] {
    return this.dashboardCards.filter(card => {
      if (card.adminOnly && !this.isAdmin) return false;
      if (card.nonAdminOnly && this.isAdmin) return false;
      return true;
    });
  }

  get userFullName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    }
    return '';
  }

  get userEmail(): string {
    return this.currentUser?.email || '';
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
