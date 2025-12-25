// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';
import {
  HeaderComponent,
  FooterComponent,
  NavItem,
  FooterColumn,
  SocialLink,
  LoginDialog,
  LoginDialogMode,
  LoginData,
  RegisterData,
  ForgotPasswordData
} from 'zoom-loop-components';
import { AuthService } from '../../services';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, LoginDialog],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private router = inject(Router);
  private authService = inject(AuthService);

  isScrolled = false;
  isLoginDialogOpen = false;
  loginDialogMode: LoginDialogMode = 'login';
  isAuthLoading = false;
  authErrorMessage = '';

  currentUser$ = this.authService.currentUser$;

  isLoggedIn$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  userInitials$ = this.currentUser$.pipe(
    map(user => {
      if (user) {
        const first = user.firstName.charAt(0).toUpperCase();
        const last = user.lastName.charAt(0).toUpperCase();
        return `${first}${last}`;
      }
      return '';
    })
  );

  userName$ = this.currentUser$.pipe(
    map(user => user?.firstName || '')
  );

  navItems: NavItem[] = [
    { label: 'Buy', href: '/cars' },
    { label: 'Sell/Trade', href: '/sell' },
    {
      label: 'Financing',
      children: [
        { label: 'Car Loan Calculator', href: '/car-loan-calculator' }
      ]
    },
    { label: 'How It Works', href: '/how-it-works' }
  ];

  footerColumns: FooterColumn[] = [
    {
      title: 'Browse',
      links: [
        { label: 'All Vehicles', href: '/cars' },
        { label: 'SUVs', href: '/cars?type=suv' },
        { label: 'Trucks', href: '/cars?type=truck' }
      ]
    },
    {
      title: 'Sell',
      links: [
        { label: 'Get an Offer', href: '/sell' },
        { label: 'Trade-In', href: '/sell' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'How It Works', href: '/how-it-works' }
      ]
    }
  ];

  socialLinks: SocialLink[] = [
    { platform: 'facebook', href: '#' },
    { platform: 'instagram', href: '#' },
    { platform: 'twitter', href: '#' }
  ];

  legalLinks = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' }
  ];

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  get activeRoute(): string {
    return this.router.url;
  }

  onSignIn(): void {
    this.isLoginDialogOpen = true;
    this.loginDialogMode = 'login';
    this.authErrorMessage = '';
  }

  onCtaClick(): void {
    this.router.navigate(['/cars']);
  }

  onNewsletterSubscribe(email: string): void {
    console.log('Newsletter:', email);
  }

  onLoginDialogClose(): void {
    this.isLoginDialogOpen = false;
    this.authErrorMessage = '';
  }

  onLoginModeChange(mode: LoginDialogMode): void {
    this.loginDialogMode = mode;
    this.authErrorMessage = '';
  }

  onLogin(data: LoginData): void {
    this.isAuthLoading = true;
    this.authErrorMessage = '';

    this.authService.login({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe
    }).subscribe({
      next: () => {
        this.isAuthLoading = false;
        this.isLoginDialogOpen = false;
      },
      error: (error) => {
        this.isAuthLoading = false;
        this.authErrorMessage = error.error?.detail || 'Invalid email or password. Please try again.';
      }
    });
  }

  onRegister(data: RegisterData): void {
    this.isAuthLoading = true;
    this.authErrorMessage = '';

    this.authService.register({
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      marketingOptIn: data.marketingOptIn
    }).subscribe({
      next: () => {
        this.isAuthLoading = false;
        this.loginDialogMode = 'login';
        this.authErrorMessage = '';
      },
      error: (error) => {
        this.isAuthLoading = false;
        this.authErrorMessage = error.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }

  onForgotPassword(data: ForgotPasswordData): void {
    this.isAuthLoading = true;
    this.authErrorMessage = '';

    this.authService.forgotPassword({ email: data.email }).subscribe({
      next: () => {
        this.isAuthLoading = false;
        this.loginDialogMode = 'login';
      },
      error: () => {
        this.isAuthLoading = false;
      }
    });
  }

  onMyProfile(): void {
    this.router.navigate(['/my-dashboard']);
  }

  onSignOut(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      }
    });
  }

  onNavigateToCreateAccount(): void {
    this.isLoginDialogOpen = false;
    this.router.navigate(['/create-account']);
  }
}
