import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  marker?: string;
}

@Component({
  selector: 'zl-timeline',
  standalone: true,
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
  @Input() items: TimelineItem[] = [];
}
