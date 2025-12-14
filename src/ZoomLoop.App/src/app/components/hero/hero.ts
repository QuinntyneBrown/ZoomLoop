import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Hero {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() backgroundUrl = '';
  @Input() compact = false;
  @Input() fullHeight = false;
}
