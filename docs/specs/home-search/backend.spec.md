# Home & Search - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Home Page & Vehicle Search
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

The backend services for Home & Search provide vehicle discovery, search suggestions, and content management for the homepage. This includes real-time search indexing, autocomplete functionality, and featured vehicle curation.

---

## Requirements

### REQ-HS-B-001: Vehicle Search Index
**Description:** Maintain searchable index of all listed vehicles
**Priority:** High
**Type:** Functional

**Acceptance Criteria:**
- [ ] All active vehicle listings are indexed within 60 seconds of creation/update
- [ ] Index supports full-text search on make, model, year, description
- [ ] Index supports faceted filtering on all filter attributes
- [ ] Search queries return results within 200ms (p95)
- [ ] Index rebuilds automatically on schema changes

### REQ-HS-B-002: Autocomplete Suggestions
**Description:** Provide real-time search suggestions
**Priority:** High
**Type:** Functional

**Acceptance Criteria:**
- [ ] Suggestions returned within 100ms
- [ ] Suggestions ranked by relevance and inventory count
- [ ] Support for typo tolerance (Levenshtein distance 1-2)
- [ ] Prefix matching for partial queries
- [ ] Results limited to 8 suggestions maximum

### REQ-HS-B-003: Featured Vehicles Selection
**Description:** Curate and serve featured vehicles
**Priority:** Medium
**Type:** Functional

**Acceptance Criteria:**
- [ ] Support manual curation by admin users
- [ ] Automatic selection based on criteria (new arrivals, best deals)
- [ ] Featured vehicles refresh on configurable schedule
- [ ] Exclude sold/reserved vehicles from featured list
- [ ] Support A/B testing of featured selections

### REQ-HS-B-004: Search Analytics
**Description:** Track and analyze search patterns
**Priority:** Medium
**Type:** Non-Functional

**Acceptance Criteria:**
- [ ] Log all search queries with timestamps
- [ ] Track zero-result searches for improvement
- [ ] Aggregate popular search terms
- [ ] Measure search-to-view conversion rate
- [ ] Support for search result personalization (future)

---

## API Endpoints

### GET /api/v1/vehicles/makes

Returns list of all vehicle makes with inventory counts.

**Request:**
```
GET /api/v1/vehicles/makes
Authorization: Optional
```

**Response (200 OK):**
```json
{
  "makes": [
    { "name": "Honda", "slug": "honda", "count": 234 },
    { "name": "Toyota", "slug": "toyota", "count": 198 },
    { "name": "Ford", "slug": "ford", "count": 156 }
  ],
  "totalCount": 45
}
```

**Caching:** 5 minutes (CDN cacheable)

---

### GET /api/v1/vehicles/models

Returns models for a specific make with inventory counts.

**Request:**
```
GET /api/v1/vehicles/models?make=honda
Authorization: Optional
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| make | string | Yes | Make slug or name |

**Response (200 OK):**
```json
{
  "make": "Honda",
  "models": [
    { "name": "Civic", "slug": "civic", "count": 89 },
    { "name": "Accord", "slug": "accord", "count": 67 },
    { "name": "CR-V", "slug": "cr-v", "count": 45 }
  ],
  "totalCount": 12
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "INVALID_MAKE",
  "message": "Make 'xyz' not found in inventory"
}
```

---

### GET /api/v1/vehicles/suggestions

Returns search autocomplete suggestions.

**Request:**
```
GET /api/v1/vehicles/suggestions?q=hon
Authorization: Optional
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query (min 2 chars) |
| limit | number | No | Max results (default: 8) |

**Response (200 OK):**
```json
{
  "query": "hon",
  "suggestions": [
    {
      "type": "make",
      "text": "Honda",
      "slug": "honda",
      "count": 234,
      "highlight": "<em>Hon</em>da"
    },
    {
      "type": "model",
      "text": "Honda Civic",
      "slug": "honda-civic",
      "count": 89,
      "highlight": "<em>Hon</em>da Civic"
    },
    {
      "type": "model",
      "text": "Honda Accord",
      "slug": "honda-accord",
      "count": 67,
      "highlight": "<em>Hon</em>da Accord"
    }
  ],
  "totalResults": 3
}
```

