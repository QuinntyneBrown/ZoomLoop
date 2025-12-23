# Button Component

## Overview
Buttons are interactive elements that trigger actions. The design system includes multiple button variants for different use cases and hierarchies.

## Button Variants

| Variant | Usage |
|---------|-------|
| Primary | Main call-to-action, highest emphasis |
| Secondary | Alternative actions, medium emphasis |
| Outline | Tertiary actions, low emphasis |
| Ghost | Minimal emphasis, inline actions |
| Danger | Destructive actions |
| Success | Confirmation actions |

## Component States

| State | Description |
|-------|-------------|
| Default | Normal resting state |
| Hover | Mouse over the button |
| Active/Pressed | Button being clicked |
| Focus | Keyboard focus visible |
| Disabled | Non-interactive state |
| Loading | Async operation in progress |

## Sizes

| Size | Height | Padding (H) | Font Size | Icon Size |
|------|--------|-------------|-----------|-----------|
| Small (sm) | 32px | 12px | 13px | 16px |
| Medium (md) | 40px | 16px | 14px | 18px |
| Large (lg) | 48px | 24px | 16px | 20px |
| XLarge (xl) | 56px | 32px | 18px | 24px |

## Visual Specifications

### Primary Button
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `#1E40AF` | `#1E40AF` | `#FFFFFF` |
| Hover | `#1E3A8A` | `#1E3A8A` | `#FFFFFF` |
| Active | `#1E3A7A` | `#1E3A7A` | `#FFFFFF` |
| Focus | `#1E40AF` | `#1E40AF` + ring | `#FFFFFF` |
| Disabled | `#9CA3AF` | `#9CA3AF` | `#FFFFFF` |

### Secondary Button
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `#F3F4F6` | `#F3F4F6` | `#374151` |
| Hover | `#E5E7EB` | `#E5E7EB` | `#1F2937` |
| Active | `#D1D5DB` | `#D1D5DB` | `#1F2937` |
| Focus | `#F3F4F6` | `#F3F4F6` + ring | `#374151` |
| Disabled | `#F9FAFB` | `#F9FAFB` | `#9CA3AF` |

### Outline Button
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `transparent` | `#D1D5DB` | `#374151` |
| Hover | `#F9FAFB` | `#9CA3AF` | `#1F2937` |
| Active | `#F3F4F6` | `#6B7280` | `#1F2937` |
| Focus | `transparent` | `#1E40AF` + ring | `#374151` |
| Disabled | `transparent` | `#E5E7EB` | `#9CA3AF` |

### Ghost Button
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `transparent` | `transparent` | `#374151` |
| Hover | `#F3F4F6` | `transparent` | `#1F2937` |
| Active | `#E5E7EB` | `transparent` | `#1F2937` |
| Focus | `transparent` | `transparent` + ring | `#374151` |
| Disabled | `transparent` | `transparent` | `#9CA3AF` |

### Danger Button
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `#DC2626` | `#DC2626` | `#FFFFFF` |
| Hover | `#B91C1C` | `#B91C1C` | `#FFFFFF` |
| Active | `#991B1B` | `#991B1B` | `#FFFFFF` |
| Disabled | `#FCA5A5` | `#FCA5A5` | `#FFFFFF` |

### Success Button
| State | Background | Border | Text Color |
|-------|------------|--------|------------|
| Default | `#059669` | `#059669` | `#FFFFFF` |
| Hover | `#047857` | `#047857` | `#FFFFFF` |
| Active | `#065F46` | `#065F46` | `#FFFFFF` |
| Disabled | `#6EE7B7` | `#6EE7B7` | `#FFFFFF` |

## Typography
| Property | Value |
|----------|-------|
| Font Family | Inter |
| Font Weight | 600 |
| Line Height | 1.5 |
| Letter Spacing | 0 |

## Border Radius
| Size | Radius |
|------|--------|
| Small | 6px |
| Medium | 8px |
| Large | 10px |
| XLarge | 12px |

## Focus Ring
- **Offset**: 2px
- **Width**: 2px
- **Color**: `#1E40AF` with 50% opacity
- **Style**: `box-shadow: 0 0 0 2px rgba(30, 64, 175, 0.5)`

## Transitions
- **Property**: all
- **Duration**: 150ms
- **Timing**: ease-out

## Wireframes

### Standard Buttons
```
┌─────────────────────────────────────────────────────────────────┐
│  Small (32px)                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Button  │  │  Button  │  │  Button  │  │  Button  │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│     Primary      Secondary     Outline       Ghost              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Medium (40px)                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │   Button   │  │   Button   │  │   Button   │  │   Button   │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
│      Primary       Secondary      Outline         Ghost         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Large (48px)                                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │    Button    │  │    Button    │  │    Button    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│       Primary         Secondary        Outline                   │
└─────────────────────────────────────────────────────────────────┘
```

### Buttons with Icons
```
┌───────────────────────────────────────────────────────────────┐
│  Icon Left          Icon Right         Icon Only              │
│  ┌───────────────┐  ┌───────────────┐  ┌─────┐               │
│  │ [+]  Button   │  │  Button   [→] │  │ [+] │               │
│  └───────────────┘  └───────────────┘  └─────┘               │
└───────────────────────────────────────────────────────────────┘
```

### Loading State
```
┌───────────────────────────────────────────────────────────────┐
│  ┌─────────────────┐                                          │
│  │ [◌] Loading...  │                                          │
│  └─────────────────┘                                          │
│                                                                │
│  Spinner replaces icon or appears at start                    │
│  Text can change to indicate loading                          │
└───────────────────────────────────────────────────────────────┘
```

### Full Width Button
```
┌───────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐│
│  │                      Button Text                          ││
│  └───────────────────────────────────────────────────────────┘│
│  width: 100%                                                   │
└───────────────────────────────────────────────────────────────┘
```

## Accessibility

### Requirements
- Minimum touch target: 44x44px
- Visible focus indicator
- Sufficient color contrast (WCAG AA: 4.5:1)
- Disabled buttons should use `aria-disabled` for screen readers
- Loading state should announce via `aria-live`

### ARIA Attributes
```html
<!-- Standard button -->
<button type="button">Click me</button>

<!-- Disabled button -->
<button type="button" disabled aria-disabled="true">Disabled</button>

<!-- Loading button -->
<button type="button" aria-busy="true" aria-live="polite">
  <span class="spinner"></span>
  Loading...
</button>

<!-- Icon-only button -->
<button type="button" aria-label="Add item">
  <svg>...</svg>
</button>
```

## Best Practices

### Do
- Use primary buttons for main CTAs
- Limit to one primary button per section
- Use descriptive, action-oriented text
- Maintain consistent sizing within context

### Don't
- Use multiple primary buttons together
- Use vague text like "Click here"
- Disable buttons without explanation
- Use icon-only buttons without labels (unless universally understood)
