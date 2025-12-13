import { Component } from '@angular/core';
import { Tabs, TabItem } from './tabs';

@Component({
  selector: 'zl-tabs-demo',
  standalone: true,
  imports: [Tabs],
  template: `
    <section class="section">
      <h2>Tabs Demo</h2>
      <zl-tabs
        [tabs]="demoTabs"
        [value]="selected"
        [centered]="true"
        [underline]="true"
        [equalWidth]="true"
        (valueChange)="selected = $event"
      ></zl-tabs>
      <p>Selected: {{ selected }}</p>
    </section>
  `
})
export class TabsDemo {
  selected: string | number = 'overview';
  demoTabs: TabItem[] = [
    { label: 'Overview', value: 'overview', badge: 3 },
    { label: 'Details', value: 'details' },
    { label: 'Reviews', value: 'reviews', disabled: true },
    { label: 'FAQ', value: 'faq' },
  ];
}
