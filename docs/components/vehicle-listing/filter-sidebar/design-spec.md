# Filter Sidebar Component

## Overview
The filter sidebar allows users to refine vehicle search results using various criteria. It supports multiple filter types and can be used as a sidebar on desktop or a slide-out drawer on mobile.

## Component States

| State | Description |
|-------|-------------|
| Default | All filters collapsed or partially expanded |
| Expanded | Individual filter sections expanded |
| Applied | Filters active with clear indicators |
| Mobile Drawer | Full-screen filter overlay |
| Loading | Skeleton while filters load |

## Filter Types

| Type | Controls |
|------|----------|
| Range Slider | Price, Mileage, Year |
| Checkbox List | Make, Model, Body Type |
| Radio Group | Fuel Type, Transmission |
| Toggle | Certified, Electric Only |
| Multi-Select | Features, Colors |

## Visual Specifications

### Dimensions
| Property | Value |
|----------|-------|
| Sidebar Width | 280px (desktop) |
| Section Padding | 16px |
| Section Gap | 0 (accordion) |
| Checkbox Size | 18px |

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Background | White | `#FFFFFF` |
| Border | Light Gray | `#E5E7EB` |
| Section Title | Dark Gray | `#1F2937` |
| Label | Medium Gray | `#4B5563` |
| Selected | Primary Blue | `#1E40AF` |
| Count | Light Gray | `#9CA3AF` |
| Slider Track | Light Gray | `#E5E7EB` |
| Slider Fill | Primary Blue | `#1E40AF` |

### Typography
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Sidebar Title | Inter | 18px | 600 |
| Section Title | Inter | 14px | 600 |
| Label | Inter | 14px | 400 |
| Count | Inter | 13px | 400 |
| Clear All | Inter | 13px | 500 |

## Wireframe

### Desktop Sidebar
```
┌─────────────────────────────────┐
│                                 │
│  Filters            [Clear All] │
│                                 │
├─────────────────────────────────┤
│  Price Range                [−] │
├─────────────────────────────────┤
│                                 │
│  $5,000 ─────●────● $50,000    │
│                                 │
│  Min: [     ] Max: [     ]     │
│                                 │
├─────────────────────────────────┤
│  Make                       [+] │
├─────────────────────────────────┤
│  Model                      [+] │
├─────────────────────────────────┤
│  Year                       [−] │
├─────────────────────────────────┤
│                                 │
│  2020 ─────────●────● 2024     │
│                                 │
├─────────────────────────────────┤
│  Body Type                  [−] │
├─────────────────────────────────┤
│                                 │
│  ☑ SUV                    (234) │
│  ☐ Sedan                  (156) │
│  ☐ Truck                   (89) │
│  ☐ Hatchback               (45) │
│  ☐ Van                     (23) │
│  [Show more]                    │
│                                 │
├─────────────────────────────────┤
│  Mileage                    [+] │
├─────────────────────────────────┤
│  Transmission               [−] │
├─────────────────────────────────┤
│                                 │
│  ○ Any                         │
│  ● Automatic              (412) │
│  ○ Manual                  (45) │
│                                 │
├─────────────────────────────────┤
│  Features                   [+] │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │     Apply Filters (12)     ││
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

### Mobile Drawer
```
┌───────────────────────────────────────┐
│  ← Filters                  [Clear]   │
├───────────────────────────────────────┤
│                                        │
│  Applied Filters                       │
│  [SUV ×] [Honda ×] [2020-2023 ×]      │
│                                        │
├───────────────────────────────────────┤
│  Price Range                      [−] │
│  ─────────────────────────────────    │
│  ...                                   │
├───────────────────────────────────────┤
│  ...                                   │
│                                        │
├───────────────────────────────────────┤
│                                        │
│  ┌─────────────────────────────────┐  │
│  │    Show 234 Results             │  │
│  └─────────────────────────────────┘  │
│                                        │
└───────────────────────────────────────┘
```

## Filter Section Structure
```
┌─────────────────────────────────────┐
│                                      │
│  Section Title                  [±]  │
│                                      │
├─────────────────────────────────────┤
│                                      │
│  ┌─────────────────────────────────┐│
│  │                                 ││
│  │    Filter Controls             ││
│  │    (checkboxes, sliders,       ││
│  │    radio buttons, etc.)        ││
│  │                                 ││
│  └─────────────────────────────────┘│
│                                      │
└─────────────────────────────────────┘
```

## Range Slider

### Visual
```
┌─────────────────────────────────────┐
│  $15,000            $35,000         │
│     ●─────────────────●             │
│  ════════════════════════════════   │
│     ↑                 ↑             │
│   Min handle      Max handle        │
└─────────────────────────────────────┘
```

### Specifications
- Track height: 4px
- Handle size: 20px
- Active track color: `#1E40AF`
- Handle border: 2px solid white, shadow

## Checkbox List

### Visual
```
┌─────────────────────────────────────┐
│  ☑ Honda                     (156) │
│  ☐ Toyota                    (143) │
│  ☐ Ford                       (98) │
│  ☐ Chevrolet                  (87) │
│  ☐ BMW                        (65) │
│                                     │
│  [Show 12 more]                     │
└─────────────────────────────────────┘
```

### Checkbox States
| State | Appearance |
|-------|------------|
| Unchecked | White background, gray border |
| Checked | Blue background, white checkmark |
| Hover | Light blue background |
| Disabled | Gray background, gray border |

## Applied Filters Display

### Inline Tags
```
┌─────────────────────────────────────┐
│  [SUV ×] [Honda ×] [Under $30K ×]   │
│  [Clear All]                        │
└─────────────────────────────────────┘
```

## Animation

### Section Expand/Collapse
- Duration: 200ms
- Easing: ease-out
- Chevron rotation: 180°

### Mobile Drawer
- Slide in from left or bottom
- Duration: 300ms
- Overlay fade: 200ms

## Accessibility

### Requirements
- All form controls labeled
- Keyboard navigation support
- ARIA expanded states
- Focus management in drawer
- Screen reader announcements

### ARIA
```html
<aside aria-label="Filter vehicles">
  <button
    aria-expanded="true"
    aria-controls="price-filter"
  >
    Price Range
  </button>
  <div id="price-filter" role="region">
    ...
  </div>
</aside>
```

## Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| > 992px | Fixed sidebar |
| 768-992px | Collapsible sidebar |
| < 768px | Full-screen drawer |
