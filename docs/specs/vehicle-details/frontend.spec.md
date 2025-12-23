# Vehicle Details - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Detail Page
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

The Vehicle Details page provides comprehensive information about a specific vehicle, including photos, specifications, pricing, vehicle history, and purchase options. This is the primary conversion point for vehicle purchases.

---

## Requirements

### REQ-VD-F-001: Image Gallery
**Description:** Display high-quality vehicle photos with interactive gallery
**Priority:** High

**Acceptance Criteria:**
- [ ] Main image displays prominently (800x600 desktop)
- [ ] Thumbnail strip shows all available photos
- [ ] Click thumbnail to switch main image
- [ ] Arrow navigation for next/previous
- [ ] Fullscreen lightbox mode
- [ ] Mobile: Swipeable gallery
- [ ] Image zoom on hover/pinch
- [ ] Photo count indicator (e.g., "3/15")

### REQ-VD-F-002: Key Details Card
**Description:** Show essential vehicle information prominently
**Priority:** High

**Acceptance Criteria:**
- [ ] Display: Price, Mileage, Location, Transmission, Fuel Type
- [ ] Price shows original if discounted
- [ ] "CERTIFIED" badge if applicable
- [ ] Favorite heart icon
- [ ] Share button for social/copy link

### REQ-VD-F-003: Call-to-Action Buttons
**Description:** Prominent purchase/inquiry buttons
**Priority:** High

**Acceptance Criteria:**
- [ ] "Get Started" primary CTA (initiates purchase)
- [ ] "Get Pre-Approved" for financing
- [ ] "Schedule Test Drive" (virtual or in-person)
- [ ] "Ask a Question" opens chat/form
- [ ] Sticky CTA bar on mobile
- [ ] CTAs track click events

