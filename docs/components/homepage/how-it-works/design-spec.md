# How It Works Section

## Overview
The "How It Works" section explains the car buying process in simple, sequential steps. It builds trust by showing the simplicity and transparency of the platform.

## Component States

| State | Description |
|-------|-------------|
| Default | Static steps display |
| Animated | Steps animate in on scroll |
| Interactive | Steps expandable for more detail |

## Visual Specifications

### Dimensions
| Property | Value |
|----------|-------|
| Section Padding | 80px 0 (desktop), 48px 0 (mobile) |
| Max Width | 1200px |
| Step Card Width | 280px |
| Step Gap | 32px |
| Icon Size | 64px |

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Section Background | Light Gray | `#F9FAFB` |
| Card Background | White | `#FFFFFF` |
| Icon Background | Light Blue | `#EFF6FF` |
| Icon Color | Primary Blue | `#1E40AF` |
| Step Number | Primary Blue | `#1E40AF` |
| Title | Dark Gray | `#1F2937` |
| Description | Medium Gray | `#6B7280` |
| Connector Line | Light Gray | `#E5E7EB` |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section Title | Inter | 36px | 700 | `#1F2937` |
| Section Subtitle | Inter | 18px | 400 | `#6B7280` |
| Step Number | Inter | 14px | 700 | `#1E40AF` |
| Step Title | Inter | 20px | 600 | `#1F2937` |
| Step Description | Inter | 15px | 400 | `#6B7280` |

### Spacing
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                       80px                                             │
│                                                                                         │
│                          How It Works                                                   │
│                                       ↕ 12px                                           │
│            Buy your next car in 3 simple steps                                         │
│                                                                                         │
│                                       48px                                             │
│                                                                                         │
│    ┌────────────┐   ─────────────   ┌────────────┐   ─────────────   ┌────────────┐   │
│    │            │                   │            │                   │            │   │
│    │   Step 1   │                   │   Step 2   │                   │   Step 3   │   │
│    │            │                   │            │                   │            │   │
│    └────────────┘                   └────────────┘                   └────────────┘   │
│                       32px gap                            32px gap                     │
│                                                                                         │
│                                       80px                                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

## Wireframe

### Desktop Layout (3 Steps)
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                         │
│                              How It Works                                               │
│                   Buy your next car in 3 simple steps                                   │
│                                                                                         │
│    ┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐      │
│    │                  │         │                  │         │                  │      │
│    │     ┌────┐       │ ────→   │     ┌────┐       │ ────→   │     ┌────┐       │      │
│    │     │ 🔍 │       │         │     │ 📋 │       │         │     │ 🚗 │       │      │
│    │     └────┘       │         │     └────┘       │         │     └────┘       │      │
│    │                  │         │                  │         │                  │      │
│    │  Step 1          │         │  Step 2          │         │  Step 3          │      │
│    │  Browse & Choose │         │  Finance Online  │         │  Get It Delivered│      │
│    │                  │         │                  │         │                  │      │
│    │  Search our      │         │  Get pre-approved│         │  We deliver to   │      │
│    │  inventory of    │         │  in minutes with │         │  your door with  │      │
│    │  1,000+ vehicles │         │  transparent     │         │  a 10-day        │      │
│    │                  │         │  pricing         │         │  guarantee       │      │
│    │                  │         │                  │         │                  │      │
│    └──────────────────┘         └──────────────────┘         └──────────────────┘      │
│                                                                                         │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile Layout (Vertical)
```
┌───────────────────────────────────────┐
│                                        │
│          How It Works                  │
│   Buy your next car in 3 simple steps  │
│                                        │
│    ┌────────────────────────────────┐  │
│    │     ┌────┐                     │  │
│    │     │ 🔍 │  Step 1             │  │
│    │     └────┘                     │  │
│    │           Browse & Choose      │  │
│    │                                │  │
│    │     Search our inventory of    │  │
│    │     1,000+ vehicles            │  │
│    └────────────────────────────────┘  │
│                   │                    │
│                   ▼                    │
│    ┌────────────────────────────────┐  │
│    │     ┌────┐                     │  │
│    │     │ 📋 │  Step 2             │  │
│    │     └────┘                     │  │
│    │           Finance Online       │  │
│    │                                │  │
│    │     Get pre-approved in        │  │
│    │     minutes with transparent   │  │
│    │     pricing                    │  │
│    └────────────────────────────────┘  │
│                   │                    │
│                   ▼                    │
│    ┌────────────────────────────────┐  │
│    │     ┌────┐                     │  │
│    │     │ 🚗 │  Step 3             │  │
│    │     └────┘                     │  │
│    │           Get It Delivered     │  │
│    │                                │  │
│    │     We deliver to your door    │  │
│    │     with a 10-day guarantee    │  │
│    └────────────────────────────────┘  │
│                                        │
└───────────────────────────────────────┘
```

