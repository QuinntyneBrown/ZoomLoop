import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface HeaderNavItem {
  label: string;
  url: string;
  primary?: boolean;
  active?: boolean;
}

@Component({
  selector: 'zl-header',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Header {
  @Input() logoText = 'ZoomLoop';
  @Input() logoImageUrl = 'logo.svg';
  @Input() navItems: HeaderNavItem[] = [];
  
  protected menuOpen = false;

  protected toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  protected closeMenu(): void {
    this.menuOpen = false;
  }
}
