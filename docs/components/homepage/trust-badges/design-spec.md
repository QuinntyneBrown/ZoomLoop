# Trust Badges Section

## Overview
The trust badges section displays key value propositions and guarantees that build customer confidence. It typically appears below the hero or vehicle listings.

## Component States

| State | Description |
|-------|-------------|
| Default | Static badges display |
| Animated | Icons animate on scroll |
| Hover | Badge slightly elevates |

## Visual Specifications

### Dimensions
| Property | Value |
|----------|-------|
| Section Padding | 48px 0 |
| Max Width | 1200px |
| Badge Gap | 32px |
| Icon Size | 48px |

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Background | White | `#FFFFFF` |
| Icon Background | Light Blue | `#EFF6FF` |
| Icon Color | Primary Blue | `#1E40AF` |
| Title | Dark Gray | `#1F2937` |
| Description | Medium Gray | `#6B7280` |
| Border (optional) | Light Gray | `#E5E7EB` |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Badge Title | Inter | 16px | 600 |
| Badge Description | Inter | 14px | 400 |

## Wireframe

### Horizontal Layout (4 Badges)
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│   ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   │    ┌────┐        │  │    ┌────┐        │  │    ┌────┐        │  │    ┌────┐        │
│   │    │ ✓  │        │  │    │ 🚚 │        │  │    │ 🔒 │        │  │    │ ↩  │        │
│   │    └────┘        │  │    └────┘        │  │    └────┘        │  │    └────┘        │
│   │                  │  │                  │  │                  │  │                  │
│   │  210-Point       │  │  Free Delivery   │  │  Secure          │  │  10-Day          │
│   │  Inspection      │  │                  │  │  Financing       │  │  Return          │
│   │                  │  │  Delivered to    │  │                  │  │                  │
│   │  Every car       │  │  your door at    │  │  Pre-approved    │  │  Love it or      │
│   │  thoroughly      │  │  no extra cost   │  │  in minutes      │  │  return it       │
│   │  inspected       │  │                  │  │                  │  │                  │
│   └──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### With Dividers
```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│    [✓] 210-Point Inspection    │    [🚚] Free Delivery    │    [↩] 10-Day Return    │
│                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

## Badge Content

### Badge 1: Inspection
- **Icon**: Checkmark / Shield
- **Title**: 210-Point Inspection
- **Description**: Every car is thoroughly inspected and reconditioned

### Badge 2: Free Delivery
- **Icon**: Truck / Delivery
- **Title**: Free Delivery
- **Description**: Delivered to your door at no extra cost

### Badge 3: Secure Financing
- **Icon**: Lock / Dollar
- **Title**: Secure Financing
- **Description**: Pre-approved in minutes with no credit impact

### Badge 4: Money-Back Guarantee
- **Icon**: Return arrow / Shield
- **Title**: 10-Day Return
- **Description**: Love it or return it, no questions asked

## Spacing
```
Badge Anatomy:
┌─────────────────────────────────────┐
│           24px padding              │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │    ┌───────────────┐      │   │  ← Icon container
│    │    │    48x48      │      │   │
│    │    │     Icon      │      │   │
│    │    └───────────────┘      │   │
│    │                           │   │
│    │    ↕ 16px                 │   │
│    │                           │   │
│    │    Badge Title            │   │  ← Title
│    │    ↕ 8px                  │   │
│    │    Description text       │   │  ← Description
│    │                           │   │
│    └───────────────────────────┘   │
│           24px padding              │
└─────────────────────────────────────┘
```

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| > 992px | 4 columns, horizontal |
| 768-992px | 2x2 grid |
| < 768px | Vertical stack or 2 columns |

## Accessibility

### Requirements
- Icons have aria-hidden or descriptive alt
- Text provides context without icons
- Sufficient color contrast