## Step Content

### Step 1: Browse & Choose
- **Icon**: Magnifying glass / Search
- **Title**: Browse & Choose
- **Description**: Search our inventory of 1,000+ quality used vehicles. Every car comes with a detailed inspection report and CARFAX history.

### Step 2: Finance Online
- **Icon**: Document / Calculator
- **Title**: Finance Online
- **Description**: Get pre-approved for financing in minutes with no impact to your credit. See transparent pricing with no hidden fees.

### Step 3: Get It Delivered
- **Icon**: Car / Delivery truck
- **Title**: Get It Delivered
- **Description**: We deliver your car right to your door. Enjoy a 10-day/750km money-back guarantee to make sure you love it.

## Connector Lines

### Desktop
- Dashed or solid line between steps
- Color: `#E5E7EB`
- Arrow indicator pointing to next step
- Positioned at center height of cards

### Mobile
- Vertical line connecting steps
- Centered between cards
- Arrow pointing down

## Step Card Anatomy
```
┌─────────────────────────────────────┐
│              24px padding            │
│    ┌───────────────────────────┐    │
│    │                           │    │
│    │    ┌───────────────┐      │    │
│    │    │    64x64      │      │    │  ← Icon container
│    │    │     Icon      │      │    │
│    │    └───────────────┘      │    │
│    │                           │    │
│    │    ↕ 20px                 │    │
│    │                           │    │
│    │    Step 1                 │    │  ← Step label
│    │    ↕ 8px                  │    │
│    │    Browse & Choose        │    │  ← Title
│    │    ↕ 12px                 │    │
│    │    Search our inventory   │    │  ← Description
│    │    of 1,000+ quality      │    │
│    │    used vehicles.         │    │
│    │                           │    │
│    └───────────────────────────┘    │
│              24px padding            │
└─────────────────────────────────────┘
```

## Animation

### Scroll Animation
| Element | Animation | Trigger |
|---------|-----------|---------|
| Section Title | Fade up | 20% in viewport |
| Step 1 | Fade up + slide right | 30% in viewport |
| Step 2 | Fade up + slide right | 40% in viewport |
| Step 3 | Fade up + slide right | 50% in viewport |

### Stagger Timing
- Delay between steps: 150ms
- Duration per step: 500ms
- Easing: ease-out

## Alternative Layouts

### Timeline Layout
```
    Step 1 ─────●───── Step 2 ─────●───── Step 3
                │                  │
         ┌──────┴──────┐    ┌──────┴──────┐
         │  Card 1     │    │  Card 2     │
         └─────────────┘    └─────────────┘
```

### Numbered Circles
```
    ①─────────────②─────────────③
    │             │             │
   Card          Card          Card
```

## Accessibility

### Requirements
- Semantic list markup (ol/li)
- Descriptive headings
- Alt text for icons
- Keyboard navigable if interactive

### ARIA
```html
<section aria-labelledby="how-it-works-title">
  <h2 id="how-it-works-title">How It Works</h2>
  <ol class="steps">
    <li class="step">
      <span class="step-number" aria-hidden="true">1</span>
      <h3>Browse & Choose</h3>
      <p>Search our inventory...</p>
    </li>
    ...
  </ol>
</section>
```

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| > 992px | Horizontal 3-column |
| 768-992px | Horizontal with smaller cards |
| < 768px | Vertical stacked |
