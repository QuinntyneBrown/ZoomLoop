import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
}

@Component({
  selector: 'zl-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() logoText = 'Clutch';
  @Input() logoInitial = 'C';
  @Input() logoHref = '/';
  @Input() navItems: NavItem[] = [];
  @Input() activeRoute = '';
  @Input() scrolled = false;
  @Input() isLoggedIn = false;
  @Input() userInitials = '';
  @Input() showAuthButtons = true;
  @Input() ctaText = 'Buy';

  @Output() signIn = new EventEmitter<void>();
  @Output() ctaClick = new EventEmitter<void>();

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

  toggleUserMenu(): void {
    // User menu logic
  }
}
