import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'zl-feature',
  standalone: true,
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() horizontal = false;
}
