# Warranty - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Warranty & Protection

---

## Overview

The Warranty backend manages warranty coverage, extended warranty sales, and claim processing.

---

## Domain Events

### Warranty

| Event | Description | Payload |
|-------|-------------|---------|
| `WarrantyIncluded` | Basic warranty activated | `{ warrantyId, vehicleId, coverage, startDate, endDate }` |
| `ExtendedWarrantyOffered` | Options presented | `{ offerId, coverageLevels[], offeredAt }` |
| `ExtendedWarrantyPurchased` | Extended bought | `{ warrantyId, coverageLevel, cost, purchasedAt }` |
| `WarrantyClaimSubmitted` | Claim filed | `{ claimId, warrantyId, issue, submittedAt }` |
| `WarrantyClaimApproved` | Claim accepted | `{ claimId, approvedAt, coverageAmount }` |
| `WarrantyServiceScheduled` | Service booked | `{ serviceId, scheduledDate, serviceCenter }` |

---

## API Endpoints

```
GET /api/v1/warranties/:vehicleId
  Description: Get warranty for vehicle
  Auth: Required
  Response: 200 OK
    {
      "warrantyId": "uuid",
      "vehicleId": "uuid",
      "type": "basic|extended",
      "status": "active|expired|void",
      "coverage": {
        "duration": "90 days",
        "mileage": 4500,
        "startDate": "ISO-8601",
        "endDate": "ISO-8601",
        "components": ["string"]
      },
      "deductible": number,
      "remainingDays": number,
      "remainingMileage": number
    }

GET /api/v1/warranties/:vehicleId/options
  Description: Get extended warranty options
  Auth: Required
  Response: 200 OK
    {
      "options": [
        {
          "optionId": "uuid",
          "name": "string",
          "duration": "string",
          "mileage": number,
          "price": number,
          "coverage": ["string"],
          "benefits": ["string"],
          "deductible": number,
          "isPopular": boolean
        }
      ]
    }

POST /api/v1/warranties/:vehicleId/extend
  Description: Purchase extended warranty
  Auth: Required
  Request Body:
    {
      "optionId": "uuid",
      "paymentMethodId": "uuid"
    }
  Response: 201 Created
    {
      "warrantyId": "uuid",
      "transactionId": "uuid",
      "coverage": { ... },
      "startDate": "ISO-8601",
      "endDate": "ISO-8601"
    }

POST /api/v1/warranty-claims
  Description: Submit warranty claim
  Auth: Required
  Request Body:
    {
      "vehicleId": "uuid",
      "category": "engine|transmission|electrical|ac|steering|brakes|other",
      "description": "string",
      "firstNoticed": "ISO-8601",
      "currentMileage": number,
      "photos": ["string"],
      "hasBeenInspected": boolean,
      "inspectionDetails": "string"
    }
  Response: 201 Created
    {
      "claimId": "uuid",
      "claimNumber": "string",
      "status": "submitted",
      "submittedAt": "ISO-8601",
      "estimatedReviewTime": "24 hours"
    }

GET /api/v1/warranty-claims/:claimId
  Description: Get claim details
  Auth: Required
  Response: 200 OK
    {
      "claimId": "uuid",
      "claimNumber": "string",
      "vehicleId": "uuid",
      "warrantyId": "uuid",
      "status": "submitted|under_review|approved|denied|service_scheduled|completed",
      "category": "string",
      "description": "string",
      "submittedAt": "ISO-8601",
      "reviewedAt": "ISO-8601",
      "decision": {
        "approved": boolean,
        "reason": "string",
        "coverageAmount": number,
        "customerCost": number
      },
      "service": {
        "scheduled": boolean,
        "date": "ISO-8601",
        "location": { ... }
      },
      "timeline": [
        { "event": "string", "timestamp": "ISO-8601" }
      ]
    }

GET /api/v1/warranty-claims
  Description: List user's claims
  Auth: Required
  Query: vehicleId, status, page, limit
  Response: 200 OK
    {
      "claims": ClaimSummary[],
      "pagination": { ... }
    }

POST /api/v1/warranty-claims/:claimId/service
  Description: Schedule service for approved claim
  Auth: Required
  Request Body:
    {
      "date": "ISO-8601",
      "timeSlot": "string",
      "serviceCenterId": "uuid"
    }
  Response: 200 OK
```

---

## Data Models

```typescript
interface Warranty {
  id: string;
  vehicleId: string;
  customerId: string;
  purchaseId: string;
  type: 'basic' | 'extended';
  planId?: string;
  status: 'active' | 'expired' | 'void';
  coverage: {
    durationDays: number;
    mileageLimit: number;
    components: string[];
  };
  deductible: number;
  startDate: Date;
  endDate: Date;
  startMileage: number;
  purchasedAt: Date;
  price?: number;
  createdAt: Date;
}

interface WarrantyClaim {
  id: string;
  claimNumber: string;
  warrantyId: string;
  vehicleId: string;
  customerId: string;
  category: string;
  description: string;
  firstNoticed: Date;
  mileageAtClaim: number;
  photos: string[];
  status: ClaimStatus;
  decision?: {
    approved: boolean;
    reason: string;
    coverageAmount: number;
    customerCost: number;
    decidedAt: Date;
    decidedBy: string;
  };
  service?: {
    scheduledDate: Date;
    serviceCenterId: string;
    completedAt?: Date;
    invoiceAmount?: number;
  };
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

enum ClaimStatus {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DENIED = 'denied',
  SERVICE_SCHEDULED = 'service_scheduled',
  COMPLETED = 'completed'
}
```

---

## Business Rules

1. Basic warranty included with every purchase
2. Extended warranty must be purchased within 30 days of delivery
3. Claims require active warranty with remaining coverage
4. Deductible applies per service visit
5. Pre-existing conditions excluded
6. Unauthorized modifications void warranty
7. Mileage verified at claim submission
