import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface FooterSection {
  title: string;
  links?: FooterLink[];
}

export interface FooterLink {
  label: string;
  url: string;
}

export interface SocialLink {
  url: string;
  ariaLabel: string;
}

@Component({
  selector: 'zl-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  @Input() logo = '';
  @Input() description = '';
  @Input() sections: FooterSection[] = [];
  @Input() socialLinks: SocialLink[] = [];
  @Input() copyright = '';
  @Input() bottomLinks: FooterLink[] = [];
}
