# Vehicle Listings - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Browse & Listings
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

Backend services for the Vehicle Listings feature handle inventory queries, filtering, pagination, and faceted search. The system must support high-volume concurrent requests while maintaining sub-200ms response times.

---

## Requirements

### REQ-VL-B-001: Paginated Vehicle Listing
**Description:** Return paginated list of vehicles with filters
**Priority:** High

**Acceptance Criteria:**
- [ ] Support pagination with configurable page size (default 24)
- [ ] Return total count and total pages
- [ ] Support all filter combinations
- [ ] Maintain consistent ordering across pages
- [ ] Response time < 200ms (p95)

### REQ-VL-B-002: Faceted Search
**Description:** Return filter facets with result counts
**Priority:** High

**Acceptance Criteria:**
- [ ] Return counts for each filter option
- [ ] Facets update based on applied filters
- [ ] Support nested facets (make -> model dependency)
- [ ] Cache facet results for performance

### REQ-VL-B-003: Filter Validation
**Description:** Validate and sanitize filter inputs
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Validate price ranges (min < max)
- [ ] Validate year ranges (min < max)
- [ ] Sanitize string inputs
- [ ] Return meaningful error messages

---

## API Endpoints

### GET /api/v1/vehicles

Primary vehicle listing endpoint with filtering and pagination.

