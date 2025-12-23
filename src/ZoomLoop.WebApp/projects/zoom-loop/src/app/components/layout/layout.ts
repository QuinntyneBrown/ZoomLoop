import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import {
  HeaderComponent,
  FooterComponent,
  NavItem,
  FooterColumn,
  SocialLink
} from 'zoom-loop-components';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout {
  private router = inject(Router);

  isScrolled = false;

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

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 50;
  }

  get activeRoute(): string {
    return this.router.url;
  }

  onSignIn(): void {
    console.log('Sign in clicked');
  }

  onCtaClick(): void {
    this.router.navigate(['/cars']);
  }

  onNewsletterSubscribe(email: string): void {
    console.log('Newsletter:', email);
  }
}
