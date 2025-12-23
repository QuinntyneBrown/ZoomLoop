# Vehicle Search - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Browsing & Search

---

## Overview

The Vehicle Search backend provides search, filtering, and discovery capabilities for the vehicle inventory. It supports full-text search, faceted filtering, and personalized recommendations.

---

## Domain Events

### Search & Discovery

| Event | Description | Payload |
|-------|-------------|---------|
| `UserSearched` | Customer performs search | `{ userId, searchQuery, timestamp }` |
| `FilterApplied` | Search refined | `{ userId, filterType, filterValues[], timestamp }` |
| `SearchResultsDisplayed` | Results shown | `{ searchId, resultCount, results[] }` |
| `VehicleViewed` | Details accessed | `{ vehicleId, userId, viewedAt, duration }` |
| `VehicleCompared` | Comparison tool used | `{ userId, vehicleIds[], comparedAt }` |
| `FavoriteAdded` | Vehicle saved | `{ userId, vehicleId, favoritedAt }` |
| `FavoriteRemoved` | Vehicle unsaved | `{ userId, vehicleId, removedAt }` |

### Vehicle Details

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleHistoryReportViewed` | History accessed | `{ vehicleId, userId, viewedAt }` |
| `PhotoGalleryViewed` | Images browsed | `{ vehicleId, userId, photosViewed[] }` |
| `SpecificationsViewed` | Specs accessed | `{ vehicleId, userId, viewedAt }` |
| `PricingDetailsViewed` | Price examined | `{ vehicleId, userId, viewedAt }` |

---

## API Endpoints

### Search

```
GET /api/v1/vehicles/search
  Description: Search and filter vehicles
  Auth: Optional
  Query Parameters:
    - q: string (search query)
    - make: string[] (filter by makes)
    - model: string[] (filter by models)
    - priceMin: number
    - priceMax: number
    - yearMin: number
    - yearMax: number
    - mileageMax: number
    - bodyType: string[] (sedan, suv, truck, etc.)
    - transmission: string (automatic, manual)
    - fuelType: string[] (gasoline, diesel, hybrid, electric)
    - exteriorColor: string[]
    - interiorColor: string[]
    - features: string[]
    - certified: boolean
    - location: string (postal code for distance)
    - radius: number (km from location)
    - sort: string (best_match, price_asc, price_desc, mileage_asc, year_desc, recently_added)
    - page: number (default: 1)
    - limit: number (default: 24, max: 100)
  Response: 200 OK
    {
      "vehicles": [
        {
          "id": "uuid",
          "vin": "string",
          "make": "string",
          "model": "string",
          "year": number,
          "trim": "string",
          "price": number,
          "mileage": number,
          "bodyType": "string",
          "transmission": "string",
          "fuelType": "string",
          "exteriorColor": "string",
          "location": {
            "city": "string",
            "province": "string"
          },
          "thumbnailUrl": "string",
          "photoCount": number,
          "isCertified": boolean,
          "badges": ["string"],
          "daysOnMarket": number
        }
      ],
      "pagination": {
        "page": number,
        "limit": number,
        "totalCount": number,
        "totalPages": number
      },
      "facets": {
        "makes": [{ "value": "string", "count": number }],
        "models": [{ "value": "string", "count": number }],
        "bodyTypes": [{ "value": "string", "count": number }],
        "yearRange": { "min": number, "max": number },
        "priceRange": { "min": number, "max": number },
        "mileageRange": { "min": number, "max": number }
      },
      "searchId": "uuid"
    }

GET /api/v1/vehicles/suggestions
  Description: Autocomplete suggestions
  Auth: Optional
  Query Parameters:
    - q: string (partial query, min 2 chars)
    - limit: number (default: 8)
  Response: 200 OK
    {
      "suggestions": [
        {
          "type": "make" | "model" | "body_type" | "recent",
          "text": "string",
          "displayText": "string",
          "count": number,
          "metadata": {
            "make": "string",
            "model": "string"
          }
        }
      ]
    }

GET /api/v1/vehicles/popular
  Description: Popular/trending vehicles
  Auth: Optional
  Query Parameters:
    - limit: number (default: 10)
  Response: 200 OK
    {
      "vehicles": Vehicle[]
    }

GET /api/v1/vehicles/recently-viewed
  Description: User's recently viewed vehicles
  Auth: Required
  Query Parameters:
    - limit: number (default: 10)
  Response: 200 OK
    {
      "vehicles": Vehicle[]
    }
