# Footer Component

## Overview
The site footer provides secondary navigation, company information, legal links, and social media connections. It appears at the bottom of every page.

## Component States

| State | Description |
|-------|-------------|
| Default | Standard footer with all sections |
| Compact | Simplified footer for checkout flows |
| Newsletter Submitted | Success state after email signup |

## Sections

| Section | Content |
|---------|---------|
| Logo & Description | Company logo and brief tagline |
| Navigation Links | Organized into columns by category |
| Newsletter Signup | Email input with submit button |
| Social Media | Links to social platforms |
| Legal | Copyright, privacy policy, terms |
| App Download | Links to mobile app stores |

## Visual Specifications

### Dimensions
- **Padding Top**: 64px
- **Padding Bottom**: 32px
- **Max Width**: 1440px (centered)
- **Side Padding**: 24px (desktop), 16px (mobile)

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Background | Dark Navy | `#0F172A` |
| Primary Text | White | `#FFFFFF` |
| Secondary Text | Gray | `#94A3B8` |
| Link Hover | Primary Blue | `#3B82F6` |
| Divider | Border Gray | `#334155` |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Section Title | Inter | 14px | 600 | `#FFFFFF` |
| Link | Inter | 14px | 400 | `#94A3B8` |
| Link Hover | Inter | 14px | 400 | `#3B82F6` |
| Copyright | Inter | 13px | 400 | `#64748B` |
| Description | Inter | 14px | 400 | `#94A3B8` |

### Spacing
```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                64px padding top                              │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐ │
│  │    Logo &   │  │  Browse  │  │  Company │  │  Support │  │ Newsletter │ │
│  │ Description │  │          │  │          │  │          │  │            │ │
│  │             │  │  Link    │  │  Link    │  │  Link    │  │ [Email   ] │ │
│  │ Social Icons│  │  Link    │  │  Link    │  │  Link    │  │ [Submit  ] │ │
│  └─────────────┘  │  Link    │  │  Link    │  │  Link    │  └────────────┘ │
│       200px       └──────────┘  └──────────┘  └──────────┘       280px     │
│                      160px        160px         160px                       │
│                                                                              │
│  ← 24px →       ← 48px between columns →                           ← 24px →│
├──────────────────────────────────────────────────────────────────────────────┤
│                           32px padding                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  Divider Line (1px)                                                          │
├──────────────────────────────────────────────────────────────────────────────┤
│                           24px padding                                       │
├──────────────────────────────────────────────────────────────────────────────┤
│  © 2024 Clutch. All rights reserved.    Privacy Policy | Terms | Cookies   │
├──────────────────────────────────────────────────────────────────────────────┤
│                           32px padding bottom                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Wireframe

### Desktop (1440px)
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████████████████████████████████████  │
│                                                                                       │
│  ┌────────┐                                                                          │
│  │  LOGO  │   Browse        Company       Support         Stay Connected             │
│  └────────┘                                                                          │
│              All Vehicles   About Us      Help Center     ┌──────────────────────┐  │
│  Canada's    SUVs           Careers       FAQ             │ Email                 │  │
│  #1 online   Sedans         Press         Contact Us      └──────────────────────┘  │
│  car         Trucks         Investors     Returns         ┌──────────┐              │
│  marketplace Electric       Blog                          │Subscribe │              │
│                                                            └──────────┘              │
│  [f] [in] [ig] [yt]                                                                  │
│                                                                                       │
│  ─────────────────────────────────────────────────────────────────────────────────   │
│                                                                                       │
│  © 2024 Clutch Technologies Inc.              Privacy Policy · Terms · Accessibility │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────────────────┐
│                                        │
│  ┌────────┐                           │
│  │  LOGO  │                           │
│  └────────┘                           │
│                                        │
│  Canada's #1 online car marketplace   │
│                                        │
│  [f] [in] [ig] [yt]                   │
│                                        │
│  ─────────────────────────────────    │
│                                        │
│  Browse                           [+] │
│  ─────────────────────────────────    │
│  Company                          [+] │
│  ─────────────────────────────────    │
│  Support                          [+] │
│  ─────────────────────────────────    │
│                                        │
│  Stay Connected                       │
│  ┌─────────────────────────────────┐ │
│  │ Enter your email                 │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │         Subscribe               │ │
│  └─────────────────────────────────┘ │
│                                        │
│  ─────────────────────────────────    │
│                                        │
│  © 2024 Clutch                        │
│  Privacy · Terms · Accessibility      │
│                                        │
└───────────────────────────────────────┘
```

## Link Categories

### Browse
- All Vehicles
- SUVs & Crossovers
- Sedans & Coupes
- Trucks & Vans
- Electric Vehicles
- Luxury Vehicles

### Company
- About Us
- Careers
- Press
- Investors
- Blog
- Partners

### Support
- Help Center
- FAQ
- Contact Us
- Returns
- Warranty
- Financing

## Social Media Icons
| Platform | Icon Size | Color Default | Color Hover |
|----------|-----------|---------------|-------------|
| Facebook | 20px | `#94A3B8` | `#FFFFFF` |
| LinkedIn | 20px | `#94A3B8` | `#FFFFFF` |
| Instagram | 20px | `#94A3B8` | `#FFFFFF` |
| YouTube | 20px | `#94A3B8` | `#FFFFFF` |
| Twitter/X | 20px | `#94A3B8` | `#FFFFFF` |

## Newsletter Signup

### Input Field
- **Height**: 44px
- **Background**: `#1E293B`
- **Border**: `1px solid #334155`
- **Border Radius**: 8px
- **Placeholder**: "Enter your email"
- **Focus Border**: `#3B82F6`

### Submit Button
- **Height**: 44px
- **Background**: `#3B82F6`
- **Text**: "Subscribe"
- **Border Radius**: 8px

### Success State
- Input replaced with success message
- Icon: checkmark
- Text: "Thanks for subscribing!"

## Accessibility
- All links have descriptive text
- Social media links include `aria-label`
- Accordion sections on mobile use proper ARIA attributes
- Focus indicators visible on all interactive elements
- Skip links available for keyboard navigation

## Responsive Behavior

| Breakpoint | Layout Change |
|------------|---------------|
| > 1024px | Full multi-column layout |
| 768-1024px | 3 columns, newsletter stacked |
| < 768px | Single column with accordions |
