import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TrustBadge {
  icon: 'check' | 'truck' | 'lock' | 'return' | 'shield' | 'star';
  title: string;
  description: string;
}

@Component({
  selector: 'zl-trust-badges',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trust-badges.component.html',
  styleUrl: './trust-badges.component.scss'
})
export class TrustBadgesComponent {
  @Input() showDividers = false;
  @Input() badges: TrustBadge[] = [
    {
      icon: 'check',
      title: '210-Point Inspection',
      description: 'Every car is thoroughly inspected and reconditioned'
    },
    {
      icon: 'truck',
      title: 'Free Delivery',
      description: 'Delivered to your door at no extra cost'
    },
    {
      icon: 'lock',
      title: 'Secure Financing',
      description: 'Pre-approved in minutes with no credit impact'
    },
    {
      icon: 'return',
      title: '10-Day Return',
      description: 'Love it or return it, no questions asked'
    }
  ];
}
