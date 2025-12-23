# Vehicle Search - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Browsing & Search

---

## Overview

The Vehicle Search feature enables customers to browse, search, filter, and discover vehicles in the marketplace inventory. This is the primary discovery mechanism for buyers.

---

## User Stories

### US-1: Search by Keyword
**As a** car buyer
**I want to** search for vehicles by make, model, or keyword
**So that** I can find specific vehicles quickly

**Acceptance Criteria:**
- Search bar visible in header on all pages
- Autocomplete suggestions after 2 characters
- Search history saved locally
- Results within 1 second
- Keyboard navigation support

### US-2: Filter Search Results
**As a** car buyer
**I want to** filter vehicles by various criteria
**So that** I can narrow down options

**Acceptance Criteria:**
- Filters: Price, Mileage, Year, Make, Model, Body Type, Color, Transmission
- Real-time result count updates
- Multiple filters combinable
- Filter chips removable individually
- "Clear All" resets filters

### US-3: View Vehicle Details
**As a** car buyer
**I want to** see comprehensive vehicle information
**So that** I can evaluate the vehicle

**Acceptance Criteria:**
- High-quality photo gallery with zoom
- All specifications displayed
- Vehicle history report accessible
- Similar vehicles recommended
- Contact/purchase CTAs visible

### US-4: Save Favorites
**As a** car buyer
**I want to** save vehicles to my favorites
**So that** I can compare them later

**Acceptance Criteria:**
- Heart icon on vehicle cards
- Favorites accessible from account
- Notification if favorited vehicle price changes
- Share favorites via link

---

## UI Components

### Search Bar (Header)

```
Location: Fixed in header
Width: 320px (desktop), full-width modal (mobile)
Height: 44px
Border: 1px solid #E1E4E8
Border-radius: 8px

Elements:
- Search icon: 20x20, left 12px
- Input: Placeholder "Search make, model, keyword..."
- Clear button: Appears when input has value
- Submit: Enter key or click icon
```

### Autocomplete Dropdown

```
Position: Below search bar
Width: 320px
Max-height: 400px (scrollable)
Background: #FFFFFF
Border: 1px solid #E1E4E8
Border-radius: 8px
Shadow: Level 2

Item Structure:
- Icon (car silhouette or search history clock)
- Primary text (Make/Model)
- Secondary text (result count)
- Height: 48px per item
- Hover: Background #F5F7FA
- Max items: 8
```

### Filter Sidebar (Desktop)

```
Width: 280px
Position: Fixed left
Background: #F5F7FA
Border-right: 1px solid #E1E4E8
Padding: 24px

Filter Groups:
1. Make & Model
   - Searchable dropdown
   - Dependent model dropdown

2. Price Range
   - Dual-handle slider
   - Min/Max input fields
   - Range: $0 - $100,000
   - Step: $1,000

3. Year
   - Dual-handle slider or dropdowns
   - Range: 2010 - 2025

4. Mileage
   - Dual-handle slider
   - Range: 0 - 200,000 km
   - Step: 10,000

5. Body Type
   - Checkbox group with icons
   - Options: Sedan, SUV, Truck, Coupe, Hatchback, Van, Convertible

6. Transmission
   - Radio buttons
   - Options: All, Automatic, Manual

7. Fuel Type
   - Checkbox group
   - Options: Gasoline, Diesel, Hybrid, Electric

8. Color
   - Color swatches (clickable circles)
   - Exterior and Interior tabs

Actions:
- "Apply Filters" button (Primary, full-width)
- "Clear All" link (centered below)
```

### Filter Bottom Sheet (Mobile)

```
Trigger: FAB or "Filters" button in results header
Animation: Slide up from bottom
Height: 80% viewport max
Background: #FFFFFF
Border-radius: 16px 16px 0 0

Header:
- Title: "Filters"
- Close button (X)
- Active filter count badge

Content:
- Collapsible accordions for each filter group
- Sticky "Apply" button at bottom
```

### Active Filter Chips

