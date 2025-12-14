import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type CardBadge = 'featured' | 'sold' | 'default' | '';

@Component({
  selector: 'zl-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Card {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() badgeLabel = '';
  @Input() badgeType: CardBadge = '';
  @Input() price = '';
  @Input() priceLabel = '';
}
