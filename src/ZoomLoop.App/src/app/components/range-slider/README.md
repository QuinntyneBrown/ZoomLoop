# Angular Range Slider Component

A production-ready, standalone Angular range slider component with OnPush change detection strategy, implementing `ControlValueAccessor` for seamless integration with Angular Forms.

## Features

- ✅ **Standalone Component** - No module imports required
- ✅ **OnPush Change Detection** - Optimized performance with signals
- ✅ **ControlValueAccessor** - Full Angular Forms integration
- ✅ **Touch Support** - Optimized for mobile and touch devices
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **BEM Methodology** - Clean, maintainable SCSS styling
- ✅ **Material 21 Compatible** - Integrates with Material Design tokens
- ✅ **Accessible** - ARIA labels and keyboard support
- ✅ **Type-Safe** - TypeScript interfaces with signals
- ✅ **YAGNI Compliant** - No unnecessary features

## File Structure

```
range-slider/
├── range-slider.ts          # Component logic (RangeSlider class)
├── range-slider.html        # Template
├── range-slider.scss        # BEM styles with Material integration
├── range-slider.spec.ts     # Unit tests
├── example.ts               # Usage examples
└── index.ts                 # Public API
```

## Installation

1. Copy the component files to your Angular project:
   - `range-slider.ts`
   - `range-slider.html`
   - `range-slider.scss`

2. Import directly in your component (standalone):

```typescript
import { RangeSlider } from './range-slider';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [RangeSlider],
  // ...
})
export class MyComponent { }
```

## Usage

### Basic Example (Template-Driven)

```typescript
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RangeSlider, RangeValue } from './range-slider';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [RangeSlider, FormsModule],
  template: `
    <app-range-slider
      [(ngModel)]="yearRange"
      [min]="2015"
      [max]="2026"
      [step]="1"
      label="Year Range"
    />
    <p>Selected: {{ yearRange.low }} - {{ yearRange.high }}</p>
  `
})
export class DemoComponent {
  yearRange: RangeValue = { low: 2015, high: 2026 };
}
```