```

### Vehicle Details

```
GET /api/v1/vehicles/:vehicleId
  Description: Full vehicle details
  Auth: Optional
  Response: 200 OK
    {
      "id": "uuid",
      "vin": "string",
      "make": "string",
      "model": "string",
      "year": number,
      "trim": "string",
      "price": number,
      "originalPrice": number,
      "mileage": number,
      "bodyType": "string",
      "transmission": "string",
      "drivetrain": "string",
      "fuelType": "string",
      "engine": {
        "displacement": "string",
        "cylinders": number,
        "horsepower": number,
        "torque": number
      },
      "exteriorColor": "string",
      "interiorColor": "string",
      "interiorMaterial": "string",
      "seatingCapacity": number,
      "doors": number,
      "photos": [
        {
          "url": "string",
          "thumbnailUrl": "string",
          "caption": "string",
          "order": number
        }
      ],
      "features": {
        "safety": ["string"],
        "comfort": ["string"],
        "technology": ["string"],
        "exterior": ["string"],
        "performance": ["string"]
      },
      "specifications": {
        "dimensions": {
          "length": "string",
          "width": "string",
          "height": "string",
          "wheelbase": "string"
        },
        "weight": "string",
        "fuelEconomy": {
          "city": "string",
          "highway": "string",
          "combined": "string"
        },
        "tankCapacity": "string"
      },
      "location": {
        "city": "string",
        "province": "string",
        "postalCode": "string"
      },
      "certification": {
        "isCertified": boolean,
        "certificationNumber": "string",
        "certifiedAt": "ISO-8601",
        "inspectionPoints": number
      },
      "vehicleHistory": {
        "reportAvailable": boolean,
        "accidents": number,
        "owners": number,
        "serviceRecords": boolean
      },
      "warranty": {
        "included": boolean,
        "type": "string",
        "coverage": "string",
        "expiresAt": "ISO-8601"
      },
      "status": "available" | "reserved" | "sold",
      "listedAt": "ISO-8601",
      "daysOnMarket": number,
      "viewCount": number
    }

GET /api/v1/vehicles/:vehicleId/history
  Description: Vehicle history report
  Auth: Optional
  Response: 200 OK
    {
      "reportUrl": "string",
      "summary": {
        "accidents": number,
        "owners": number,
        "titleStatus": "string",
        "odometerStatus": "string"
      },
      "generatedAt": "ISO-8601"
    }

GET /api/v1/vehicles/:vehicleId/similar
  Description: Similar vehicles
  Auth: Optional
  Query Parameters:
    - limit: number (default: 4)
  Response: 200 OK
    {
      "vehicles": Vehicle[]
    }

POST /api/v1/vehicles/:vehicleId/view
  Description: Record vehicle view
  Auth: Optional
  Request Body:
    {
      "sessionId": "string",
      "referrer": "string"
    }
  Response: 204 No Content
```

### Favorites

```
GET /api/v1/favorites
  Description: Get user's favorites
  Auth: Required
  Query Parameters:
    - page: number
    - limit: number
    - sort: string
  Response: 200 OK
    {
      "vehicles": Vehicle[],
      "pagination": { ... }
    }

POST /api/v1/favorites
  Description: Add to favorites
  Auth: Required
  Request Body:
    {
      "vehicleId": "uuid"
    }
  Response: 201 Created
    {
      "favoriteId": "uuid",
      "createdAt": "ISO-8601"
    }

DELETE /api/v1/favorites/:vehicleId
  Description: Remove from favorites
  Auth: Required
  Response: 204 No Content

GET /api/v1/favorites/check
  Description: Check if vehicles are favorited
  Auth: Required
  Query Parameters:
    - vehicleIds: string[] (comma-separated)
  Response: 200 OK
    {
      "favorited": {
        "vehicle-id-1": true,
        "vehicle-id-2": false
      }
    }
```

### Compare

```
GET /api/v1/vehicles/compare
  Description: Get vehicles for comparison
  Auth: Optional
  Query Parameters:
    - vehicleIds: string[] (comma-separated, max 4)
  Response: 200 OK
    {
      "vehicles": Vehicle[],
      "comparison": {
        "categories": [
          {
            "name": "Performance",
            "items": [
              {
                "label": "Horsepower",
                "values": ["186 hp", "192 hp", "180 hp"]
              }
            ]
          }
        ]
      }
    }
```

---

## Data Models

### Vehicle

```typescript
interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  originalPrice?: number;
  mileage: number;
  bodyType: BodyType;
  transmission: Transmission;
  drivetrain: Drivetrain;
  fuelType: FuelType;
  engine: Engine;
  exteriorColor: string;
  interiorColor: string;
  interiorMaterial: string;
  seatingCapacity: number;
  doors: number;
  photos: VehiclePhoto[];
  features: VehicleFeatures;
  specifications: VehicleSpecifications;
  location: VehicleLocation;
  certification: VehicleCertification;
  vehicleHistory: VehicleHistorySummary;
  warranty: VehicleWarranty;
  status: VehicleStatus;
  listingId: string;
  listedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

