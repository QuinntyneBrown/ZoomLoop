# Inventory Management - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Inventory & Listing Management (Internal)

---

## Overview

The Inventory Management feature is an internal system for managing vehicle listings, pricing, and availability status.

---

## User Stories (Internal)

### US-1: Manage Listings
**As an** inventory manager
**I want to** create and update vehicle listings
**So that** vehicles are accurately represented

### US-2: Set Pricing
**As a** pricing analyst
**I want to** set and adjust vehicle prices
**So that** pricing is competitive

### US-3: Track Availability
**As an** operations manager
**I want to** track vehicle availability
**So that** I know what's ready to sell

---

## UI Components (Internal Portal)

### Inventory Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Inventory Overview                                          │
│                                                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  1,247  │ │  892    │ │  234    │ │  121    │           │
│  │ Total   │ │Available│ │Reserved │ │ Pending │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                                │
│  Quick Actions                                               │
│  [+ Add Listing]  [Bulk Update]  [Export]                    │
│                                                                │
│  Search & Filter                                             │
│  [Search VIN, Make, Model...              ] [🔍]            │
│  Status: [All ▼]  Location: [All ▼]  Days: [All ▼]         │
│                                                                │
│  Inventory Table                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ □ │ VIN      │ Vehicle      │ Price   │ Status │ Days  ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ □ │ ...9186  │ 2021 Civic   │ $24,999 │ Avail  │  5    ││
│  │ □ │ ...4521  │ 2020 RAV4    │ $28,500 │ Reserv │  12   ││
│  │ □ │ ...7834  │ 2022 CX-5    │ $32,750 │ Avail  │  3    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Listing Editor

```
┌─────────────────────────────────────────────────────────────┐
│  Edit Listing                                                │
│  2021 Honda Civic LX                                         │
│                                                                │
│  Basic Information                                           │
│  ─────────────────                                            │
│  VIN: 1HGBH41JXMN109186                                      │
│  Make: [Honda ▼]  Model: [Civic ▼]  Trim: [LX ▼]            │
│  Year: [2021]     Mileage: [35420]                          │
│                                                                │
│  Pricing                                                      │
│  ───────                                                       │
│  List Price: [$24,999    ]                                   │
│  Market Price: $25,200 (via pricing algorithm)              │
│  Acquisition Cost: $21,500                                   │
│  Margin: 16.3%                                               │
│                                                                │
│  Status                                                       │
│  ──────                                                        │
│  Availability: [Available ▼]                                 │
│  Featured: [☐]                                               │
│  Location: [Toronto ▼]                                       │
│                                                                │
│  Photos (24)                                                  │
│  ──────────                                                    │
│  [Photo Grid] [Reorder] [+ Add More]                         │
│                                                                │
│  Description                                                  │
│  ───────────                                                   │
│  [Rich text editor]                                          │
│                                                                │
│  [Save Draft]  [Publish Changes]  [Deactivate]               │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Pricing Tool

```
┌─────────────────────────────────────────────────────────────┐
│  Pricing Analysis                                            │
│  2021 Honda Civic LX                                         │
│                                                                │
│  Algorithm Recommendation: $25,200                           │
│  Current Price: $24,999                                      │
│                                                                │
│  Market Comparison                                           │
│  ──────────────────                                           │
│  Similar vehicles (within 50km):                             │
│  • 2021 Civic LX, 32k km - $25,500                          │
│  • 2021 Civic LX, 40k km - $24,200                          │
│  • 2021 Civic EX, 35k km - $26,800                          │
│                                                                │
│  Price History                                               │
│  ─────────────                                                │
│  [Line chart showing price over time]                        │
│                                                                │
│  Demand Indicators                                           │
│  ─────────────────                                            │
│  Views: 245 (last 7 days)                                    │
│  Favorites: 12                                               │
│  Inquiries: 3                                                │
│                                                                │
│  New Price: [$______]  [Update Price]                        │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Availability Manager

```
┌─────────────────────────────────────────────────────────────┐
│  Vehicle Availability                                        │
│  2021 Honda Civic LX                                         │
│                                                                │
│  Current Status: Available                                   │
│  Days on Market: 5                                           │
│                                                                │
│  Status History                                              │
│  ──────────────                                               │
│  • Dec 21 - Listed (Available)                               │
│  • Dec 16 - Certified                                        │
│  • Dec 12 - Received at facility                             │
│  • Dec 10 - Purchased from seller                            │
│                                                                │
│  Change Status                                               │
│  ─────────────                                                │
│  ○ Available                                                 │
│  ○ Reserved (Manual hold)                                    │
│  ○ Pending (Awaiting action)                                 │
│  ○ Sold                                                      │
│  ○ Removed (With reason)                                     │
│                                                                │
│  [Update Status]                                              │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Page Routes (Internal)

| Route | Component | Description |
|-------|-----------|-------------|
| `/internal/inventory` | InventoryDashboard | Overview |
| `/internal/inventory/listings` | ListingsPage | All listings |
| `/internal/inventory/listings/new` | CreateListingPage | New listing |
| `/internal/inventory/listings/:id` | EditListingPage | Edit listing |
| `/internal/inventory/pricing` | PricingPage | Pricing tools |
| `/internal/inventory/analytics` | AnalyticsPage | Inventory analytics |

---

## API Integration

```
GET /api/v1/internal/inventory
  Query: status, location, daysOnMarket, page, limit
  Response: { vehicles: InventoryVehicle[], stats }

POST /api/v1/internal/inventory/listings
  Body: ListingData
  Response: { listingId }

PUT /api/v1/internal/inventory/listings/:id
  Body: ListingUpdates
  Response: { updated }

PUT /api/v1/internal/inventory/listings/:id/price
  Body: { price, reason }
  Response: { updated }

PUT /api/v1/internal/inventory/listings/:id/status
  Body: { status, reason }
  Response: { updated }
```

---

## Analytics (Internal)

- Inventory turnover rate
- Average days on market
- Price adjustment frequency
- Sell-through rate by category
- Geographic distribution
