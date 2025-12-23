# Vehicle Details - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Detail Page
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** A (MVP)

---

## Overview

Backend services for the Vehicle Details feature provide comprehensive vehicle information, history reports, inspection data, and similar vehicle recommendations.

---

## Requirements

### REQ-VD-B-001: Vehicle Detail Retrieval
**Description:** Return complete vehicle information
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Return all vehicle specifications and metadata
- [ ] Include all images with URLs
- [ ] Include pricing history
- [ ] Include certification status
- [ ] Response time < 100ms (cached)

### REQ-VD-B-002: Vehicle History Report
**Description:** Provide vehicle history information
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Integrate with CARFAX or similar provider
- [ ] Cache report for 24 hours
- [ ] Include accident history, owners, service records
- [ ] Generate PDF report on demand

### REQ-VD-B-003: Similar Vehicles
**Description:** Recommend related vehicles
**Priority:** Medium
**Phase:** B

**Acceptance Criteria:**
- [ ] Find vehicles similar by make/model/price
- [ ] Exclude current vehicle
- [ ] Return 4-6 recommendations
- [ ] Exclude sold/reserved vehicles

---

## API Endpoints

### GET /api/v1/vehicles/:vehicleId

Returns complete vehicle details.

**Request:**
```
GET /api/v1/vehicles/veh_abc123
Authorization: Optional
```

**Response (200 OK):**
```json
{
  "vehicle": {
    "id": "veh_abc123",
    "make": "Honda",
    "model": "Civic",
    "year": 2021,
    "trim": "LX",
    "vin": "1HGCV1F19MA123456",

    "pricing": {
      "price": 24999,
      "originalPrice": 26500,
      "priceReduced": true,
      "reducedAmount": 1501,
      "reducedPercentage": 5.7
    },

    "specifications": {
      "mileage": 35420,
      "transmission": "Automatic",
      "fuelType": "Gasoline",
      "bodyType": "Sedan",
      "drivetrain": "FWD",
      "engineSize": "2.0L 4-Cylinder",
      "horsepower": 158,
      "doors": 4,
      "seats": 5,
      "mpgCity": 30,
      "mpgHighway": 38,
      "exteriorColor": "White",
      "interiorColor": "Black"
    },

    "location": {
      "facilityId": "fac_tor01",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 2T6"
    },

    "images": [
      {
        "id": "img_001",
        "url": "https://cdn.example.com/vehicles/abc123/1.webp",
        "thumbnailUrl": "https://cdn.example.com/vehicles/abc123/1_thumb.webp",
        "alt": "2021 Honda Civic LX - Front exterior view",
        "position": 1,
        "type": "exterior"
      }
    ],

    "description": "This well-maintained 2021 Honda Civic LX...",

    "features": {
      "safety": [
        "Honda Sensing Suite",
        "Adaptive Cruise Control",
        "Lane Keeping Assist",
        "Collision Mitigation Braking"
      ],
      "comfort": [
        "Dual-Zone Climate Control",
        "Heated Front Seats",
        "Power Windows",
        "Remote Keyless Entry"
      ],
      "technology": [
        "Apple CarPlay",
        "Android Auto",
        "7-inch Touchscreen",
        "Bluetooth Connectivity"
      ],
      "exterior": [
        "LED Headlights",
        "Alloy Wheels",
        "Rear Spoiler"
      ]
    },

    "certification": {
      "status": "certified",
      "certifiedAt": "2025-12-15T10:00:00Z",
      "certificationNumber": "CERT-2025-12345"
    },

    "badges": ["CERTIFIED", "PRICE_DROP"],

    "metadata": {
      "listedAt": "2025-12-18T14:30:00Z",
      "updatedAt": "2025-12-22T09:00:00Z",
      "daysOnMarket": 5,
      "viewCount": 234,
      "favoriteCount": 12,
      "inquiryCount": 3
    }
  },
  "isFavorite": false
}
```

---

### GET /api/v1/vehicles/:vehicleId/history

