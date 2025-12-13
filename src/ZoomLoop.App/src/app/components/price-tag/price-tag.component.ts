import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-price-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './price-tag.component.html',
  styleUrl: './price-tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PriceTagComponent {
  @Input() amount = '';
  @Input() label = '';
  @Input() details = '';
}
