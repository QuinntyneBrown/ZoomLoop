import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface SocialLink {
  platform: 'facebook' | 'linkedin' | 'instagram' | 'youtube' | 'twitter';
  href: string;
}

@Component({
  selector: 'zl-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() logoText = 'Clutch';
  @Input() logoInitial = 'C';
  @Input() logoHref = '/';
  @Input() tagline = "Canada's #1 online car marketplace. Buy and sell quality used vehicles with confidence.";
  @Input() columns: FooterColumn[] = [];
  @Input() socialLinks: SocialLink[] = [];
  @Input() showNewsletter = true;
  @Input() newsletterTitle = 'Stay Connected';
  @Input() newsletterDescription = 'Get the latest deals, news, and updates delivered to your inbox.';
  @Input() newsletterPlaceholder = 'Enter your email';
  @Input() newsletterButtonText = 'Subscribe';
  @Input() newsletterSuccessMessage = 'Thanks for subscribing!';
  @Input() copyright = '© 2024 Clutch Technologies Inc. All rights reserved.';
  @Input() legalLinks: { label: string; href: string }[] = [];
  @Input() compact = false;

  @Output() newsletterSubscribe = new EventEmitter<string>();

  newsletterEmail = '';
  newsletterSubmitted = false;

  onNewsletterSubmit(): void {
    if (this.newsletterEmail) {
      this.newsletterSubscribe.emit(this.newsletterEmail);
      this.newsletterSubmitted = true;
    }
  }
}