### Reactive Forms Example

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RangeSlider, RangeValue } from './range-slider';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [RangeSlider, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <app-range-slider
        formControlName="yearRange"
        [min]="2015"
        [max]="2026"
        [step]="1"
        label="Year Range"
      />
    </form>
    <pre>{{ form.value | json }}</pre>
  `
})
export class DemoComponent {
  form = new FormGroup({
    yearRange: new FormControl<RangeValue>(
      { low: 2015, high: 2022 }, 
      { nonNullable: true }
    )
  });
}
```

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `min` | number | 0 | Minimum value of the range |
| `max` | number | 100 | Maximum value of the range |
| `step` | number | 1 | Step increment for values |
| `label` | string | '' | Optional label displayed above slider |

### RangeValue Interface

```typescript
export interface RangeValue {
  low: number;
  high: number;
}
```

## Examples

### Year Range (As shown in images)

```html
<!-- Initial state: 2015 - 2026 -->
<app-range-slider
  [(ngModel)]="yearRange"
  [min]="2015"
  [max]="2026"
  [step]="1"
  label="Year Range"
/>
```

Output when dragged to middle:
```json
{
  "low": 2015,
  "high": 2022
}
```

### Price Range

```html
<app-range-slider
  [(ngModel)]="priceRange"
  [min]="0"
  [max]="100000"
  [step]="1000"
  label="Price Range ($)"
/>
```

### Disabled State

```typescript
form = new FormGroup({
  range: new FormControl<RangeValue>(
    { value: { low: 30, high: 70 }, disabled: true },
    { nonNullable: true }
  )
});
```

```html
<form [formGroup]="form">
  <app-range-slider formControlName="range" [min]="0" [max]="100" />
</form>
```

## Angular Material 21 Integration

The component automatically integrates with Material Design tokens when available:

```scss
// Automatically uses Material tokens
:host-context(.mat-app-background) {
  .range-slider {
    &__label {
      color: var(--mat-sys-on-surface, #333);
    }
    &__track-fill {
      background-color: var(--mat-sys-primary, #333);
    }
  }
}
```

## BEM Class Structure

```
range-slider                      # Block
├── range-slider--disabled        # Modifier: disabled state
├── range-slider__header          # Element: header
├── range-slider__label           # Element: label text
├── range-slider__values          # Element: values container
│   ├── range-slider__value       # Element: individual value
│   └── range-slider__separator   # Element: separator
├── range-slider__track-container # Element: track container
├── range-slider__track           # Element: track
├── range-slider__track-bg        # Element: track background
├── range-slider__track-fill      # Element: active fill
├── range-slider__thumb           # Element: draggable thumb
│   ├── range-slider__thumb--low  # Modifier: low thumb
│   ├── range-slider__thumb--high # Modifier: high thumb
│   └── range-slider__thumb-inner # Element: thumb circle
└── range-slider__markers         # Element: min/max markers
    ├── range-slider__marker--min # Modifier: min marker
    └── range-slider__marker--max # Modifier: max marker
```

## Customization

### SCSS Variables

Override variables in your styles:

```scss
@use './range-slider/range-slider' with (
  $range-slider-track-fill: #1976d2,
  $range-slider-thumb-border: #1976d2,
  $range-slider-thumb-size: 28px
);
```

### Material Theming

The component respects Material Design tokens:

```scss
// Your theme file
@use '@angular/material' as mat;

$primary: mat.define-palette(mat.$indigo-palette);
$theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: $primary,
  )
));

// Component automatically uses --mat-sys-primary
```

## OnPush Change Detection

The component uses signals for reactive state management:

```typescript
// Component internals use signals
private _value = signal<RangeValue>({ low: 0, high: 100 });
readonly value = computed(() => this._value());
readonly lowPercent = computed(() => /* calculation */);
```

This ensures optimal performance with OnPush strategy.

## Touch and Mobile Support

- Automatically adjusts for touch devices
- Larger touch targets (36px vs 24px)
- Thicker track on mobile (8px vs 4px)
- Touch event handling with prevention of defaults
- Optimized for one-finger dragging

## Accessibility

- ARIA labels for screen readers
- Keyboard support (tab navigation)
- Focus indicators
- High contrast mode support
- Semantic HTML with proper roles

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Implementation Details

### Signals & Computed Values

The component uses Angular signals for reactive state:

```typescript
private _value = signal<RangeValue>({ low: 0, high: 100 });
readonly lowPercent = computed(() => {
  const val = this._value();
  return ((val.low - this.min) / (this.max - this.min)) * 100;
});
```

### ControlValueAccessor Methods

- `writeValue(value: RangeValue)` - Writes value from form
- `registerOnChange(fn)` - Registers change callback
- `registerOnTouched(fn)` - Registers touch callback
- `setDisabledState(isDisabled)` - Handles disabled state

### Event Handling

- **Desktop**: `mousedown`, `mousemove`, `mouseup`
- **Mobile**: `touchstart`, `touchmove`, `touchend`
- **Track Click**: Click anywhere to move nearest thumb

## Testing

Run unit tests:

```bash
ng test
```

The component includes comprehensive tests for:
- ControlValueAccessor implementation
- Computed signals
- Value clamping
- User interactions
- BEM classes
- OnPush change detection

## Best Practices

1. **Always provide min, max, and step** - Ensures predictable behavior
2. **Use nonNullable FormControls** - Prevents null value issues
3. **Provide labels** - Improves UX and accessibility
4. **Handle form validation** - Component integrates with Angular validators
5. **Test on mobile devices** - Touch behavior differs from desktop

## Common Use Cases

### Vehicle Year Range
```typescript
yearRange: RangeValue = { low: 2015, high: 2026 };
```

### Price Filter
```typescript
priceRange: RangeValue = { low: 10000, high: 50000 };
```

### Age Range
```typescript
ageRange: RangeValue = { low: 18, high: 65 };
```

## Migration from Module-based Components

### Before (Module)
```typescript
import { RangeSliderModule } from './range-slider/range-slider.module';

@NgModule({
  imports: [RangeSliderModule]
})
```

### After (Standalone)
```typescript
import { RangeSlider } from './range-slider';

@Component({
  standalone: true,
  imports: [RangeSlider]
})
```

## License

MIT

## Author

Created following Angular best practices, YAGNI principles, and BEM methodology.
