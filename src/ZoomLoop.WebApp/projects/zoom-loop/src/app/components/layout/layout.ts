import { Component, inject, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
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
import { User } from '../../models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, LoginDialog],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit, OnDestroy {
  private router = inject(Router);
  private authService = inject(AuthService);
  private authSubscription?: Subscription;

  isScrolled = false;
  isLoggedIn = false;
  currentUser: User | null = null;
  isLoginDialogOpen = false;
  loginDialogMode: LoginDialogMode = 'login';
  isAuthLoading = false;
  authErrorMessage = '';

  navItems: NavItem[] = [
    { label: 'Buy', href: '/cars' },
    { label: 'Sell/Trade', href: '/sell' },
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

  get userInitials(): string {
    if (this.currentUser) {
      const first = this.currentUser.firstName.charAt(0).toUpperCase();
      const last = this.currentUser.lastName.charAt(0).toUpperCase();
      return `${first}${last}`;
    }
    return '';
  }

  get userName(): string {
    return this.currentUser?.firstName || '';
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

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
}