Returns vehicle history report.

**Response (200 OK):**
```json
{
  "vehicleId": "veh_abc123",
  "vin": "1HGCV1F19MA123456",
  "reportProvider": "CARFAX",
  "reportGeneratedAt": "2025-12-20T08:00:00Z",

  "summary": {
    "accidentCount": 0,
    "ownerCount": 2,
    "hasOpenRecalls": false,
    "hasServiceRecords": true,
    "titleStatus": "clean"
  },

  "accidents": [],

  "owners": [
    {
      "ownerNumber": 1,
      "acquisitionDate": "2021-03-15",
      "dispositionDate": "2023-08-20",
      "location": "Toronto, ON",
      "type": "Personal"
    },
    {
      "ownerNumber": 2,
      "acquisitionDate": "2023-08-25",
      "dispositionDate": "2025-12-10",
      "location": "Mississauga, ON",
      "type": "Personal"
    }
  ],

  "serviceRecords": [
    {
      "date": "2023-06-15",
      "mileage": 25000,
      "description": "Oil change, tire rotation",
      "location": "Honda Dealership, Toronto"
    }
  ],

  "recalls": [],

  "reportUrl": "https://cdn.example.com/reports/abc123_carfax.pdf"
}
```

---

### GET /api/v1/vehicles/:vehicleId/inspection

Returns 210-point inspection report.

**Response (200 OK):**
```json
{
  "vehicleId": "veh_abc123",
  "inspectionId": "insp_xyz789",
  "inspectedAt": "2025-12-15T10:00:00Z",
  "inspectorId": "emp_123",

  "summary": {
    "totalPoints": 210,
    "passedPoints": 210,
    "failedPoints": 0,
    "status": "passed"
  },

  "categories": [
    {
      "name": "Exterior",
      "totalPoints": 42,
      "passedPoints": 42,
      "items": [
        { "name": "Paint condition", "status": "passed", "notes": null },
        { "name": "Body panels", "status": "passed", "notes": null }
      ]
    },
    {
      "name": "Interior",
      "totalPoints": 38,
      "passedPoints": 38,
      "items": []
    },
    {
      "name": "Mechanical",
      "totalPoints": 85,
      "passedPoints": 85,
      "items": []
    },
    {
      "name": "Safety",
      "totalPoints": 45,
      "passedPoints": 45,
      "items": []
    }
  ],

  "reportUrl": "https://cdn.example.com/inspections/xyz789.pdf"
}
```

---

### GET /api/v1/vehicles/:vehicleId/similar

Returns similar vehicles.

**Response (200 OK):**
```json
{
  "vehicles": [
    {
      "id": "veh_def456",
      "make": "Honda",
      "model": "Civic",
      "year": 2020,
      "trim": "EX",
      "price": 23500,
      "mileage": 42000,
      "location": { "city": "Toronto", "province": "ON" },
      "primaryImage": "https://cdn.example.com/vehicles/def456/1.webp",
      "badges": ["CERTIFIED"]
    }
  ],
  "totalCount": 6
}
```

---

## Domain Events

| Event | Trigger | Payload |
|-------|---------|---------|
| `VehicleViewed` | Detail page accessed | `{ vehicleId, userId, sessionId, timestamp }` |
| `VehicleHistoryReportViewed` | History report accessed | `{ vehicleId, userId, timestamp }` |
| `GetStartedClicked` | Purchase CTA clicked | `{ vehicleId, userId, timestamp }` |
| `VehicleReservationInitiated` | Reservation started | `{ vehicleId, userId, timestamp }` |

---

## Caching Strategy

| Resource | Cache | TTL | Invalidation |
|----------|-------|-----|--------------|
| Vehicle details | Redis | 5 min | On update |
| Vehicle images | CDN | 24 hrs | On update |
| History report | Redis | 24 hrs | Manual refresh |
| Inspection report | Redis | 7 days | On update |
| Similar vehicles | Redis | 5 min | On inventory change |

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