### REQ-VD-F-004: Tabbed Content
**Description:** Organize detailed information in tabs
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Tabs: Overview, Features, Specifications, Vehicle History
- [ ] Tab content loads without page refresh
- [ ] Deep linking to specific tabs (#features)
- [ ] Keyboard navigation between tabs

### REQ-VD-F-005: Similar Vehicles
**Description:** Recommend related vehicles
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Show 4-6 similar vehicles
- [ ] Based on make, model, price range
- [ ] Horizontal carousel on desktop
- [ ] Click navigates to vehicle detail

### REQ-VD-F-006: Vehicle History
**Description:** Display comprehensive vehicle history
**Priority:** High

**Acceptance Criteria:**
- [ ] Free CARFAX/vehicle history report access
- [ ] Accident history summary
- [ ] Number of previous owners
- [ ] Service records if available
- [ ] 210-point inspection results

---

## UI Components

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ BREADCRUMBS: Home > Browse > Honda > Civic > 2021 Honda Civic   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  2021 Honda Civic LX                              [♡] [Share]   │
│  (H1, 32px, Bold)                                                │
│                                                                   │
├───────────────────────────────┬─────────────────────────────────┤
│                               │                                   │
│  ┌─────────────────────────┐ │  KEY DETAILS CARD                │
│  │                         │ │  ─────────────────                │
│  │    MAIN IMAGE           │ │                                   │
│  │    (800 x 600)          │ │  $24,999                         │
│  │                         │ │  (32px, Bold, #0066FF)           │
│  │  [<]             [>]    │ │  Was $26,500                     │
│  │                         │ │                                   │
│  └─────────────────────────┘ │  ──────────────────               │
│                               │  35,420 km                       │
│  [thumb][thumb][thumb][thumb] │  Toronto, ON                     │
│                               │  Automatic                       │
│                               │  Gasoline                        │
│                               │  [CERTIFIED badge]               │
│                               │                                   │
│                               │  ┌─────────────────────────────┐ │
│                               │  │     Get Started             │ │
│                               │  │     (Primary CTA)           │ │
│                               │  └─────────────────────────────┘ │
│                               │                                   │
│                               │  ┌─────────────────────────────┐ │
│                               │  │   Get Pre-Approved          │ │
│                               │  └─────────────────────────────┘ │
│                               │                                   │
│                               │  ┌─────────────────────────────┐ │
│                               │  │   Ask a Question            │ │
│                               │  └─────────────────────────────┘ │
│                               │                                   │
├───────────────────────────────┴─────────────────────────────────┤
│                                                                   │
│  [Overview] [Features] [Specifications] [Vehicle History]        │
│  ───────────────────────────────────────────────────────────     │
│                                                                   │
│  TAB CONTENT AREA                                                │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Similar Vehicles                                                 │
│  [Card] [Card] [Card] [Card]                                     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Image Gallery

```
Main Image Container:
- Width: 800px (desktop), 100% (mobile)
- Height: 600px (desktop), auto (mobile)
- Background: #1A1F36
- Object-fit: contain

Navigation Arrows:
- Size: 48px circles
- Background: rgba(255,255,255,0.9)
- Position: Centered vertically, 16px from edges
- Hover: Box-shadow

Thumbnail Strip:
- Thumbnail size: 80x60px
- Gap: 8px
- Active border: 2px solid #0066FF
- Overflow: Horizontal scroll with arrows

Fullscreen Lightbox:
- Background: rgba(0,0,0,0.95)
- Close button: Top-right
- Counter: Bottom-center
- Navigation: Arrows or swipe
```

### Key Details Card

```
Width: 400px (desktop), 100% (mobile)
Background: #FFFFFF
Border: 1px solid #E1E4E8
Border-radius: 12px
Padding: 24px
Position: Sticky on desktop (top: 104px)

Structure:
┌────────────────────────────────┐
│  CERTIFIED             [badge] │
│                                │
│  $24,999                       │
│  (32px, Bold, #0066FF)         │
│                                │
│  Was $26,500                   │
│  (16px, line-through, #8B95A5) │
│                                │
│  ────────────────────────      │
│                                │
│  🚗 35,420 km                  │
│  📍 Toronto, ON                │
│  ⚙️ Automatic                  │
│  ⛽ Gasoline                   │
│  📅 Listed 5 days ago          │
│                                │
│  ────────────────────────      │
│                                │
│  ┌────────────────────────┐   │
│  │  💳 Get Started        │   │ ← Primary, 48px
│  └────────────────────────┘   │
│                                │
│  ┌────────────────────────┐   │
│  │  🏦 Get Pre-Approved   │   │ ← Secondary, 44px
│  └────────────────────────┘   │
│                                │
│  ┌────────────────────────┐   │
│  │  💬 Ask a Question     │   │ ← Secondary, 44px
│  └────────────────────────┘   │
│                                │
│  🛡️ 10-Day Money-Back Guarantee │
│  📋 210-Point Inspection       │
│  🚚 Free Delivery              │
│                                │
└────────────────────────────────┘
```

### Tab Navigation

```
Layout: Horizontal tabs
Height: 48px
Border-bottom: 2px solid #E1E4E8

Tab Item:
- Padding: 12px 24px
- Font: 16px, Weight 500
- Color: #8B95A5 (inactive), #1A1F36 (active)
- Active indicator: 2px bottom border, #0066FF
- Hover: Color #0066FF
```

### Tab Content: Overview

```
Sections:
1. Description (text paragraph)
2. Key Highlights (bullet points)
3. Dealer Notes (if any)
```

### Tab Content: Features

```
Grid Layout: 3 columns
Categories:
- Safety Features
- Comfort Features
- Technology Features
- Exterior Features

Feature Item:
- Checkmark icon + Feature name
- Font: 14px
```

### Tab Content: Specifications

```
Two-column table layout:

| Specification    | Value          |
|-----------------|----------------|
| Make            | Honda          |
| Model           | Civic          |
| Year            | 2021           |
| Trim            | LX             |
| VIN             | 1HGCV1...      |
| Body Style      | Sedan          |
| Doors           | 4              |
| Transmission    | Automatic      |
| Drivetrain      | FWD            |
| Engine          | 2.0L 4-Cyl     |
| Fuel Type       | Gasoline       |
| MPG City        | 30             |
| MPG Highway     | 38             |
| Exterior Color  | White          |
| Interior Color  | Black          |
```

### Tab Content: Vehicle History

```
┌────────────────────────────────────────────────────────────────┐
│  📋 Free Vehicle History Report                                │
│  ─────────────────────────────                                 │
│                                                                 │
│  ✅ No Accidents Reported                                      │
│  ✅ 2 Previous Owners                                          │
│  ✅ Regular Service History                                    │
│  ✅ No Open Recalls                                            │
│                                                                 │
│  [View Full Report] ← Opens PDF or modal                       │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  🔍 210-Point Inspection                                       │
│  ─────────────────────────                                     │
│                                                                 │
│  Completed on: Dec 15, 2025                                    │
│                                                                 │
│  ✅ Exterior (42/42 points passed)                             │
│  ✅ Interior (38/38 points passed)                             │
│  ✅ Mechanical (85/85 points passed)                           │
│  ✅ Safety (45/45 points passed)                               │
│                                                                 │
│  [View Detailed Report]                                        │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface VehicleDetailState {
  vehicle: VehicleDetail | null;
  isLoading: boolean;
  error: string | null;

  // Gallery
  images: VehicleImage[];
  activeImageIndex: number;
  isLightboxOpen: boolean;

  // Tabs
  activeTab: 'overview' | 'features' | 'specifications' | 'history';

  // Similar vehicles
  similarVehicles: VehicleSummary[];

  // Interactions
  isFavorite: boolean;
  isShareModalOpen: boolean;
}

interface VehicleDetail {
  id: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  vin: string;
  price: number;
  originalPrice: number | null;
  mileage: number;
  location: { city: string; province: string };
  transmission: string;
  fuelType: string;
  bodyType: string;
  drivetrain: string;
  engineSize: string;
  exteriorColor: string;
  interiorColor: string;
  doors: number;
  mpgCity: number;
  mpgHighway: number;
  description: string;
  features: VehicleFeature[];
  badges: string[];
  certificationStatus: string;
  historyReport: HistoryReport;
  inspectionReport: InspectionReport;
  listedAt: string;
  daysOnMarket: number;
}
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `VehicleViewed` | Page load | `{ vehicleId, source, userId }` |
| `PhotoGalleryViewed` | Gallery interaction | `{ vehicleId, photoIndex }` |
| `SpecificationsViewed` | Specs tab clicked | `{ vehicleId }` |
| `VehicleHistoryReportViewed` | History tab/report clicked | `{ vehicleId }` |
| `GetStartedClicked` | Primary CTA clicked | `{ vehicleId, userId }` |
| `FinancingClicked` | Pre-approval CTA clicked | `{ vehicleId }` |
| `FavoriteAdded` | Heart clicked | `{ vehicleId, userId }` |
| `VehicleShared` | Share action completed | `{ vehicleId, shareMethod }` |

---

## Accessibility

- Images have descriptive alt text (make, model, view angle)
- Tab interface follows ARIA tabs pattern
- Lightbox has focus trap
- Escape closes lightbox
- Price changes announced via live region

---

## Mockup

![Vehicle Details Mockup](./mockup-details.png)

*See mockup-details.html for interactive prototype*
