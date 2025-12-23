# Inventory Management - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Inventory & Listing Management

---

## Overview

The Inventory Management backend handles vehicle listing lifecycle, pricing, availability status, and inventory analytics.

---

## Domain Events

### Listing Management

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleListingCreated` | Listing created | `{ listingId, vehicleId, createdAt }` |
| `VehicleDetailsUpdated` | Info modified | `{ listingId, updatedFields[], updatedAt }` |
| `PriceSet` | Price established | `{ listingId, price, pricingStrategy }` |
| `PhotosUploaded` | Images added | `{ listingId, photoUrls[], uploadedAt }` |
| `ListingPublished` | Made visible | `{ listingId, publishedAt, visibility }` |
| `ListingFeatured` | Promoted | `{ listingId, featuredFrom, featuredTo }` |
| `ListingDeactivated` | Removed | `{ listingId, deactivatedAt, reason }` |
| `VehicleSold` | Sale complete | `{ listingId, soldAt, finalPrice, buyerId }` |

### Availability

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleReserved` | Held for customer | `{ reservationId, vehicleId, customerId, reservedUntil }` |
| `ReservationExpired` | Hold ended | `{ reservationId, expiredAt }` |
| `VehicleAvailable` | Ready for sale | `{ vehicleId, availableAt }` |
| `VehicleUnavailable` | Not for sale | `{ vehicleId, reason, unavailableAt }` |

---

## API Endpoints

### Listings

```
GET /api/v1/internal/inventory/listings
  Description: List all inventory
  Auth: Required (Internal role)
  Query Parameters:
    - status: available|reserved|pending|sold|all
    - location: uuid
    - make: string
    - model: string
    - yearMin: number
    - yearMax: number
    - priceMin: number
    - priceMax: number
    - daysOnMarketMin: number
    - daysOnMarketMax: number
    - sort: listed_at|price|days_on_market
    - page: number
    - limit: number
  Response: 200 OK
    {
      "listings": [
        {
          "listingId": "uuid",
          "vehicleId": "uuid",
          "vin": "string",
          "make": "string",
          "model": "string",
          "year": number,
          "trim": "string",
          "price": number,
          "status": "string",
          "location": "string",
          "daysOnMarket": number,
          "views": number,
          "favorites": number,
          "inquiries": number,
          "thumbnailUrl": "string",
          "listedAt": "ISO-8601"
        }
      ],
      "stats": {
        "total": number,
        "available": number,
        "reserved": number,
        "pending": number,
        "sold": number,
        "averageDaysOnMarket": number,
        "averagePrice": number
      },
      "pagination": { ... }
    }

POST /api/v1/internal/inventory/listings
  Description: Create new listing
  Auth: Required (Internal role)
  Request Body:
    {
      "vehicleId": "uuid",
      "price": number,
      "location": "uuid",
      "description": "string",
      "highlights": ["string"],
      "visibility": "draft|published"
    }
  Response: 201 Created
    {
      "listingId": "uuid",
      "status": "draft|published",
      "createdAt": "ISO-8601"
    }

GET /api/v1/internal/inventory/listings/:listingId
  Description: Get listing details
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "listingId": "uuid",
      "vehicleId": "uuid",
      "vehicle": { ... },
      "price": number,
      "priceHistory": [
        { "price": number, "changedAt": "ISO-8601", "reason": "string" }
      ],
      "status": "string",
      "visibility": "draft|published",
      "location": { ... },
      "photos": [
        { "url": "string", "order": number, "caption": "string" }
      ],
      "description": "string",
      "highlights": ["string"],
      "featured": boolean,
      "featuredUntil": "ISO-8601",
      "metrics": {
        "views": number,
        "uniqueViews": number,
        "favorites": number,
        "inquiries": number,
        "testDrives": number
      },
      "listedAt": "ISO-8601",
      "daysOnMarket": number,
      "createdAt": "ISO-8601",
      "updatedAt": "ISO-8601"
    }

PUT /api/v1/internal/inventory/listings/:listingId
  Description: Update listing
  Auth: Required (Internal role)
  Request Body:
    {
      "price": number,
      "description": "string",
      "highlights": ["string"],
      "location": "uuid"
    }
  Response: 200 OK

PUT /api/v1/internal/inventory/listings/:listingId/price
  Description: Update price
  Auth: Required (Internal role)
  Request Body:
    {
      "price": number,
      "reason": "market_adjustment|demand|time_on_lot|promotional|other"
    }
  Response: 200 OK
    {
      "previousPrice": number,
      "newPrice": number,
      "changedAt": "ISO-8601"
    }

PUT /api/v1/internal/inventory/listings/:listingId/status
  Description: Change status
  Auth: Required (Internal role)
  Request Body:
    {
      "status": "available|reserved|pending|sold|removed",
      "reason": "string",
      "reservedFor": "uuid (optional)",
      "reservedUntil": "ISO-8601 (optional)"
    }
  Response: 200 OK

POST /api/v1/internal/inventory/listings/:listingId/publish
  Description: Publish listing
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "published": true,
      "publishedAt": "ISO-8601"
    }

POST /api/v1/internal/inventory/listings/:listingId/feature
  Description: Feature listing
  Auth: Required (Internal role)
  Request Body:
    {
      "duration": number (days),
      "placement": "homepage|search_top|category"
    }
  Response: 200 OK

DELETE /api/v1/internal/inventory/listings/:listingId
  Description: Deactivate listing
  Auth: Required (Internal role)
  Request Body:
    {
      "reason": "sold|removed|transferred|other",
      "notes": "string"
    }
  Response: 200 OK
```

