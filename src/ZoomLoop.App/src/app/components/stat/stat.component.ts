import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-stat',
  standalone: true,
  templateUrl: './stat.component.html',
  styleUrl: './stat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatComponent {
  @Input() value = '';
  @Input() label = '';
}
