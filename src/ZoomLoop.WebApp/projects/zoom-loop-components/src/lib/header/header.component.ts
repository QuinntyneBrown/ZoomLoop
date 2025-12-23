import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

@Component({
  selector: 'zl-header',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() logoText = 'ZoomLoop';
  @Input() logoInitial = 'Z';
  @Input() logoHref = '/';
  @Input() navItems: NavItem[] = [];
  @Input() activeRoute = '';
  @Input() scrolled = false;
  @Input() isLoggedIn = false;
  @Input() userInitials = '';
  @Input() userName = '';
  @Input() showAuthButtons = true;
  @Input() ctaText = 'Buy';

  @Output() signIn = new EventEmitter<void>();
  @Output() ctaClick = new EventEmitter<void>();
  @Output() myProfileClick = new EventEmitter<void>();
  @Output() signOutClick = new EventEmitter<void>();

  isMobileMenuOpen = false;
  openDropdown: string | null = null;

  isActive(href?: string): boolean {
    return href === this.activeRoute;
  }

  toggleDropdown(label: string): void {
    this.openDropdown = this.openDropdown === label ? null : label;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  onMyProfile(): void {
    this.myProfileClick.emit();
  }

  onSignOut(): void {
    this.signOutClick.emit();
  }
}