**Request:**
```
GET /api/v1/vehicles?make=honda&priceMax=30000&sort=price_asc&page=1&limit=24
Authorization: Optional
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| make | string | No | Comma-separated makes |
| model | string | No | Comma-separated models |
| priceMin | integer | No | Minimum price |
| priceMax | integer | No | Maximum price |
| yearMin | integer | No | Minimum year |
| yearMax | integer | No | Maximum year |
| mileageMax | integer | No | Maximum mileage |
| bodyType | string | No | Comma-separated body types |
| transmission | string | No | "automatic" or "manual" |
| fuelType | string | No | Comma-separated fuel types |
| color | string | No | Comma-separated colors |
| certified | boolean | No | Only certified vehicles |
| sort | string | No | Sort field (default: best_match) |
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Results per page (default: 24, max: 100) |

**Response (200 OK):**
```json
{
  "vehicles": [
    {
      "id": "veh_abc123",
      "make": "Honda",
      "model": "Civic",
      "year": 2021,
      "trim": "LX",
      "price": 24999,
      "originalPrice": 26500,
      "mileage": 35420,
      "transmission": "automatic",
      "fuelType": "gasoline",
      "bodyType": "sedan",
      "exteriorColor": "White",
      "location": {
        "city": "Toronto",
        "province": "ON"
      },
      "primaryImage": {
        "url": "https://cdn.example.com/vehicles/abc123/1.webp",
        "alt": "2021 Honda Civic LX - Front View"
      },
      "imageCount": 12,
      "badges": ["CERTIFIED"],
      "isFavorite": false,
      "daysOnMarket": 5,
      "listingUrl": "/vehicle/veh_abc123"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 24,
    "totalCount": 1247,
    "totalPages": 52,
    "hasNextPage": true,
    "hasPreviousPage": false
  },
  "facets": {
    "makes": [
      { "value": "Honda", "count": 234, "selected": true },
      { "value": "Toyota", "count": 198, "selected": false }
    ],
    "models": [
      { "value": "Civic", "count": 89, "selected": false },
      { "value": "Accord", "count": 67, "selected": false }
    ],
    "bodyTypes": [
      { "value": "Sedan", "count": 456, "selected": false },
      { "value": "SUV", "count": 389, "selected": false }
    ],
    "transmissions": [
      { "value": "Automatic", "count": 1100, "selected": false },
      { "value": "Manual", "count": 147, "selected": false }
    ],
    "fuelTypes": [
      { "value": "Gasoline", "count": 980, "selected": false },
      { "value": "Hybrid", "count": 156, "selected": false }
    ],
    "priceRanges": [
      { "min": 0, "max": 15000, "count": 123 },
      { "min": 15000, "max": 25000, "count": 456 },
      { "min": 25000, "max": 35000, "count": 389 },
      { "min": 35000, "max": 50000, "count": 201 },
      { "min": 50000, "max": null, "count": 78 }
    ],
    "yearRanges": [
      { "min": 2022, "max": 2025, "count": 234 },
      { "min": 2019, "max": 2021, "count": 567 },
      { "min": 2016, "max": 2018, "count": 345 },
      { "min": 2010, "max": 2015, "count": 101 }
    ]
  },
  "appliedFilters": {
    "make": ["Honda"],
    "priceMax": 30000
  },
  "sortOptions": [
    { "value": "best_match", "label": "Best Match" },
    { "value": "price_asc", "label": "Price: Low to High" },
    { "value": "price_desc", "label": "Price: High to Low" },
    { "value": "mileage_asc", "label": "Mileage: Low to High" },
    { "value": "year_desc", "label": "Year: Newest First" },
    { "value": "recently_added", "label": "Recently Added" }
  ]
}
```

**Error Responses:**

```json
// 400 Bad Request - Invalid filters
{
  "error": "INVALID_FILTER",
  "message": "priceMin cannot be greater than priceMax",
  "details": {
    "field": "priceMin",
    "value": 50000,
    "constraint": "must be less than priceMax (30000)"
  }
}

// 400 Bad Request - Invalid pagination
{
  "error": "INVALID_PAGINATION",
  "message": "Page number exceeds total pages",
  "details": {
    "requestedPage": 100,
    "totalPages": 52
  }
}
```

---

### GET /api/v1/vehicles/filter-options

Returns available filter options for building filter UI.

**Response (200 OK):**
```json
{
  "makes": [
    { "name": "Honda", "slug": "honda", "models": ["Civic", "Accord", "CR-V"] },
    { "name": "Toyota", "slug": "toyota", "models": ["Camry", "Corolla", "RAV4"] }
  ],
  "bodyTypes": ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Van", "Convertible"],
  "transmissions": ["Automatic", "Manual"],
  "fuelTypes": ["Gasoline", "Diesel", "Hybrid", "Electric"],
  "colors": {
    "exterior": ["White", "Black", "Silver", "Gray", "Red", "Blue"],
    "interior": ["Black", "Gray", "Beige", "Brown"]
  },
  "priceRange": { "min": 5000, "max": 150000 },
  "yearRange": { "min": 2010, "max": 2025 },
  "mileageRange": { "min": 0, "max": 250000 }
}
```

---

## Domain Events

### Events Published

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleListedForSale` | Vehicle added to listings | `{ vehicleId, price, listedAt }` |
| `VehicleDeactivated` | Vehicle removed from listings | `{ vehicleId, reason, deactivatedAt }` |
| `VehiclePriceUpdated` | Price changed | `{ vehicleId, oldPrice, newPrice }` |
| `VehicleSold` | Vehicle sold | `{ vehicleId, soldAt, buyerId }` |
| `VehicleReserved` | Vehicle temporarily held | `{ vehicleId, reservedBy, reservedUntil }` |

### Event Schemas

```typescript
interface VehicleListedForSaleEvent {
  eventType: 'VehicleListedForSale';
  eventVersion: '1.0';
  eventId: string;
  timestamp: string;
  aggregateId: string;
  data: {
    vehicleId: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    location: { city: string; province: string };
    certificationStatus: string;
    listedAt: string;
  };
}

interface VehicleSoldEvent {
  eventType: 'VehicleSold';
  eventVersion: '1.0';
  eventId: string;
  timestamp: string;
  aggregateId: string;
  data: {
    vehicleId: string;
    listingId: string;
    finalPrice: number;
    buyerId: string;
    soldAt: string;
    daysOnMarket: number;
  };
}
```

---

## Data Models

### Vehicle Listing

```typescript
interface VehicleListing {
  id: string;
  vehicleId: string;

  // Vehicle info
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;

  // Pricing
  price: number;
  originalPrice: number | null;
  priceHistory: PriceChange[];

  // Specifications
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  bodyType: string;
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
  engineSize: string;
  mpgCity: number;
  mpgHighway: number;

  // Appearance
  exteriorColor: string;
  interiorColor: string;

  // Location
  location: {
    facilityId: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates: { lat: number; lng: number };
  };

  // Media
  images: VehicleImage[];
  primaryImageIndex: number;
  hasVideo: boolean;
  has360View: boolean;

  // Status
  status: 'available' | 'reserved' | 'pending_sale' | 'sold' | 'removed';
  certificationStatus: 'certified' | 'pending' | 'not_certified';
  badges: string[];

  // Metadata
  listedAt: string;
  updatedAt: string;
  daysOnMarket: number;
  viewCount: number;
  favoriteCount: number;
  inquiryCount: number;

  // Sorting scores
  relevanceScore: number;
  dealScore: number;
}

interface VehicleImage {
  url: string;
  thumbnailUrl: string;
  alt: string;
  position: number;
  type: 'exterior' | 'interior' | 'detail' | 'damage';
}

interface PriceChange {
  oldPrice: number;
  newPrice: number;
  changedAt: string;
  reason: string;
}
```

---

## Database Schema

```sql
-- Main listings table
CREATE TABLE vehicle_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    vin VARCHAR(17) NOT NULL,

    -- Vehicle details
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    trim VARCHAR(100),

    -- Pricing
    price INTEGER NOT NULL,
    original_price INTEGER,

    -- Specs
    mileage INTEGER NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    fuel_type VARCHAR(20) NOT NULL,
    body_type VARCHAR(30) NOT NULL,
    drivetrain VARCHAR(10),
    engine_size VARCHAR(20),
    exterior_color VARCHAR(50),
    interior_color VARCHAR(50),

    -- Location
    facility_id UUID REFERENCES facilities(id),
    city VARCHAR(100) NOT NULL,
    province VARCHAR(2) NOT NULL,
    postal_code VARCHAR(10),
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),

    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    certification_status VARCHAR(20) NOT NULL,
    badges TEXT[],

    -- Metadata
    listed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    sold_at TIMESTAMP WITH TIME ZONE,

    -- Counters
    view_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    inquiry_count INTEGER DEFAULT 0,

    -- Scores for sorting
    relevance_score DECIMAL(5, 2) DEFAULT 0,
    deal_score DECIMAL(5, 2) DEFAULT 0,

    -- Search
    search_vector tsvector
);

-- Indexes
CREATE INDEX idx_listings_status ON vehicle_listings(status);
CREATE INDEX idx_listings_make ON vehicle_listings(make);
CREATE INDEX idx_listings_model ON vehicle_listings(model);
CREATE INDEX idx_listings_price ON vehicle_listings(price);
CREATE INDEX idx_listings_year ON vehicle_listings(year);
CREATE INDEX idx_listings_mileage ON vehicle_listings(mileage);
CREATE INDEX idx_listings_body_type ON vehicle_listings(body_type);
CREATE INDEX idx_listings_listed_at ON vehicle_listings(listed_at DESC);
CREATE INDEX idx_listings_location ON vehicle_listings(province, city);
CREATE INDEX idx_listings_search ON vehicle_listings USING GIN(search_vector);

-- Compound indexes for common queries
CREATE INDEX idx_listings_make_model ON vehicle_listings(make, model);
CREATE INDEX idx_listings_price_range ON vehicle_listings(price) WHERE status = 'available';

-- Price history
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES vehicle_listings(id),
    old_price INTEGER NOT NULL,
    new_price INTEGER NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    reason VARCHAR(100)
);

-- Vehicle images
CREATE TABLE listing_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES vehicle_listings(id),
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    alt_text VARCHAR(200),
    position INTEGER NOT NULL,
    image_type VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_images_listing ON listing_images(listing_id, position);
```

---

## Caching Strategy

| Resource | Cache | TTL | Invalidation |
|----------|-------|-----|--------------|
| Filter options | CDN + Redis | 5 min | On inventory change |
| Vehicle list page 1 | Redis | 1 min | On any listing change |
| Vehicle list page 2+ | Redis | 2 min | On any listing change |
| Facet counts | Redis | 30 sec | On filter/listing change |
| Individual listing | Redis | 5 min | On listing update |

---

## Performance Requirements

- List query: < 200ms (p95)
- Facet computation: < 100ms (p95)
- Page size: 24 (optimal for 3-column grid)
- Concurrent users: 1000+
- Database connections: Pooled (max 100)

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)

## C4 Diagrams

See [c4-context.drawio](./c4-context.drawio) and [c4-container.drawio](./c4-container.drawio)
