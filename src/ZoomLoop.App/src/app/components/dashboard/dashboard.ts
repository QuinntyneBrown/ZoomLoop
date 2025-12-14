import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  @Input() title = '';
  @Input() description = '';
  @Input() iconColor = '#ef4444';
  @Input() showArrow = true;
  @Input() clickable = true;
}
