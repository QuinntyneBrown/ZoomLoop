import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() backgroundUrl = '';
  @Input() compact = false;
  @Input() fullHeight = false;
}