**Performance:** < 100ms p95

---

### GET /api/v1/vehicles/featured

Returns curated featured vehicles for homepage.

**Request:**
```
GET /api/v1/vehicles/featured
Authorization: Optional
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| limit | number | No | Number of vehicles (default: 8) |
| location | string | No | User location for relevance |

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
      "mileage": 35420,
      "location": {
        "city": "Toronto",
        "province": "ON"
      },
      "primaryImage": {
        "url": "https://cdn.example.com/vehicles/abc123/main.webp",
        "alt": "2021 Honda Civic LX - Front view"
      },
      "badges": ["CERTIFIED"],
      "isFavorite": false,
      "listingUrl": "/vehicle/veh_abc123"
    }
  ],
  "totalCount": 8,
  "refreshedAt": "2025-12-23T10:00:00Z"
}
```

---

### GET /api/v1/vehicles/search

Primary vehicle search endpoint.

**Request:**
```
GET /api/v1/vehicles/search?q=honda+civic&priceMax=30000&yearMin=2020
Authorization: Optional
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | No | Full-text search query |
| make | string | No | Filter by make(s), comma-separated |
| model | string | No | Filter by model(s) |
| priceMin | number | No | Minimum price |
| priceMax | number | No | Maximum price |
| yearMin | number | No | Minimum year |
| yearMax | number | No | Maximum year |
| mileageMax | number | No | Maximum mileage |
| bodyType | string | No | Body type(s), comma-separated |
| transmission | string | No | "automatic" or "manual" |
| fuelType | string | No | Fuel type(s) |
| color | string | No | Exterior color(s) |
| sort | string | No | Sort order (see below) |
| page | number | No | Page number (default: 1) |
| limit | number | No | Results per page (default: 24) |

**Sort Options:**
- `best_match` (default)
- `price_asc`
- `price_desc`
- `mileage_asc`
- `year_desc`
- `recently_added`

**Response (200 OK):**
```json
{
  "vehicles": [...],
  "pagination": {
    "page": 1,
    "limit": 24,
    "totalCount": 1247,
    "totalPages": 52
  },
  "facets": {
    "makes": [
      { "name": "Honda", "count": 234 },
      { "name": "Toyota", "count": 198 }
    ],
    "bodyTypes": [
      { "name": "Sedan", "count": 456 },
      { "name": "SUV", "count": 389 }
    ],
    "priceRanges": [
      { "min": 0, "max": 15000, "count": 123 },
      { "min": 15000, "max": 25000, "count": 456 }
    ],
    "yearRanges": [
      { "min": 2022, "max": 2025, "count": 234 },
      { "min": 2019, "max": 2021, "count": 567 }
    ]
  },
  "appliedFilters": {
    "q": "honda civic",
    "priceMax": 30000,
    "yearMin": 2020
  },
  "searchId": "srch_xyz789"
}
```

---

### GET /api/v1/content/homepage

Returns homepage content configuration.

**Request:**
```
GET /api/v1/content/homepage
Authorization: Optional
```

**Response (200 OK):**
```json
{
  "hero": {
    "title": "Find Your Perfect Car",
    "subtitle": "Shop thousands of certified used vehicles with 10-day guarantee",
    "backgroundImage": {
      "desktop": "https://cdn.example.com/hero/desktop.webp",
      "mobile": "https://cdn.example.com/hero/mobile.webp"
    },
    "cta": {
      "text": "Start Shopping",
      "url": "/browse"
    }
  },
  "howItWorks": [
    {
      "step": 1,
      "icon": "search",
      "title": "Search",
      "description": "Browse thousands of certified vehicles online"
    },
    {
      "step": 2,
      "icon": "check",
      "title": "Choose",
      "description": "Review details & complete your purchase securely"
    },
    {
      "step": 3,
      "icon": "car",
      "title": "Get It Delivered",
      "description": "We deliver to your door with 10-day guarantee"
    }
  ],
  "valueProps": [
    {
      "icon": "inspection",
      "title": "210-Point Inspection",
      "description": "Every vehicle thoroughly inspected"
    },
    {
      "icon": "guarantee",
      "title": "10-Day Money Back",
      "description": "Love it or return it, no questions asked"
    },
    {
      "icon": "delivery",
      "title": "Free Delivery",
      "description": "Delivered to your door within days"
    },
    {
      "icon": "pricing",
      "title": "No-Haggle Pricing",
      "description": "Our best price, always"
    }
  ],
  "testimonials": [
    {
      "id": "test_001",
      "quote": "The easiest car buying experience I've ever had!",
      "author": "Sarah M.",
      "location": "Toronto, ON",
      "vehicle": "2021 Honda Civic",
      "rating": 5
    }
  ]
}
```

---

## Domain Events

### Events Published

| Event | Description | Payload |
|-------|-------------|---------|
| `UserSearched` | User submits a search query | `{ searchId, userId, query, filters, timestamp }` |
| `SearchResultsDisplayed` | Search results rendered | `{ searchId, resultCount, responseTime }` |
| `FilterApplied` | User applies a filter | `{ searchId, filterType, filterValue }` |
| `VehicleViewed` | Vehicle detail page viewed | `{ vehicleId, userId, source, searchId }` |

### Event Schemas

```typescript
interface UserSearchedEvent {
  eventType: 'UserSearched';
  eventVersion: '1.0';
  eventId: string;
  timestamp: string;
  data: {
    searchId: string;
    userId: string | null;
    sessionId: string;
    query: string | null;
    filters: {
      make?: string[];
      model?: string[];
      priceMin?: number;
      priceMax?: number;
      yearMin?: number;
      yearMax?: number;
      mileageMax?: number;
      bodyType?: string[];
      transmission?: string;
      fuelType?: string[];
    };
    source: 'hero_search' | 'header_search' | 'browse_page';
  };
}

