import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface NavItem {
  label: string;
  url: string;
  primary?: boolean;
  active?: boolean;
}

@Component({
  selector: 'zl-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  @Input() logoText = '';
  @Input() logoImageUrl = '';
  @Input() navItems: NavItem[] = [];
  
  protected menuOpen = false;

  protected toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  protected closeMenu(): void {
    this.menuOpen = false;
  }
}
