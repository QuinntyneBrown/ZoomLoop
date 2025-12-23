# Badge Component

## Overview
Badges are small status indicators used to highlight labels, counts, or categorizations. They appear alongside other content to provide additional context.

## Badge Types

| Type | Usage |
|------|-------|
| Status | Indicate state (new, sold, reserved) |
| Count | Show quantity or notification count |
| Category | Label vehicle types or features |
| Tag | Highlight attributes or filters |

## Component Variants

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| Primary | `#1E40AF` | `#FFFFFF` | none |
| Secondary | `#F3F4F6` | `#374151` | none |
| Success | `#D1FAE5` | `#065F46` | none |
| Warning | `#FEF3C7` | `#92400E` | none |
| Danger | `#FEE2E2` | `#991B1B` | none |
| Info | `#DBEAFE` | `#1E40AF` | none |
| Outline | `transparent` | `#374151` | `#D1D5DB` |

## Sizes

| Size | Height | Padding X | Font Size | Border Radius |
|------|--------|-----------|-----------|---------------|
| Small | 20px | 6px | 11px | 4px |
| Medium | 24px | 8px | 12px | 6px |
| Large | 28px | 10px | 13px | 6px |

## Visual Specifications

### Typography
| Property | Value |
|----------|-------|
| Font Family | Inter |
| Font Weight | 500 |
| Line Height | 1 |
| Letter Spacing | 0.02em |
| Text Transform | Uppercase (for status) |

### With Icon
- Icon size: 12px (sm), 14px (md), 16px (lg)
- Icon-text gap: 4px

### Dot Indicator
- Dot size: 6px
- Dot-text gap: 6px

## Wireframes

### Basic Badges
```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Primary   │  │  Secondary  │  │   Success   │
└─────────────┘  └─────────────┘  └─────────────┘

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Warning   │  │   Danger    │  │    Info     │
└─────────────┘  └─────────────┘  └─────────────┘
```

### With Icons
```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ [✓]  Verified │  │ [⭐] Featured │  │ [⚡] Electric │
└───────────────┘  └───────────────┘  └───────────────┘
```

### Dot Indicators
```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ ● Available   │  │ ● Reserved    │  │ ● Sold        │
│   (green)     │  │   (yellow)    │  │   (red)       │
└───────────────┘  └───────────────┘  └───────────────┘
```

### Count Badges
```
┌─────┐  ┌─────┐  ┌──────┐
│  3  │  │ 12  │  │ 99+  │
└─────┘  └─────┘  └──────┘
```

### Removable Tags
```
┌─────────────────┐  ┌─────────────────┐
│  SUV       [×]  │  │  2020-2023 [×]  │
└─────────────────┘  └─────────────────┘
```

## Use Cases

### Vehicle Card
```
┌─────────────────────────────────────────────────────┐
│  ┌──────────────────────────────────────────────┐  │
│  │                                              │  │
│  │   [NEW ARRIVAL]  [CERTIFIED]                 │  │
│  │                                              │  │
│  │              Vehicle Image                   │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  2021 Honda Civic EX                               │
│  $24,500                                            │
│                                                     │
│  [45K km] [Automatic] [FWD]                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Filter Selection
```
Active Filters:
┌───────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────┐
│ SUV    [×]│ │ Honda  [×]│ │ 2020+  [×]│ │ Clear All   │
└───────────┘ └───────────┘ └───────────┘ └─────────────┘
```

## Accessibility

### Requirements
- Minimum touch target for removable badges: 24px
- Color contrast meets WCAG AA (4.5:1)
- Screen reader announces badge content

### ARIA Attributes
```html
<!-- Status badge -->
<span class="badge badge--success" role="status">
  Available
</span>

<!-- Count badge -->
<span class="badge badge--primary" aria-label="3 notifications">
  3
</span>

<!-- Removable tag -->
<span class="badge badge--tag">
  SUV
  <button aria-label="Remove SUV filter" class="badge__remove">
    ×
  </button>
</span>
```

## Animation

### Removable Badge
- Remove: 150ms ease-out, fade + scale(1 → 0.8)

### Count Update
- Pulse animation when count changes
- Duration: 200ms