### Photos

```
POST /api/v1/internal/inventory/listings/:listingId/photos
  Description: Upload photos
  Auth: Required (Internal role)
  Content-Type: multipart/form-data
  Request Body:
    - photos: File[]
  Response: 200 OK
    {
      "uploaded": number,
      "photos": [
        { "id": "uuid", "url": "string", "thumbnailUrl": "string" }
      ]
    }

PUT /api/v1/internal/inventory/listings/:listingId/photos/reorder
  Description: Reorder photos
  Auth: Required (Internal role)
  Request Body:
    {
      "photoIds": ["uuid"]
    }
  Response: 200 OK

DELETE /api/v1/internal/inventory/listings/:listingId/photos/:photoId
  Description: Remove photo
  Auth: Required (Internal role)
  Response: 204 No Content
```

### Pricing

```
GET /api/v1/internal/inventory/pricing/:vehicleId
  Description: Get pricing analysis
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "vehicleId": "uuid",
      "currentPrice": number,
      "recommendedPrice": number,
      "acquisitionCost": number,
      "margin": number,
      "comparables": [
        {
          "source": "string",
          "make": "string",
          "model": "string",
          "year": number,
          "mileage": number,
          "price": number,
          "location": "string"
        }
      ],
      "marketTrend": "increasing|stable|decreasing",
      "demandScore": number,
      "daysOnMarket": number,
      "priceDropSuggestion": {
        "suggested": boolean,
        "amount": number,
        "reason": "string"
      }
    }

POST /api/v1/internal/inventory/pricing/bulk
  Description: Bulk price update
  Auth: Required (Manager role)
  Request Body:
    {
      "adjustmentType": "percentage|fixed",
      "adjustmentValue": number,
      "filters": {
        "makes": ["string"],
        "daysOnMarketMin": number
      }
    }
  Response: 200 OK
    {
      "updated": number,
      "vehicles": [
        { "vehicleId": "uuid", "oldPrice": number, "newPrice": number }
      ]
    }
```

### Analytics

```
GET /api/v1/internal/inventory/analytics
  Description: Get inventory analytics
  Auth: Required (Internal role)
  Query Parameters:
    - period: day|week|month|quarter
    - location: uuid
  Response: 200 OK
    {
      "period": "string",
      "metrics": {
        "totalInventory": number,
        "newListings": number,
        "sold": number,
        "turnoverRate": number,
        "averageDaysOnMarket": number,
        "averagePrice": number,
        "averageMargin": number
      },
      "byCategory": [
        { "category": "string", "count": number, "averagePrice": number }
      ],
      "byLocation": [
        { "location": "string", "count": number, "turnoverRate": number }
      ],
      "trends": {
        "inventory": [{ "date": "string", "value": number }],
        "sales": [{ "date": "string", "value": number }],
        "avgPrice": [{ "date": "string", "value": number }]
      }
    }
```

---

## Data Models

```typescript
interface Listing {
  id: string;
  vehicleId: string;
  price: number;
  originalPrice: number;
  status: ListingStatus;
  visibility: 'draft' | 'published';
  locationId: string;
  description: string;
  highlights: string[];
  photos: ListingPhoto[];
  featured: boolean;
  featuredUntil?: Date;
  views: number;
  uniqueViews: number;
  favorites: number;
  inquiries: number;
  listedAt?: Date;
  soldAt?: Date;
  soldPrice?: number;
  buyerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum ListingStatus {
  DRAFT = 'draft',
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  PENDING = 'pending',
  SOLD = 'sold',
  REMOVED = 'removed'
}

interface ListingPhoto {
  id: string;
  listingId: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  order: number;
  uploadedAt: Date;
}

interface PriceHistory {
  id: string;
  listingId: string;
  previousPrice: number;
  newPrice: number;
  reason: string;
  changedBy: string;
  changedAt: Date;
}

interface Reservation {
  id: string;
  listingId: string;
  vehicleId: string;
  customerId: string;
  depositId?: string;
  status: 'active' | 'expired' | 'converted' | 'cancelled';
  reservedAt: Date;
  expiresAt: Date;
  convertedAt?: Date;
  cancelledAt?: Date;
}
```

---

## Business Rules

1. Firm pricing - no negotiation
2. Price changes logged with reason
3. Featured listings limited duration
4. Auto-price drop after X days (configurable)
5. Reserved vehicles held for 7 days
6. Photos required for publishing (min 10)
7. Sold listings archived, not deleted

---

## Scheduled Jobs

### Daily Price Review

```
Schedule: Daily at 6 AM
Action:
- Identify vehicles > 30 days on market
- Generate price drop recommendations
- Alert pricing team
```

### Stale Listing Alert

```
Schedule: Daily at 9 AM
Action:
- Flag listings > 60 days
- Escalate to management
- Consider wholesale transfer
```

---

## Monitoring

### Key Metrics

- Total active inventory
- Inventory turnover rate
- Average days to sale
- Price accuracy vs. market
- Photo coverage rate
- Featured listing performance