enum BodyType {
  SEDAN = 'sedan',
  SUV = 'suv',
  TRUCK = 'truck',
  COUPE = 'coupe',
  HATCHBACK = 'hatchback',
  VAN = 'van',
  CONVERTIBLE = 'convertible',
  WAGON = 'wagon'
}

enum VehicleStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  SOLD = 'sold',
  PENDING = 'pending'
}
```

### Search Index Document

```typescript
interface VehicleSearchDocument {
  id: string;
  vin: string;
  make: string;
  makeNormalized: string;
  model: string;
  modelNormalized: string;
  year: number;
  trim: string;
  fullTitle: string; // "2021 Honda Civic LX"
  price: number;
  mileage: number;
  bodyType: string;
  transmission: string;
  fuelType: string;
  exteriorColor: string;
  location: {
    city: string;
    province: string;
    geoPoint: { lat: number; lon: number };
  };
  isCertified: boolean;
  badges: string[];
  features: string[];
  status: string;
  listedAt: Date;
  viewCount: number;
  favoriteCount: number;
  thumbnailUrl: string;
  photoCount: number;
}
```

### Favorite

```typescript
interface Favorite {
  id: string;
  userId: string;
  vehicleId: string;
  createdAt: Date;
  notifyOnPriceChange: boolean;
  notifyOnSold: boolean;
}
```

### Search History

```typescript
interface SearchHistory {
  id: string;
  userId?: string;
  sessionId: string;
  query: string;
  filters: Record<string, any>;
  resultCount: number;
  timestamp: Date;
}
```

---

## Search Engine

### Technology

- **Primary**: Elasticsearch 8.x
- **Fallback**: PostgreSQL full-text search

### Index Configuration

```json
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1,
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
            "awd,all wheel drive,4wd,four wheel drive",
            "mpv,minivan,van"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "fullTitle": { "type": "text", "analyzer": "vehicle_analyzer" },
      "make": { "type": "keyword" },
      "model": { "type": "keyword" },
      "year": { "type": "integer" },
      "price": { "type": "integer" },
      "mileage": { "type": "integer" },
      "location.geoPoint": { "type": "geo_point" },
      "listedAt": { "type": "date" }
    }
  }
}
```

### Scoring Algorithm

```
Base Score:
- Text relevance (BM25)
- Boost factors:
  - Certified: 1.2x
  - Featured: 1.5x
  - Low mileage: 1.1x
  - Recent listing: 1.1x

Sorting Options:
- best_match: Relevance + popularity
- price_asc/desc: Price sort
- mileage_asc: Mileage sort
- year_desc: Newest first
- recently_added: ListedAt desc
```

---

## Business Rules

### Search

1. Minimum 2 characters for autocomplete
2. Max 100 results per page
3. Stale listings (>90 days) deprioritized
4. Sold vehicles excluded by default
5. Reserved vehicles shown with indicator

### Favorites

1. Max 100 favorites per user
2. Favorites persist across sessions
3. Guest favorites stored locally, merged on signup
4. Price change notifications optional

### Recommendations

1. Similar vehicles based on:
   - Same make/model different year
   - Same price range (+/- 20%)
   - Same body type
   - Similar mileage

---

## Caching Strategy

### Redis Cache

```
Vehicle List: 5 minutes
- Key: search:{hash_of_params}
- Invalidate: On new listing or price change

Vehicle Detail: 15 minutes
- Key: vehicle:{vehicleId}
- Invalidate: On update

Suggestions: 1 hour
- Key: suggestions:{prefix}
- Invalidate: On inventory changes

Facets: 30 minutes
- Key: facets:global
- Invalidate: On significant inventory change
```

---

## Service Dependencies

### External Services

- **Elasticsearch**: Full-text search
- **Redis**: Caching layer
- **CDN**: Image delivery
- **VIN Decoder**: Vehicle data enrichment

### Internal Services

- **Inventory Service**: Vehicle data source
- **User Service**: Favorites, history
- **Analytics Service**: View tracking
- **Notification Service**: Price alerts

---

## Performance

### Target Metrics

- Search response: < 200ms (p95)
- Autocomplete: < 100ms (p95)
- Vehicle detail: < 150ms (p95)
- Max concurrent searches: 1000/sec

### Optimization

- Query result caching
- Scroll-based pagination for deep pages
- Async view tracking
- Edge caching for static data

---

## Monitoring

### Key Metrics

- Search latency (p50, p95, p99)
- Search volume per minute
- Zero-result rate
- Click-through rate
- Favorite conversion rate
- Cache hit rate

### Alerts

- Latency > 500ms for 5 minutes
- Error rate > 1%
- Zero-result rate > 30%
- Elasticsearch cluster health