interface SearchResultsDisplayedEvent {
  eventType: 'SearchResultsDisplayed';
  eventVersion: '1.0';
  eventId: string;
  timestamp: string;
  data: {
    searchId: string;
    resultCount: number;
    page: number;
    responseTimeMs: number;
    hasZeroResults: boolean;
  };
}
```

---

## Data Models

### Vehicle Search Document

```typescript
interface VehicleSearchDocument {
  id: string;

  // Core fields
  make: string;
  model: string;
  year: number;
  trim: string;
  vin: string;

  // Pricing
  price: number;
  originalPrice?: number;
  priceReduced: boolean;

  // Specs
  mileage: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'gasoline' | 'diesel' | 'hybrid' | 'electric';
  bodyType: string;
  drivetrain: 'fwd' | 'rwd' | 'awd' | '4wd';
  engineSize: string;

  // Colors
  exteriorColor: string;
  interiorColor: string;

  // Location
  location: {
    city: string;
    province: string;
    postalCode: string;
    lat: number;
    lng: number;
  };

  // Status
  status: 'available' | 'reserved' | 'pending_sale' | 'sold';
  certificationStatus: 'certified' | 'pending' | 'not_certified';

  // Metadata
  createdAt: string;
  updatedAt: string;
  listedAt: string;
  daysOnMarket: number;
  viewCount: number;
  favoriteCount: number;

  // Images
  primaryImageUrl: string;
  imageCount: number;