```
Location: Above results grid
Layout: Horizontal scroll on mobile, wrap on desktop

Chip:
- Height: 32px
- Padding: 8px 12px
- Background: #F5F7FA
- Border: 1px solid #E1E4E8
- Border-radius: 16px
- Close icon: 16x16, right side
- Font: 14px #1A1F36

Example: "Honda" [x]  "$15k - $30k" [x]  "2020+" [x]
```

### Vehicle Grid

```
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
Gap: 24px
```

### Vehicle Card

```
Width: Fluid (grid-based)
Background: #FFFFFF
Border: 1px solid #E1E4E8
Border-radius: 12px

Structure:
1. Image Container (4:3 aspect ratio)
   - Object-fit: cover
   - Badge: Top-right (CERTIFIED, SALE)
   - Favorite icon: Top-right (absolute)
   - Photo count: Bottom-right "1/12"

2. Content (Padding: 20px)
   - Title: "2021 Honda Civic LX"
     Font: 20px/28px, Weight 600
     Color: #1A1F36
     Truncate: 1 line, ellipsis

   - Price: "$24,999"
     Font: 24px/32px, Weight 700
     Color: #0066FF

   - Metadata Row:
     Mileage icon + "35,420 km"
     Location icon + "Toronto, ON"
     Font: 14px, Color: #8B95A5

   - View Details Button (Secondary, full-width)

Hover State:
- Transform: translateY(-4px)
- Box-shadow: Level 2
- Border: 1px solid #0066FF
- Transition: all 200ms ease
```

### Results Header

```
Layout: Flex, space-between
Height: 48px
Margin-bottom: 24px

Left Side:
- Result count: "1,247 vehicles found"
- Font: 16px, Color: #8B95A5

Right Side:
- Sort dropdown: "Sort by: Best Match"
  Options: Best Match, Price: Low-High, Price: High-Low,
           Mileage: Low-High, Year: New-Old, Recently Added

- View toggle (icons):
  Grid view (default)
  List view
```

### Pagination

```
Layout: Centered
Style: Numbered pages with prev/next

Elements:
- Previous arrow (disabled if page 1)
- Page numbers (show 5, with ellipsis)
- Next arrow (disabled if last page)
- "Showing 1-24 of 1,247"

Behavior:
- Infinite scroll option on mobile
- Load more button as alternative
```

### Vehicle Detail Page

```
Layout:
┌─────────────────────────────────────────────────────┐
│ Breadcrumbs                                          │
├─────────────────────────────────────────────────────┤
│ Title & Price Section                                │
├───────────────────────────┬─────────────────────────┤
│                           │                          │
│  Image Gallery            │  Key Details Card        │
│  (800x600 main)           │  - Mileage               │
│                           │  - Location              │
│  Thumbnail strip          │  - Transmission          │
│                           │  - Fuel Type             │
│                           │                          │
│                           │  [Get Pre-Approved]      │
│                           │  [Schedule Test Drive]   │
│                           │  [Contact Seller]        │
│                           │                          │
├───────────────────────────┴─────────────────────────┤
│ Tab Navigation                                       │
│ Overview | Features | Specs | History                │
├─────────────────────────────────────────────────────┤
│ Tab Content                                          │
├─────────────────────────────────────────────────────┤
│ Similar Vehicles Carousel                            │
└─────────────────────────────────────────────────────┘
```

### Image Gallery

```
Main Image:
- Width: 800px (desktop), 100% (mobile)
- Height: 600px (desktop), auto (mobile)
- Object-fit: contain
- Background: #1A1F36

Thumbnails:
- Width: 80px
- Height: 60px
- Gap: 8px
- Border: 2px solid transparent (active: #0066FF)

Features:
- Click to enlarge (modal)
- Arrow navigation
- Swipe on mobile
- Keyboard navigation
- Image zoom on hover
- Fullscreen mode
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/browse` | VehicleListingPage | Main search/browse |
| `/browse/:make` | VehicleListingPage | Filtered by make |
| `/browse/:make/:model` | VehicleListingPage | Filtered by make+model |
| `/vehicle/:vehicleId` | VehicleDetailPage | Single vehicle view |
| `/favorites` | FavoritesPage | Saved vehicles |
| `/compare` | ComparePage | Side-by-side comparison |

