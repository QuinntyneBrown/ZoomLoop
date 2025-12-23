# Modal Component

## Overview
Modals are dialog overlays that require user attention or interaction. They temporarily block access to the main content until dismissed or an action is taken.

## Modal Types

| Type | Usage |
|------|-------|
| Alert | Simple messages requiring acknowledgment |
| Confirmation | Actions requiring user confirmation |
| Form | Data entry dialogs |
| Gallery | Full-screen image viewer |
| Video | Video player overlay |

## Component States

| State | Description |
|-------|-------------|
| Closed | Modal not visible |
| Opening | Animation entering |
| Open | Fully visible |
| Closing | Animation exiting |

## Sizes

| Size | Max Width | Use Case |
|------|-----------|----------|
| Small (sm) | 400px | Alerts, confirmations |
| Medium (md) | 560px | Forms, standard content |
| Large (lg) | 720px | Complex forms, galleries |
| XLarge (xl) | 900px | Data tables, dashboards |
| Full | 100% - 48px | Image viewers, video |

## Visual Specifications

### Overlay
- **Color**: `rgba(0, 0, 0, 0.6)`
- **Blur**: `backdrop-filter: blur(4px)`

### Modal Container
| Property | Value |
|----------|-------|
| Background | `#FFFFFF` |
| Border Radius | 16px |
| Shadow | `0 25px 50px -12px rgba(0, 0, 0, 0.25)` |
| Max Height | `calc(100vh - 48px)` |

### Header
| Property | Value |
|----------|-------|
| Padding | 24px 24px 16px |
| Border Bottom | `1px solid #E5E7EB` |
| Title Font | Inter, 18px, 600 |
| Title Color | `#1F2937` |

### Body
| Property | Value |
|----------|-------|
| Padding | 24px |
| Overflow | auto |
| Text Color | `#374151` |
| Text Size | 14px |

### Footer
| Property | Value |
|----------|-------|
| Padding | 16px 24px 24px |
| Border Top | `1px solid #E5E7EB` |
| Button Gap | 12px |

### Close Button
| Property | Value |
|----------|-------|
| Size | 32px x 32px |
| Position | Top right, 16px inset |
| Icon Size | 20px |
| Color | `#6B7280` |
| Hover Color | `#1F2937` |
| Hover Background | `#F3F4F6` |

## Spacing

### Modal Anatomy
```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                        16px                         [×]│ │
│  │  ← 24px →  Modal Title                        ← 24px → │ │
│  │                        16px                            │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                        24px                            │ │
│  │  ← 24px →                                     ← 24px → │ │
│  │             Modal body content goes here.              │ │
│  │             This area scrolls if content               │ │
│  │             exceeds max height.                        │ │
│  │                                                        │ │
│  │  ← 24px →                                     ← 24px → │ │
│  │                        24px                            │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │                        16px                            │ │
│  │  ← 24px →                    [Cancel] [Confirm]← 24px →│ │
│  │                        24px                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                    24px from viewport edge                   │
└──────────────────────────────────────────────────────────────┘
```

## Wireframes

### Alert Modal
```
┌────────────────────────────────────────┐
│                                     [×]│
│  ⚠ Warning                            │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│  Are you sure you want to remove       │
│  this vehicle from your favorites?     │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│                    [Cancel] [Remove]   │
│                                        │
└────────────────────────────────────────┘
```

### Confirmation Modal
```
┌────────────────────────────────────────┐
│                                     [×]│
│  Confirm Purchase                      │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│  You're about to purchase:             │
│                                        │
│  2021 Honda Civic EX                   │
│  Price: $24,500                        │
│                                        │
│  This action cannot be undone.         │
│                                        │
│  ────────────────────────────────────  │
│                                        │
│            [Go Back] [Confirm Purchase]│
│                                        │
└────────────────────────────────────────┘
```

### Form Modal
```
┌─────────────────────────────────────────────┐
│                                          [×]│
│  Schedule Test Drive                        │
│                                             │
│  ────────────────────────────────────────── │
│                                             │
│  Full Name *                                │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Phone Number *                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Preferred Date *                           │
│  ┌─────────────────────────────────────┐   │
│  │ Select a date                    [📅]│   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ────────────────────────────────────────── │
│                                             │
│              [Cancel] [Schedule Test Drive] │
│                                             │
└─────────────────────────────────────────────┘
```

### Gallery Modal
```
┌──────────────────────────────────────────────────────────────────┐
│ [×]                                                              │
│                                                                  │
│  [←]    ┌────────────────────────────────────────────┐    [→]   │
│         │                                            │          │
│         │                                            │          │
│         │           Vehicle Image                    │          │
│         │                                            │          │
│         │                                            │          │
│         └────────────────────────────────────────────┘          │
│                                                                  │
│              ○ ○ ● ○ ○ ○ ○ ○ ○ ○                                │
│                                                                  │
│         [  ] [  ] [  ] [  ] [  ] [  ] [  ] [  ]                 │
│         Thumbnail strip                                          │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Animation

### Opening Animation
```css
/* Overlay */
@keyframes overlayIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Modal */
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Closing Animation
```css
/* Overlay */
@keyframes overlayOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Modal */
@keyframes modalOut {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
}
```

### Timing
| Animation | Duration | Easing |
|-----------|----------|--------|
| Open | 200ms | ease-out |
| Close | 150ms | ease-in |

## Accessibility

### Requirements
- Focus trapped within modal when open
- First focusable element receives focus on open
- Escape key closes modal
- Background content has `aria-hidden="true"`
- Announce modal title via `aria-labelledby`
- Announce description via `aria-describedby`

### ARIA Attributes
```html
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <h2 id="modal-title">Modal Title</h2>
  <p id="modal-description">Modal description text</p>

  <button aria-label="Close modal">×</button>
</div>
```

### Focus Management
1. On open: Focus moves to modal (first focusable element)
2. Tab cycles through modal elements only
3. On close: Focus returns to trigger element
4. Escape key closes modal

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| > 768px | Centered modal with max-width |
| ≤ 768px | Full-width modal with 16px margins |
| ≤ 480px | Full-screen on mobile for forms |

## Z-Index
- **Overlay**: `z-index: 1040`
- **Modal**: `z-index: 1050`
- **Nested Modal**: `z-index: 1060`

## Best Practices

### Do
- Use clear, action-oriented titles
- Provide obvious close options
- Keep content concise
- Use appropriate modal size for content
- Animate smoothly

### Don't
- Stack multiple modals
- Use for simple, quick actions
- Block user without clear exit
- Put complex navigation in modals
- Auto-close without user action
