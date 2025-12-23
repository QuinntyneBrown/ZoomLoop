# Toast/Notification Component

## Overview
Toasts are non-blocking notifications that provide feedback about an operation or system status. They appear temporarily and can be dismissed.

## Toast Types

| Type | Usage | Icon |
|------|-------|------|
| Success | Confirm completed action | Checkmark |
| Error | Report failed operation | X or Alert |
| Warning | Caution about action | Triangle |
| Info | Neutral information | Info circle |

## Component States

| State | Description |
|-------|-------------|
| Entering | Animating into view |
| Visible | Fully displayed |
| Exiting | Animating out of view |
| Paused | Hover pauses auto-dismiss |

## Visual Specifications

### Dimensions
| Property | Value |
|----------|-------|
| Min Width | 320px |
| Max Width | 420px |
| Padding | 16px |
| Border Radius | 12px |
| Icon Size | 20px |
| Gap (icon-text) | 12px |

### Colors
| Type | Background | Border | Icon | Text |
|------|------------|--------|------|------|
| Success | `#F0FDF4` | `#22C55E` | `#16A34A` | `#166534` |
| Error | `#FEF2F2` | `#EF4444` | `#DC2626` | `#991B1B` |
| Warning | `#FFFBEB` | `#F59E0B` | `#D97706` | `#92400E` |
| Info | `#EFF6FF` | `#3B82F6` | `#2563EB` | `#1E40AF` |
| Neutral | `#F9FAFB` | `#D1D5DB` | `#6B7280` | `#374151` |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Inter | 14px | 600 | Type-specific |
| Message | Inter | 14px | 400 | Type-specific |
| Action Link | Inter | 14px | 500 | Primary Blue |

### Shadow
- `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`

## Position Options

| Position | Description |
|----------|-------------|
| Top Right | Default, most common |
| Top Center | Centered at top |
| Top Left | Left aligned at top |
| Bottom Right | Bottom corner |
| Bottom Center | Centered at bottom |
| Bottom Left | Left aligned at bottom |

### Position Offset
- From edge: 24px
- Between toasts: 12px (stacked)

## Wireframes

### Basic Toast
```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  [✓]  Action completed successfully                      [×] │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Toast with Description
```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  [✓]  Vehicle Added to Favorites                         [×] │
│       2021 Honda Civic EX has been saved to your list.       │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Toast with Action
```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  [⚠]  Session Expiring Soon                              [×] │
│       Your session will expire in 5 minutes.                 │
│                                                               │
│       [Extend Session]                                        │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Error Toast
```
┌──────────────────────────────────────────────────────────────┐
│                                                               │
│  [✗]  Failed to save changes                             [×] │
│       Please check your connection and try again.            │
│                                                               │
│       [Retry]  [Dismiss]                                      │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

### Stacked Toasts
```
                                              ┌─── 24px from edge
                                              │
                                              ▼
    ┌──────────────────────────────────────────────────────────┐
    │  [✓]  First notification                             [×] │
    └──────────────────────────────────────────────────────────┘
                        ↕ 12px gap
    ┌──────────────────────────────────────────────────────────┐
    │  [ℹ]  Second notification                            [×] │
    └──────────────────────────────────────────────────────────┘
                        ↕ 12px gap
    ┌──────────────────────────────────────────────────────────┐
    │  [⚠]  Third notification                             [×] │
    └──────────────────────────────────────────────────────────┘
```

## Timing

| Property | Value |
|----------|-------|
| Default Duration | 5000ms (5 seconds) |
| Error Duration | 8000ms (8 seconds) |
| Persistent | No auto-dismiss (for critical) |
| Animation Duration | 300ms |

## Animation

### Enter Animation
```css
@keyframes toastEnter {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Exit Animation
```css
@keyframes toastExit {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}
```

### Progress Bar (Optional)
- Shows remaining time before auto-dismiss
- Height: 3px
- Position: Bottom of toast
- Animation: linear decrease over duration

## Accessibility

### Requirements
- Use `role="alert"` for important messages
- Use `role="status"` for non-critical updates
- Announce to screen readers via `aria-live`
- Dismissible with keyboard (Escape, Enter on close)
- Focus management for action buttons

### ARIA Attributes
```html
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
  class="toast toast--error"
>
  <div class="toast__icon">...</div>
  <div class="toast__content">
    <p class="toast__title">Error Title</p>
    <p class="toast__message">Error description</p>
  </div>
  <button
    class="toast__close"
    aria-label="Dismiss notification"
  >
    ×
  </button>
</div>
```

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| > 480px | Fixed width, corner positioned |
| ≤ 480px | Full width with margins, bottom position |

## Best Practices

### Do
- Keep messages concise
- Use appropriate type for context
- Provide actions when relevant
- Allow dismissal for non-critical toasts

### Don't
- Show more than 3 stacked toasts
- Use for critical confirmations
- Block user interaction
- Auto-dismiss error messages too quickly
