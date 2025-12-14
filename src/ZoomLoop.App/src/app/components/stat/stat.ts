import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-stat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stat.html',
  styleUrl: './stat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Stat {
  @Input() value = '';
  @Input() label = '';
}
