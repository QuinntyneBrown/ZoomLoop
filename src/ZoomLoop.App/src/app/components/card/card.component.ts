import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export type CardBadge = 'featured' | 'sold' | 'default' | '';

@Component({
  selector: 'zl-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() description = '';
  @Input() imageUrl = '';
  @Input() badgeLabel = '';
  @Input() badgeType: CardBadge = '';
  @Input() price = '';
  @Input() priceLabel = '';
}
