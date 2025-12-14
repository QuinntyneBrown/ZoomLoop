import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-dashboard-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardCard {
  @Input() title = '';
  @Input() description = '';
  @Input() iconColor = '#ef4444';
  @Input() showArrow = true;
  @Input() clickable = true;
}
