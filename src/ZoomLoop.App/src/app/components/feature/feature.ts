import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-feature',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature.html',
  styleUrl: './feature.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Feature {
  @Input() title = '';
  @Input() description = '';
  @Input() horizontal = false;
}
