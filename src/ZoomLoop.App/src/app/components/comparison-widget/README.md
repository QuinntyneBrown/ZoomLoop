# Comparison Widget

A reusable Angular component for comparing loan terms and rates with clear visual indicators and delta calculations.

## Features

- **Side-by-side comparison** of two loan scenarios
- **Real-time calculations** of monthly payments and total interest
- **Delta display** showing the difference between scenarios
- **Active scenario indication** with visual highlights
- **Scenario switching** to promote alternate to primary
- **Responsive design** that works on mobile and desktop
- **Accessible** with proper ARIA attributes and keyboard support

## Usage

### Basic Example

```typescript
import { Component } from '@angular/core';
import { ComparisonWidget, LoanScenario } from '@components';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [ComparisonWidget],
  template: `
    <zl-comparison-widget
      [primaryScenario]="primaryScenario"
      [secondaryScenario]="secondaryScenario"
      [(activeScenario)]="activeScenario"
      (scenarioSwitch)="onScenarioSwitch($event)"
    ></zl-comparison-widget>
  `
})
export class MyPage {
  primaryScenario: LoanScenario = {
    term: 60,      // months
    rate: 5.0,     // annual interest rate (percentage)
    principal: 30000
  };

  secondaryScenario: LoanScenario = {
    term: 48,
    rate: 4.5,
    principal: 30000
  };

  activeScenario: 'primary' | 'secondary' = 'primary';

  onScenarioSwitch(event: { primary: LoanScenario; secondary: LoanScenario }): void {
    this.primaryScenario = event.primary;
    this.secondaryScenario = event.secondary;
  }
}
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `primaryScenario` | `LoanScenario \| undefined` | `undefined` | The primary loan scenario to compare |
| `secondaryScenario` | `LoanScenario \| undefined` | `undefined` | The secondary loan scenario to compare |
| `activeScenario` | `'primary' \| 'secondary'` | `'primary'` | Which scenario is currently active |

### Outputs

| Output | Type | Description |
|--------|------|-------------|
| `scenarioSwitch` | `EventEmitter<{ primary: LoanScenario; secondary: LoanScenario }>` | Emitted when the user clicks the switch button, swapping primary and secondary scenarios |
| `activeScenarioChange` | `EventEmitter<'primary' \| 'secondary'>` | Emitted when the user selects a different scenario |

### Types

```typescript
interface LoanScenario {
  term: number;      // Loan term in months
  rate: number;      // Annual interest rate as a percentage (e.g., 5.0 for 5%)
  principal: number; // Loan amount
}

interface LoanComparison {
  monthlyPayment: number;
  totalInterest: number;
  totalPaid: number;
}
```

## Calculations

The widget calculates:

1. **Monthly Payment**: Using the standard loan payment formula:
   ```
   M = P * [r(1+r)^n] / [(1+r)^n - 1]
   ```
   Where:
   - M = Monthly payment
   - P = Principal
   - r = Monthly interest rate (annual rate / 12 / 100)
   - n = Number of months

2. **Total Interest**: Total amount paid minus principal

3. **Deltas**: Difference between secondary and primary scenarios for both monthly payment and total interest

## Features in Detail

### Visual Indicators

- **Active Scenario**: Highlighted with a colored border and background
  - Primary: Blue (#0066cc)
  - Secondary: Green (#059669)
- **Active Badge**: Displayed on the active scenario
- **Delta Values**: Color-coded to show positive (red) or negative (green) differences

### Scenario Switching

Click the "Switch" button to swap primary and secondary scenarios. This is useful when you want to make your alternate scenario the main one.

### Interactive Selection

Click on either scenario card to make it active. The active scenario is visually highlighted to make it easy to see which option you're currently considering.

### Responsive Design

The widget automatically adjusts its layout for mobile devices, stacking scenarios vertically on smaller screens.

## Accessibility

- Proper ARIA attributes (`role`, `aria-label`, `aria-pressed`)
- Keyboard accessible with `tabindex`
- Screen reader friendly with semantic HTML

## Styling

The widget uses BEM methodology for CSS class names and can be customized by overriding the CSS variables or classes:

```scss
.comparison-widget {
  --primary-color: #0066cc;
  --secondary-color: #059669;
  --border-color: #e5e7eb;
  --background-color: #ffffff;
}
```

## Testing

The component includes comprehensive unit tests covering:
- Loan calculations (monthly payment, total interest)
- Comparison calculations (deltas)
- User interactions (switching, selecting)
- Template rendering
- Accessibility
- Edge cases

Run tests with:
```bash
npm test -- --include "**/comparison-widget.spec.ts"
```

## License

Copyright (c) Quinntyne Brown. All Rights Reserved.
Licensed under the MIT License. See License.txt in the project root for license information.
