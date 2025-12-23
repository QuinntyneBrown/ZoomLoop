import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
export type BadgeSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'zl-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'primary';
  @Input() size: BadgeSize = 'md';
  @Input() pill = false;
  @Input() count = false;
  @Input() showDot = false;
  @Input() removable = false;
  @Input() removeLabel = 'filter';
  @Input() role: 'status' | null = null;
  @Input() ariaLabel: string | null = null;

  @Output() remove = new EventEmitter<void>();

  get badgeClasses(): string {
    const classes = [
      'badge',
      `badge--${this.variant}`,
      `badge--${this.size}`
    ];

    if (this.pill) classes.push('badge--pill');
    if (this.count) classes.push('badge--count');
    if (this.removable) classes.push('badge--removable');

    return classes.join(' ');
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit();
  }
}
