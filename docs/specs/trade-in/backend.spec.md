# Trade-In - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Trade-In

---

## Overview

The Trade-In backend handles trade-in valuation, offer management, and credit application to purchases.

---

## Domain Events

### Trade-In Evaluation

| Event | Description | Payload |
|-------|-------------|---------|
| `TradeInRequested` | Trade-in initiated | `{ tradeInId, customerId, requestedAt }` |
| `TradeInDetailsSubmitted` | Vehicle info provided | `{ tradeInId, vehicleDetails, submittedAt }` |
| `TradeInOfferGenerated` | AI valuation | `{ tradeInId, offerAmount, generatedAt }` |
| `TradeInOfferAccepted` | Offer accepted | `{ tradeInId, acceptedAt }` |
| `TradeInOfferDeclined` | Offer declined | `{ tradeInId, declinedAt }` |

### Trade-In Processing

| Event | Description | Payload |
|-------|-------------|---------|
| `TradeInAppraisalScheduled` | Inspection booked | `{ appraisalId, scheduledDate, location }` |
| `TradeInInspected` | Vehicle evaluated | `{ appraisalId, inspectedAt, condition }` |
| `TradeInValueAdjusted` | Offer modified | `{ tradeInId, adjustedValue, reason }` |
| `TradeInCompleted` | Trade-in done | `{ tradeInId, finalValue, completedAt }` |
| `TradeInCreditApplied` | Credit applied | `{ purchaseId, tradeInCredit, appliedAt }` |

---

## API Endpoints

```
POST /api/v1/trade-ins
  Description: Create trade-in request
  Auth: Required
  Request Body:
    {
      "vin": "string",
      "make": "string",
      "model": "string",
      "year": number,
      "mileage": number,
      "condition": "excellent|good|fair|poor",
      "photos": ["string"]
    }
  Response: 201 Created
    {
      "tradeInId": "uuid",
      "offer": {
        "amount": number,
        "validUntil": "ISO-8601"
      },
      "vehicle": { ... }
    }

GET /api/v1/trade-ins/:tradeInId
  Description: Get trade-in details
  Auth: Required
  Response: 200 OK

POST /api/v1/trade-ins/:tradeInId/accept
  Description: Accept trade-in offer
  Auth: Required
  Response: 200 OK

POST /api/v1/trade-ins/:tradeInId/apply
  Description: Apply to purchase
  Auth: Required
  Request Body:
    {
      "purchaseId": "uuid"
    }
  Response: 200 OK
    {
      "applied": true,
      "purchaseId": "uuid",
      "credit": number,
      "newTotal": number
    }

POST /api/v1/trade-ins/:tradeInId/schedule-appraisal
  Description: Schedule physical appraisal
  Auth: Required
  Request Body:
    {
      "date": "ISO-8601",
      "timeWindow": "string",
      "location": "string"
    }
  Response: 200 OK
```

---

## Data Models

```typescript
interface TradeIn {
  id: string;
  customerId: string;
  purchaseId?: string;
  vehicleDetails: TradeInVehicle;
  offer: {
    amount: number;
    validUntil: Date;
    status: 'pending' | 'accepted' | 'declined' | 'expired';
  };
  appraisal?: {
    scheduledDate: Date;
    completedAt?: Date;
    actualCondition?: string;
    adjustedAmount?: number;
  };
  status: TradeInStatus;
  creditApplied: boolean;
  createdAt: Date;
  completedAt?: Date;
}

enum TradeInStatus {
  OFFER_PENDING = 'offer_pending',
  OFFER_ACCEPTED = 'offer_accepted',
  APPRAISAL_SCHEDULED = 'appraisal_scheduled',
  APPRAISED = 'appraised',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

---

## Business Rules

1. Trade-in offer valid for 7 days
2. Trade-in must be applied before purchase completion
3. Appraisal may adjust value based on condition
4. Trade-in collected at delivery/pickup
5. Payoff handled if trade-in has lien
