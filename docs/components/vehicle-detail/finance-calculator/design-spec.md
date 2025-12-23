# Finance Calculator Component

## Overview
The finance calculator allows users to estimate monthly payments based on vehicle price, down payment, loan term, and interest rate. It provides transparent financing options.

## Component States

| State | Description |
|-------|-------------|
| Default | Initial calculator with default values |
| Calculating | Loading new payment amount |
| Updated | Values changed, recalculated |
| Error | Invalid input handling |
| Pre-approved | User has pre-approval |

## Visual Specifications

### Dimensions
| Property | Value |
|----------|-------|
| Card Width | 100% (sidebar) or 400px |
| Padding | 24px |
| Border Radius | 16px |
| Slider Height | 4px |

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Card Background | White | `#FFFFFF` |
| Monthly Payment | Primary Blue | `#1E40AF` |
| Labels | Medium Gray | `#6B7280` |
| Values | Dark Gray | `#1F2937` |
| Slider Track | Light Gray | `#E5E7EB` |
| Slider Fill | Primary Blue | `#1E40AF` |
| Input Border | Light Gray | `#D1D5DB` |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Monthly Payment | Inter | 36px | 700 |
| "per month" | Inter | 14px | 400 |
| Input Labels | Inter | 13px | 500 |
| Input Values | Inter | 16px | 600 |
| Breakdown Labels | Inter | 14px | 400 |
| Breakdown Values | Inter | 14px | 600 |

## Wireframe

### Calculator Card
```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  Estimate Your Payment                                   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                                                  │   │
│  │              $398                                │   │
│  │            per month                             │   │
│  │                                                  │   │
│  │   Total: $47,760 over 120 months                │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Vehicle Price                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │  $ 24,500                                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  Down Payment                             $2,500 (10%)  │
│  $0 ─────────●───────────────────────────── $12,250    │
│                                                          │
│  Loan Term                                    60 months │
│  24 ───────────────●─────────────────────────── 84 mo  │
│                                                          │
│  Interest Rate                                   6.99%  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  6.99 %                                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  Breakdown                                               │
│  Principal                               $22,000        │
│  Interest                                 $3,760        │
│  Total Cost                              $25,760        │
│                                                          │
│  ─────────────────────────────────────────────────────  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Get Pre-Approved                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  No impact to your credit score                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Input Controls

### Sliders
| Control | Min | Max | Step |
|---------|-----|-----|------|
| Down Payment | $0 | 50% of price | $500 |
| Loan Term | 24 months | 84 months | 12 months |
| Interest Rate | 0% | 20% | 0.25% |

### Direct Input
- Currency formatting ($XX,XXX)
- Percentage formatting (X.XX%)
- Validation on blur
- Real-time calculation

## Payment Breakdown

### Display Fields
| Field | Description |
|-------|-------------|
| Principal | Vehicle price - down payment |
| Interest | Total interest over loan term |
| Total Cost | Principal + Interest |
| Monthly | Monthly payment amount |

### Formula
```
Monthly Payment = P × (r × (1 + r)^n) / ((1 + r)^n - 1)

Where:
P = Principal (loan amount)
r = Monthly interest rate (annual rate / 12)
n = Number of payments (months)
```

## Animation

### Value Changes
- Number animation: count up/down
- Duration: 300ms
- Easing: ease-out

### Slider Movement
- Real-time update
- Debounce: 50ms for performance

## Pre-Approval Integration

### CTA Section
```
┌─────────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────────┐   │
│  │     [Lock icon] Get Pre-Approved Now            │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ✓ No impact to credit score                            │
│  ✓ Results in seconds                                   │
│  ✓ Know your rate before you shop                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Accessibility

### Requirements
- All inputs labeled
- Slider keyboard accessible
- Live region for payment updates
- Error messages associated with inputs

### ARIA
```html
<div role="region" aria-labelledby="calc-title">
  <h3 id="calc-title">Estimate Your Payment</h3>

  <div aria-live="polite" aria-atomic="true">
    <span>$398</span>
    <span>per month</span>
  </div>

  <label for="down-payment">Down Payment</label>
  <input
    type="range"
    id="down-payment"
    min="0"
    max="12250"
    aria-valuetext="$2,500 (10%)"
  />
</div>
```

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| > 992px | Sidebar card |
| 768-992px | Full width below gallery |
| < 768px | Accordion or modal |

## Error States

| Error | Message |
|-------|---------|
| Invalid rate | Please enter a valid interest rate |
| Rate too high | Maximum rate is 20% |
| Down > Price | Down payment cannot exceed vehicle price |
