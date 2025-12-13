# Tabs Component (zl-tabs)

A configurable, responsive tabs component inspired by MUI Tabs and styled like clutch.ca.

## Features
- Active underline indicator
- Disabled tabs support
- Centered / full width / equal width layouts
- Optional icons and badges per tab
- Accessible roles and keyboard focus

## API

### Inputs
- `tabs: TabItem[]` — array of tabs `{ label, value, disabled?, icon?, badge? }`
- `value: string | number | null` — selected tab value
- `variant: 'standard' | 'scrollable'` — behavior for list overflow
- `centered: boolean` — center the tab list
- `fullWidth: boolean` — space tabs evenly across width
- `underline: boolean` — show active underline indicator
- `equalWidth: boolean` — force equal widths via grid

### Outputs
- `valueChange: EventEmitter<string | number>` — emits on selection

## Usage
```ts
@Component({
  selector: 'example-tabs-usage',
  standalone: true,
  imports: [Tabs],
  template: `
    <zl-tabs
      [tabs]="tabs"
      [value]="selected"
      [centered]="true"
      [underline]="true"
      (valueChange)="selected = $event"
    ></zl-tabs>
  `
})
export class ExampleTabsUsage {
  selected = 'overview';
  tabs = [
    { label: 'Overview', value: 'overview', badge: 3 },
    { label: 'Details', value: 'details' },
    { label: 'Reviews', value: 'reviews', disabled: true },
  ];
}
```

## Demo Route
Open `/demo/tabs` to see the component in action.
