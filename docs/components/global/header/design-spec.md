# Site Header Component

## Overview
The site header is a fixed navigation component that provides primary site navigation, branding, and key user actions. It remains visible at the top of the viewport across all pages.

## Component States

| State | Description |
|-------|-------------|
| Default | Standard header with full navigation |
| Scrolled | Condensed header with shadow on scroll |
| Mobile | Hamburger menu with slide-out navigation |
| Logged In | Shows user avatar and account dropdown |
| Logged Out | Shows Sign In / Sign Up CTAs |

## Visual Specifications

### Dimensions
- **Height**: 72px (desktop), 64px (mobile)
- **Max Width**: 1440px (centered)
- **Padding**: 0 24px (desktop), 0 16px (mobile)

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Background | White | `#FFFFFF` |
| Background (scrolled) | White with shadow | `#FFFFFF` |
| Logo Text | Primary Blue | `#1E40AF` |
| Nav Links | Dark Gray | `#374151` |
| Nav Links (hover) | Primary Blue | `#1E40AF` |
| CTA Button | Primary Blue | `#1E40AF` |
| CTA Button (hover) | Dark Blue | `#1E3A8A` |

### Typography
| Element | Font | Size | Weight | Line Height |
|---------|------|------|--------|-------------|
| Logo | Inter | 24px | 700 | 1.2 |
| Nav Links | Inter | 14px | 500 | 1.5 |
| CTA Button | Inter | 14px | 600 | 1.5 |

### Spacing
```
┌─────────────────────────────────────────────────────────────────────────┐
│ 24px │ LOGO │ ─── 48px ─── │ NAV ITEMS (32px gap) │ ─── auto ─── │ CTAs │ 24px │
└─────────────────────────────────────────────────────────────────────────┘
        ↑                              ↑                           ↑
     Logo Area                   Navigation                   Actions Area
```

### Shadow (Scrolled State)
- **Box Shadow**: `0 2px 8px rgba(0, 0, 0, 0.08)`

## Wireframe

### Desktop (1440px)
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                       │
│   ┌────────┐     Browse ▼    Sell Your Car    How It Works    Financing              │
│   │  LOGO  │                                                          [Sign In] [Buy]│
│   └────────┘                                                                          │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
     ↑ 72px height
```

### Tablet (768px)
```
┌────────────────────────────────────────────────────────────┐
│                                                             │
│   ┌────────┐     Browse ▼    Sell    [Sign In] [Buy] [☰]   │
│   │  LOGO  │                                                │
│   └────────┘                                                │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Mobile (375px)
```
┌───────────────────────────────────────┐
│                                        │
│   ┌────────┐               [☰]        │
│   │  LOGO  │                          │
│   └────────┘                          │
│                                        │
└───────────────────────────────────────┘
```

## Interaction States

### Navigation Links
- **Default**: `color: #374151`
- **Hover**: `color: #1E40AF; text-decoration: underline`
- **Active**: `color: #1E40AF; font-weight: 600`

### Dropdown Trigger
- **Default**: Shows chevron down icon
- **Open**: Chevron rotates 180°, dropdown panel visible
- **Transition**: 200ms ease-out

### Mobile Menu
- **Trigger**: Hamburger icon (3 horizontal lines)
- **Open State**: X icon, slide-out panel from right
- **Overlay**: Semi-transparent black overlay (`rgba(0,0,0,0.5)`)
- **Animation**: 300ms slide-in from right

## Accessibility
- ARIA labels on all interactive elements
- Skip to main content link (visually hidden)
- Keyboard navigation support
- Focus indicators visible
- Mobile menu trap focus when open

## Responsive Breakpoints
| Breakpoint | Behavior |
|------------|----------|
| > 1024px | Full desktop navigation |
| 768px - 1024px | Condensed navigation, fewer items |
| < 768px | Mobile hamburger menu |

## Z-Index
- **Header**: `z-index: 1000`
- **Dropdown**: `z-index: 1001`
- **Mobile Menu**: `z-index: 1002`
- **Mobile Overlay**: `z-index: 1001`
