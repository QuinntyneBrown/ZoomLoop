import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

export interface TabItem {
  label: string;
  value: string | number;
  disabled?: boolean;
  icon?: string; // CSS class or URL for icon
  badge?: string | number; // small badge text/number
}

@Component({
  selector: 'zl-tabs',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tabs {
  @Input() tabs: TabItem[] = [];
  @Input() value: string | number | null = null;
  @Input() variant: 'standard' | 'scrollable' = 'standard';
  @Input() centered = false;
  @Input() fullWidth = false;
  @Input() underline = true;
  @Input() equalWidth = false;

  @Output() valueChange = new EventEmitter<string | number>();

  get selectedIndex(): number {
    if (this.value === null || this.value === undefined) return 0;
    const idx = this.tabs.findIndex(t => t.value === this.value);
    return idx >= 0 ? idx : 0;
  }

  selectTab(tab: TabItem, index: number) {
    if (tab.disabled) return;
    this.value = tab.value;
    this.valueChange.emit(tab.value);
  }

  trackByValue(_: number, tab: TabItem) {
    return tab.value;
  }

  onKeydown(event: KeyboardEvent) {
    const enabledTabs = this.tabs.filter(t => !t.disabled);
    if (enabledTabs.length === 0) return;
    const currentIndex = this.tabs.findIndex(t => t.value === (this.value ?? enabledTabs[0].value));
    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
      case 'Right':
        nextIndex = this.findNextEnabledIndex(currentIndex + 1, 1);
        break;
      case 'ArrowLeft':
      case 'Left':
        nextIndex = this.findNextEnabledIndex(currentIndex - 1, -1);
        break;
      case 'Home':
        nextIndex = this.findNextEnabledIndex(0, 1);
        break;
      case 'End':
        nextIndex = this.findNextEnabledIndex(this.tabs.length - 1, -1);
        break;
      default:
        return;
    }

    if (nextIndex !== -1) {
      const nextTab = this.tabs[nextIndex];
      this.selectTab(nextTab, nextIndex);
      event.preventDefault();
    }
  }

  private findNextEnabledIndex(start: number, step: 1 | -1): number {
    let i = start;
    while (i >= 0 && i < this.tabs.length) {
      const t = this.tabs[i];
      if (!t.disabled) return i;
      i += step;
    }
    return -1;
  }
}
