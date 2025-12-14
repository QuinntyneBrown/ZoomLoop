import { CommonModule } from '@angular/common';
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
  imports: [
    CommonModule
  ],
  templateUrl: './timeline.html',
  styleUrl: './timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Timeline {
  @Input() items: TimelineItem[] = [];
}
