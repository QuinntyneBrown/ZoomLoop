import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-price-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-tag.html',
  styleUrl: './price-tag.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTag {
  @Input() amount = '';
  @Input() label = '';
  @Input() details = '';
}
