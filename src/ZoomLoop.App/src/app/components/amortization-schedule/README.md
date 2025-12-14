# Amortization Schedule Component

A performant Angular component that displays an amortization schedule for loans with an expandable/collapsible interface.

## Features

- ✅ **Expandable Section**: Collapsible UI to keep the interface clean
- ✅ **Complete Schedule**: Shows payment #, principal, interest, and remaining balance for each payment
- ✅ **Totals Display**: Displays sum of principal and sum of interest
- ✅ **Performant**: Lazy-loaded rendering - schedule only renders when expanded
- ✅ **Currency Formatting**: Automatic USD currency formatting
- ✅ **Responsive Design**: Mobile-friendly table with horizontal scrolling
- ✅ **Accessible**: ARIA attributes for screen readers
- ✅ **Keyboard Navigation**: Full keyboard support

## Usage

### Basic Example

```typescript
import { AmortizationSchedule } from '@components';

@Component({
  selector: 'my-component',
  standalone: true,
  imports: [AmortizationSchedule],
  template: `
    <zl-amortization-schedule
      [loanAmount]="25000"
      [interestRate]="3.9"
      [loanTermMonths]="60"
    ></zl-amortization-schedule>
  `
})
export class MyComponent {}
```

### With Custom Monthly Payment

```typescript
<zl-amortization-schedule
  [loanAmount]="25000"
  [interestRate]="3.9"
  [loanTermMonths]="60"
  [monthlyPayment]="500"
></zl-amortization-schedule>
```

## API

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `loanAmount` | `number` | `0` | The principal loan amount |
| `interestRate` | `number` | `0` | Annual interest rate as a percentage (e.g., 5 for 5%) |
| `loanTermMonths` | `number` | `0` | Loan term in months |
| `monthlyPayment` | `number` | `0` | (Optional) Fixed monthly payment. If not provided, it will be calculated |

### Properties

The component exposes the following computed properties:

- `schedule`: Signal containing array of `AmortizationPayment` objects
- `totalPrincipal`: Signal containing total principal paid
- `totalInterest`: Signal containing total interest paid
- `isExpanded`: Signal indicating whether the schedule is expanded

### AmortizationPayment Interface

```typescript
export interface AmortizationPayment {
  paymentNumber: number;
  principal: number;
  interest: number;
  remainingBalance: number;
  totalPayment: number;
}
```

## Examples

### Car Loan

```typescript
<zl-amortization-schedule
  [loanAmount]="25000"
  [interestRate]="3.9"
  [loanTermMonths]="60"
></zl-amortization-schedule>
```

### Mortgage (30-year)

```typescript
<zl-amortization-schedule
  [loanAmount]="400000"
  [interestRate]="3.5"
  [loanTermMonths]="360"
></zl-amortization-schedule>
```

### Zero Interest Financing

```typescript
<zl-amortization-schedule
  [loanAmount]="12000"
  [interestRate]="0"
  [loanTermMonths]="24"
></zl-amortization-schedule>
```

## Demo

To see the component in action, navigate to `/demo/amortization` in your application.

## Testing

### Unit Tests

Run unit tests with:

```bash
npm test
```

The component has 35 unit tests covering:
- Initialization and default values
- Schedule calculation accuracy
- Toggle functionality
- Template rendering
- Currency formatting
- Edge cases
- Accessibility
- Performance

### E2E Tests

Run end-to-end tests with:

```bash
npm run e2e
```

The component has 17 e2e tests covering:
- User interactions
- Visual rendering
- Mobile responsiveness
- Keyboard accessibility
- Large data sets

## Performance Characteristics

- **Lazy Rendering**: The schedule table is only rendered when expanded, keeping the DOM light
- **On-Demand Calculation**: Schedule is calculated only when inputs change
- **Efficient**: Can handle 360-month (30-year) schedules without performance issues
- **Change Detection**: Uses `OnPush` strategy for optimal performance

## Accessibility

- **ARIA Attributes**: Proper `aria-expanded`, `aria-controls`, and `role` attributes
- **Keyboard Navigation**: Full keyboard support with Enter/Space to toggle
- **Screen Reader Friendly**: Semantic HTML with proper table structure
- **Focus Management**: Visible focus indicators

## Browser Support

Supports all modern browsers that are compatible with Angular 21:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Copyright © Quinntyne Brown. All Rights Reserved.
Licensed under the MIT License. See License.txt in the project root for license information.
