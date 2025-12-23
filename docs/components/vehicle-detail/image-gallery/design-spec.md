# Image Gallery Component

## Overview
The image gallery displays multiple high-resolution photos of a vehicle with navigation controls, thumbnails, and full-screen viewing capability.

## Component States

| State | Description |
|-------|-------------|
| Default | Main image with thumbnail strip |
| Full-screen | Lightbox overlay mode |
| Loading | Image skeleton placeholders |
| Zoomed | Pan-able zoomed view |
| Empty | No images placeholder |

## Visual Specifications

### Dimensions
| Property | Desktop | Mobile |
|----------|---------|--------|
| Main Image Height | 480px | 280px |
| Thumbnail Size | 80x60px | 60x45px |
| Thumbnail Strip | Horizontal | Horizontal scroll |
| Border Radius | 12px | 8px |

### Colors
| Element | Color | Hex |
|---------|-------|-----|
| Background | Light Gray | `#F3F4F6` |
| Arrow Button BG | White | `#FFFFFF` |
| Arrow Button | Dark Gray | `#374151` |
| Active Thumbnail | Blue Border | `#1E40AF` |
| Counter BG | Semi-transparent | `rgba(0,0,0,0.7)` |

## Wireframe

### Desktop Layout
```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                                                                 │ │
│  │                                                                 │ │
│  │  [←]                  Main Image                         [→]   │ │
│  │                                                                 │ │
│  │                                                                 │ │
│  │                                                [⛶] [⋮]          │ │  ← Fullscreen & More
│  │                                                     1/12       │ │  ← Counter
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ← → │
│  │ 1  │ │ 2  │ │ 3  │ │ 4  │ │ 5  │ │ 6  │ │ 7  │ │ 8  │     │
│  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘     │
│    ↑                                                              │
│  Active (blue border)                                             │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### Full-screen Lightbox
```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│  ██████████████████████████████████████████████████████████████████████████████████  │
│  ██                                                                              ██  │
│  ██                                                                              ██  │
│  ██                                                                              ██  │
│  ██  [←]                        Full Image                              [→]    ██  │
│  ██                                                                              ██  │
│  ██                                                                              ██  │
│  ██                                                                              ██  │
│  ██████████████████████████████████████████████████████████████████████████████████  │
│                                                                                       │
│           ○   ○   ○   ●   ○   ○   ○   ○   ○   ○   ○   ○                             │
│                       ↑                                                               │
│                    Active                                                             │
│                                                                                       │
│  [Close ✕]                                              4 / 12        [Download]     │
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## Navigation Controls

### Arrow Buttons
- Size: 44x44px
- Position: Centered vertically, 16px from edges
- Appearance: White circle with shadow
- Visibility: Show on hover (desktop) or always (mobile)

### Thumbnail Strip
- Max visible: 8 thumbnails
- Scroll arrows when more than 8
- Gap: 8px between thumbnails
- Active: 3px blue border

### Dot Indicators (Mobile)
- Size: 8px dots
- Active: 10px, filled
- Gap: 6px
- Position: Below main image

## Gestures (Touch)

| Gesture | Action |
|---------|--------|
| Swipe Left | Next image |
| Swipe Right | Previous image |
| Pinch | Zoom in/out |
| Double Tap | Toggle zoom |
| Single Tap | Show/hide controls |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Left Arrow | Previous image |
| Right Arrow | Next image |
| Escape | Close fullscreen |
| Space | Toggle fullscreen |

## Image Categories

| Badge | Description |
|-------|-------------|
| Exterior | External vehicle shots |
| Interior | Inside cabin views |
| Features | Specific feature details |
| 360° | Interactive view |

## Animation

### Transitions
- Image fade: 200ms ease
- Thumbnail scroll: 300ms ease-out
- Fullscreen open: 300ms scale + fade
- Zoom: 200ms ease-out

## Accessibility

### Requirements
- Alt text for all images
- Keyboard navigation support
- Focus trap in fullscreen
- Screen reader announcements

### ARIA
```html
<div
  role="region"
  aria-label="Vehicle image gallery"
  aria-roledescription="carousel"
>
  <button aria-label="Previous image">←</button>
  <img
    alt="2021 Honda Civic EX - Front exterior view"
    aria-describedby="img-counter"
  />
  <button aria-label="Next image">→</button>
  <div id="img-counter" aria-live="polite">
    Image 1 of 12
  </div>
</div>
```

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| > 992px | Full gallery with thumbnails |
| 768-992px | Smaller thumbnails |
| < 768px | Swipe-only, dot indicators |