---

## State Management

### Search State

```typescript
interface SearchState {
  query: string;
  filters: {
    makes: string[];
    models: string[];
    priceMin: number | null;
    priceMax: number | null;
    yearMin: number | null;
    yearMax: number | null;
    mileageMax: number | null;
    bodyTypes: string[];
    transmission: string | null;
    fuelTypes: string[];
    colors: string[];
  };
  sort: SortOption;
  view: 'grid' | 'list';
  page: number;
  results: Vehicle[];
  totalCount: number;
  isLoading: boolean;
  suggestions: SearchSuggestion[];
}

type SortOption =
  | 'best_match'
  | 'price_asc'
  | 'price_desc'
  | 'mileage_asc'
  | 'year_desc'
  | 'recently_added';
```

### Vehicle State

```typescript
interface VehicleState {
  currentVehicle: Vehicle | null;
  photos: string[];
  similarVehicles: Vehicle[];
  isLoading: boolean;
  activeTab: 'overview' | 'features' | 'specs' | 'history';
}
```

### Favorites State

```typescript
interface FavoritesState {
  favoriteIds: string[];
  favorites: Vehicle[];
  isLoading: boolean;
}
```

---

## API Integration

### Search Endpoints

```
GET /api/v1/vehicles/search
  Query Params: q, make, model, priceMin, priceMax,
                yearMin, yearMax, mileageMax, bodyType,
                transmission, fuelType, color, sort,
                page, limit
  Response:
    {
      "vehicles": Vehicle[],
      "totalCount": number,
      "page": number,
      "totalPages": number,
      "facets": {
        "makes": [{ "name": string, "count": number }],
        "bodyTypes": [...],
        "priceRanges": [...]
      }
    }

GET /api/v1/vehicles/suggestions
  Query Params: q (partial search)
  Response:
    {
      "suggestions": [
        { "type": "make", "text": "Honda", "count": 234 },
        { "type": "model", "text": "Honda Civic", "count": 89 }
      ]
    }

GET /api/v1/vehicles/:vehicleId
  Response: Vehicle (full details)

GET /api/v1/vehicles/:vehicleId/similar
  Response: { "vehicles": Vehicle[] }

POST /api/v1/favorites
  Body: { "vehicleId": string }

DELETE /api/v1/favorites/:vehicleId

GET /api/v1/favorites
  Response: { "vehicles": Vehicle[] }
```

---

## Responsive Design

### Desktop (1440px+)
- Sidebar filters visible
- 3-column vehicle grid
- Full image gallery with thumbnails
- Side-by-side detail layout

### Tablet (768px - 1439px)
- Collapsible filter panel or modal
- 2-column vehicle grid
- Full-width detail sections

### Mobile (< 768px)
- Filter bottom sheet
- Single column vehicle cards
- Swipeable image gallery
- Sticky CTA bar on detail page

---

## Accessibility

- Search input with role="searchbox"
- Filter groups with fieldset/legend
- Vehicle cards as article elements
- Image alt text with vehicle description
- Keyboard navigable gallery
- Focus management in modals
- Skip links for filter/results sections
- Announce filter changes with live region

---

## Performance

- Lazy load images below fold
- Virtual scrolling for large result sets
- Debounce search input (300ms)
- Cache filter options
- Prefetch vehicle detail on card hover
- Responsive images (srcset)
- Skeleton loaders during fetch

---

## Analytics Events

- `search_performed` - Query, filters, result count
- `filter_applied` - Filter type, value
- `filter_removed` - Filter type
- `vehicle_viewed` - Vehicle ID, source
- `photo_viewed` - Vehicle ID, photo index
- `favorite_added` - Vehicle ID
- `favorite_removed` - Vehicle ID
- `compare_initiated` - Vehicle IDs
- `sort_changed` - Sort option
- `pagination_clicked` - Page number
