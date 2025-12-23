# Input Component

## Overview
Input fields are form elements that allow users to enter data. The design system includes various input types and states for consistent user experience.

## Input Types

| Type | Usage |
|------|-------|
| Text | General text entry |
| Email | Email address entry |
| Password | Password entry with toggle |
| Number | Numeric entry |
| Phone | Phone number with formatting |
| Search | Search with icon and clear |
| Select | Dropdown selection |
| Textarea | Multi-line text entry |

## Component States

| State | Description |
|-------|-------------|
| Default | Empty, resting state |
| Placeholder | Shows hint text |
| Filled | Contains user input |
| Focused | Active input state |
| Hover | Mouse over input |
| Disabled | Non-interactive |
| Read Only | Viewable but not editable |
| Error | Invalid input state |
| Success | Validated input state |

## Visual Specifications

### Dimensions
| Property | Default | Compact |
|----------|---------|---------|
| Height | 44px | 36px |
| Border Radius | 8px | 6px |
| Padding X | 14px | 12px |
| Padding Y | 10px | 8px |

### Colors
| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `#FFFFFF` | `#D1D5DB` | `#1F2937` |
| Hover | `#FFFFFF` | `#9CA3AF` | `#1F2937` |
| Focus | `#FFFFFF` | `#1E40AF` | `#1F2937` |
| Disabled | `#F9FAFB` | `#E5E7EB` | `#9CA3AF` |
| Error | `#FEF2F2` | `#EF4444` | `#1F2937` |
| Success | `#F0FDF4` | `#22C55E` | `#1F2937` |
| Read Only | `#F3F4F6` | `#E5E7EB` | `#374151` |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Input Text | Inter | 14px | 400 | `#1F2937` |
| Placeholder | Inter | 14px | 400 | `#9CA3AF` |
| Label | Inter | 14px | 500 | `#374151` |
| Helper Text | Inter | 12px | 400 | `#6B7280` |
| Error Text | Inter | 12px | 400 | `#EF4444` |
| Success Text | Inter | 12px | 400 | `#22C55E` |

### Focus Ring
- **Offset**: 0
- **Width**: 3px
- **Color**: `rgba(30, 64, 175, 0.3)`
- **Style**: `box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.3)`

## Spacing

### With Label
```
┌──────────────────────────────────────┐
│  Label Text                          │  ← 14px font, 500 weight
│  ← 8px spacing →                     │
│  ┌──────────────────────────────────┐│
│  │ 14px  Input text               ↔ ││  ← 44px height
│  └──────────────────────────────────┘│
│  ← 4px spacing →                     │
│  Helper or error text                │  ← 12px font
└──────────────────────────────────────┘
```

### Input Anatomy
```
┌────────────────────────────────────────────────────────┐
│  ┌────┐                                    ┌────┐     │
│  │Icon│  14px padding  Input Text   14px   │Icon│     │
│  └────┘       ←                    →       └────┘     │
│                                                        │
│  ↑ 10px                                    10px ↓     │
└────────────────────────────────────────────────────────┘
     ↑                                           ↑
  Leading Icon                              Trailing Icon
  (optional)                                (optional)
```

## Wireframes

### Standard Input
```
Label Text
┌────────────────────────────────────────┐
│ Placeholder text                       │
└────────────────────────────────────────┘
Helper text goes here
```

### Input with Icons
```
Label Text
┌────────────────────────────────────────┐
│ [🔍] Search for vehicles...         [×]│
└────────────────────────────────────────┘
```

### Password Input
```
Password *
┌────────────────────────────────────────┐
│ [🔒] ••••••••••                    [👁]│
└────────────────────────────────────────┘
Must be at least 8 characters
```

### Error State
```
Email Address *
┌────────────────────────────────────────┐  ← Red border
│ invalid-email                          │
└────────────────────────────────────────┘
⚠ Please enter a valid email address      ← Red text
```

### Success State
```
Email Address *
┌────────────────────────────────────────┐  ← Green border
│ user@example.com                    [✓]│
└────────────────────────────────────────┘
✓ Email verified                          ← Green text
```

### Select Dropdown
```
Province *
┌────────────────────────────────────────┐
│ Select a province                   [▼]│
└────────────────────────────────────────┘
     │
     ▼
┌────────────────────────────────────────┐
│ Ontario                                │
│ Quebec                                 │
│ British Columbia                       │
│ Alberta                                │
│ ...                                    │
└────────────────────────────────────────┘
```

### Textarea
```
Message
┌────────────────────────────────────────┐
│ Type your message here...              │
│                                        │
│                                        │
│                                        │
│                              [123/500] │
└────────────────────────────────────────┘
```

## Input Variants

### With Prefix/Suffix
```
Price Range
┌─────┬────────────────────────────────┐
│  $  │ 0                              │
└─────┴────────────────────────────────┘

Phone Number
┌───────┬──────────────────────────────┐
│ +1    │ (416) 555-0123               │
└───────┴──────────────────────────────┘
```

### Connected Inputs
```
┌──────────────────┐ ┌──────────────────┐
│ Min Price        │ │ Max Price        │
│ $ 0              │-│ $ 50,000         │
└──────────────────┘ └──────────────────┘
```

## Accessibility

### Requirements
- Labels must be associated with inputs via `for` attribute
- Required fields indicated with asterisk and `aria-required`
- Error messages linked via `aria-describedby`
- Visible focus indicators
- Sufficient color contrast

### ARIA Attributes
```html
<!-- Standard input -->
<label for="email">Email Address</label>
<input
  type="email"
  id="email"
  name="email"
  aria-describedby="email-helper"
/>
<span id="email-helper">We'll never share your email</span>

<!-- Required input -->
<label for="name">Full Name *</label>
<input
  type="text"
  id="name"
  name="name"
  required
  aria-required="true"
/>

<!-- Error state -->
<input
  type="email"
  id="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">Please enter a valid email</span>

<!-- Disabled input -->
<input
  type="text"
  disabled
  aria-disabled="true"
/>
```

## Animation

### Focus Transition
- **Property**: border-color, box-shadow
- **Duration**: 150ms
- **Timing**: ease-out

### Error Shake
- **Animation**: horizontal shake
- **Duration**: 300ms
- **Distance**: 4px

## Best Practices

### Do
- Always include visible labels
- Provide clear placeholder text
- Show validation feedback immediately
- Use appropriate input types (email, tel, etc.)
- Mark required fields clearly

### Don't
- Use placeholder as the only label
- Show error states before user interaction
- Disable inputs without explanation
- Use generic error messages
