# Hero Section Component

## Overview
The hero section is the primary visual and messaging element above the fold. It captures attention, communicates the core value proposition, and provides immediate access to vehicle search.

## Component States

| State | Description |
|-------|-------------|
| Default | Full hero with imagery, headline, and search |
| Promotional | With overlay banner for special offers |
| Video Background | Animated or video background variant |
| Mobile | Condensed layout for smaller screens |

## Visual Specifications

### Dimensions
| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Height | 600px | 500px | 450px |
| Max Width | Full viewport | Full viewport | Full viewport |
| Content Width | 1200px | 100% | 100% |
| Padding | 0 24px | 0 20px | 0 16px |

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Background | Gradient | `linear-gradient(135deg, #1E40AF, #0F172A)` |
| Overlay | Semi-transparent | `rgba(15, 23, 42, 0.6)` |
| Headline | White | `#FFFFFF` |
| Subheadline | Light Gray | `rgba(255, 255, 255, 0.8)` |
| Stats Text | White | `#FFFFFF` |
| Stats Label | Light Gray | `rgba(255, 255, 255, 0.7)` |

### Typography
| Element | Font | Size (Desktop) | Size (Mobile) | Weight |
|---------|------|----------------|---------------|--------|
| Headline | Inter | 56px | 32px | 700 |
| Subheadline | Inter | 20px | 16px | 400 |
| Stat Number | Inter | 36px | 24px | 700 |
| Stat Label | Inter | 14px | 12px | 500 |

### Spacing
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│                                   ← 80px from header →                               │
│                                                                                       │
│                    ┌───────────────────────────────────────┐                         │
│                    │         Primary Headline              │                         │
│                    │      ← 16px line height gap →         │                         │
│                    │         Secondary Text                │                         │
│                    └───────────────────────────────────────┘                         │
│                                                                                       │
│                                   ← 32px gap →                                        │
│                                                                                       │
│                    ┌───────────────────────────────────────┐                         │
│                    │           Search Component            │                         │
│                    └───────────────────────────────────────┘                         │
│                                                                                       │
│                                   ← 48px gap →                                        │
│                                                                                       │
│        ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐             │
│        │  Stat 1  │ 48px│  Stat 2  │ 48px│  Stat 3  │ 48px│  Stat 4  │             │
│        └──────────┘     └──────────┘     └──────────┘     └──────────┘             │
│                                                                                       │
│                                   ← 80px from bottom →                               │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Wireframe

### Desktop (1440px)
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  [Header Navigation - fixed on top]                                                   │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│                              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                               │
│                              ▓  Background Image    ▓                               │
│                              ▓  with Gradient       ▓                               │
│                              ▓  Overlay             ▓                               │
│                              ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓                               │
│                                                                                       │
│                      Find Your Perfect Car                                           │
│                                                                                       │
│              Browse 1,000+ quality used vehicles with                                │
│              free delivery and a 10-day money-back guarantee                         │
│                                                                                       │
│      ┌─────────────────────────────────────────────────────────────────┐             │
│      │ [🔍] Search for make, model, or keyword...   [Filters] [Search]│             │
│      └─────────────────────────────────────────────────────────────────┘             │
│                                                                                       │
│         1,000+           4.8★            210-Point         10-Day                    │
│         Vehicles         Rating          Inspection        Guarantee                 │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────────────────┐
│  [Header]                             │
├───────────────────────────────────────┤
│                                        │
│                                        │
│                                        │
│       Find Your Perfect Car            │
│                                        │
│  Browse 1,000+ quality used vehicles   │
│  with free delivery and a 10-day       │
│  money-back guarantee                  │
│                                        │
│  ┌─────────────────────────────────┐  │
│  │ [🔍] Search for vehicles...     │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │           Search               │  │
│  └─────────────────────────────────┘  │
│                                        │
│    1,000+       4.8★       210pt       │
│   Vehicles     Rating   Inspection     │
│                                        │
└───────────────────────────────────────┘
```

## Content Sections

### Headline
- Primary: Bold, attention-grabbing statement
- Secondary: Supporting value proposition (1-2 sentences)

### Trust Stats
| Stat | Value | Label |
|------|-------|-------|
| Inventory | 1,000+ | Vehicles |
| Rating | 4.8★ | Customer Rating |
| Inspection | 210-Point | Inspection |
| Guarantee | 10-Day | Money-Back |

### Search Integration
- Full search bar component embedded
- Quick filter pills (optional)
- Or link to browse inventory

## Background Options

### Image Background
- High-quality vehicle photography
- Gradient overlay: `linear-gradient(135deg, rgba(30, 64, 175, 0.9), rgba(15, 23, 42, 0.95))`
- Image position: center center
- Image size: cover

### Video Background
- Looped, muted video
- Fallback to image for low bandwidth
- Same gradient overlay

### Solid Gradient
- Pure gradient background (no image)
- `linear-gradient(135deg, #1E40AF 0%, #0F172A 100%)`

## Animation

### On Load
| Element | Animation | Delay | Duration |
|---------|-----------|-------|----------|
| Headline | Fade up | 0ms | 600ms |
| Subheadline | Fade up | 150ms | 600ms |
| Search Bar | Fade up | 300ms | 600ms |
| Stats | Fade up | 450ms | 600ms |

### Stats Counter (Optional)
- Number counting animation from 0 to target
- Duration: 2 seconds
- Easing: ease-out

## Promotional Banner (Optional)

### Overlay Banner
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  🎄 Holiday Sale: Up to $2,000 off select vehicles. Ends Dec 31.      [Shop Now →] │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

- Position: Above or below header
- Background: Accent color or gradient
- Dismissible with close button
- Persists via cookie/localStorage

## Accessibility

### Requirements
- Heading hierarchy (h1 for main headline)
- Alt text for background images
- Reduced motion support
- Keyboard accessible search
- Sufficient color contrast on overlay

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .hero * {
    animation: none !important;
    transition: none !important;
  }
}
```

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| > 1024px | Full layout, horizontal stats |
| 768-1024px | Smaller typography, stacked search |
| < 768px | Mobile layout, 2x2 stats grid |