  // Search optimization
  searchText: string; // Concatenated searchable fields
  sortScore: number; // Pre-computed relevance score
}
```

### Featured Vehicle Configuration

```typescript
interface FeaturedVehicleConfig {
  id: string;
  vehicleId: string;
  position: number;
  startDate: string;
  endDate: string | null;
  selectionType: 'manual' | 'automatic';
  selectionCriteria?: {
    minDaysOnMarket?: number;
    maxDaysOnMarket?: number;
    priceRange?: { min: number; max: number };
    makes?: string[];
    featured?: boolean;
  };
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}
```

---

## Database Schema

### Tables

```sql
-- Search analytics
CREATE TABLE search_queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id VARCHAR(50) NOT NULL,
    user_id UUID,
    session_id VARCHAR(100) NOT NULL,
    query TEXT,
    filters JSONB,
    result_count INTEGER,
    response_time_ms INTEGER,
    source VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_search_queries_created_at ON search_queries(created_at);
CREATE INDEX idx_search_queries_user_id ON search_queries(user_id);

-- Featured vehicles
CREATE TABLE featured_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    position INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    selection_type VARCHAR(20) NOT NULL,
    selection_criteria JSONB,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_featured_vehicles_position ON featured_vehicles(position) WHERE is_active = true;
CREATE INDEX idx_featured_vehicles_vehicle_id ON featured_vehicles(vehicle_id);

-- Popular searches (aggregated)
CREATE TABLE popular_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    query TEXT NOT NULL,
    normalized_query TEXT NOT NULL,
    search_count INTEGER DEFAULT 1,
    result_count_avg INTEGER,
    last_searched_at TIMESTAMP WITH TIME ZONE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_popular_searches_query_period ON popular_searches(normalized_query, period_start);
```

---

## Search Implementation

### Elasticsearch Mapping

```json
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "make": {
        "type": "text",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": {
            "type": "completion",
            "analyzer": "simple"
          }
        }
      },
      "model": {
        "type": "text",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { "type": "completion" }
        }
      },
      "year": { "type": "integer" },
      "price": { "type": "integer" },
      "mileage": { "type": "integer" },
      "bodyType": { "type": "keyword" },
      "transmission": { "type": "keyword" },
      "fuelType": { "type": "keyword" },
      "location": {
        "type": "object",
        "properties": {
          "city": { "type": "keyword" },
          "province": { "type": "keyword" },
          "geoPoint": { "type": "geo_point" }
        }
      },
      "status": { "type": "keyword" },
      "listedAt": { "type": "date" },
      "searchText": {
        "type": "text",
        "analyzer": "vehicle_analyzer"
      }
    }
  },
  "settings": {
    "analysis": {
      "analyzer": {
        "vehicle_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding", "vehicle_synonyms"]
        }
      },
      "filter": {
        "vehicle_synonyms": {
          "type": "synonym",
          "synonyms": [
            "suv,sport utility vehicle",
            "auto,automatic",
            "4wd,4x4,four wheel drive",
            "awd,all wheel drive"
          ]
        }
      }
    }
  }
}
```

---

## Caching Strategy

| Resource | Cache Location | TTL | Invalidation |
|----------|---------------|-----|--------------|
| Makes list | CDN + Redis | 5 min | On inventory change |
| Models list | CDN + Redis | 5 min | On inventory change |
| Suggestions | Application | Session | None (short-lived) |
| Featured vehicles | Redis | 1 min | On featured update |
| Search results | None | - | Real-time |
| Homepage content | CDN | 15 min | On content update |

---

## Error Handling

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| SEARCH_TIMEOUT | 504 | Search exceeded timeout (5s) |
| INVALID_FILTERS | 400 | Invalid filter parameters |
| SEARCH_SERVICE_UNAVAILABLE | 503 | Search index unavailable |
| RATE_LIMITED | 429 | Too many search requests |

---

## Non-Functional Requirements

### Performance
- Search response time: < 200ms (p95)
- Suggestions response time: < 100ms (p95)
- Featured vehicles: < 50ms (cached)

### Scalability
- Support 1000+ concurrent searches
- Index up to 50,000 vehicles
- Handle 10,000+ searches per minute

### Availability
- 99.9% uptime for search service
- Graceful degradation if search unavailable

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)

## C4 Diagrams

See [c4-context.drawio](./c4-context.drawio) and [c4-container.drawio](./c4-container.drawio)
