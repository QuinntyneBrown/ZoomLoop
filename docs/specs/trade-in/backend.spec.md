# Trade-In - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Trade-In
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** C

---

## Overview

Backend services for trade-in handle vehicle valuation using AI/ML models, offer management, and integration with the acquisition pipeline.

---

## API Endpoints

### POST /api/v1/trade-in/lookup

Lookup vehicle by plate or VIN.

**Request:**
```json
{
  "type": "plate",
  "plate": "ABCD123",
  "province": "ON"
}
```

**Response:**
```json
{
  "vehicle": {
    "vin": "1HGCV1F19MA123456",
    "make": "Honda",
    "model": "Civic",
    "year": 2021,
    "trim": "LX",
    "bodyType": "Sedan",
    "transmission": "Automatic",
    "fuelType": "Gasoline",
    "exteriorColor": "White"
  },
  "estimatedValueRange": {
    "min": 11000,
    "max": 14000
  }
}
```

---

### POST /api/v1/trade-in/offers

Generate trade-in offer.

**Request:**
```json
{
  "vin": "1HGCV1F19MA123456",
  "mileage": 45000,
  "condition": {
    "exterior": "good",
    "interior": "good",
    "accidentHistory": "minor",
    "mechanicalIssues": []
  },
  "photos": ["url1", "url2"]
}
```

**Response:**
```json
{
  "offerId": "offer_abc123",
  "amount": 1250000,
  "breakdown": {
    "marketValue": 1400000,
    "conditionAdjustment": -100000,
    "mileageAdjustment": -50000,
    "accidentAdjustment": -50000
  },
  "comparisonToDealerTrade": 150000,
  "validUntil": "2025-12-30T23:59:59Z",
  "createdAt": "2025-12-23T10:00:00Z"
}
```

---

### POST /api/v1/trade-in/offers/:offerId/accept

Accept trade-in offer.

**Response:**
```json
{
  "offerId": "offer_abc123",
  "status": "accepted",
  "acceptedAt": "2025-12-23T11:00:00Z",
  "nextSteps": [
    "Schedule appraisal",
    "Bring vehicle documents",
    "Complete trade-in during purchase"
  ]
}
```

---

### POST /api/v1/trade-in/offers/:offerId/appraisals

Schedule appraisal.

**Request:**
```json
{
  "location": "home",
  "address": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5V 2T6"
  },
  "preferredDate": "2025-12-26",
  "preferredTimeSlot": "10:00-12:00"
}
```

**Response:**
```json
{
  "appraisalId": "appr_xyz789",
  "offerId": "offer_abc123",
  "scheduledDate": "2025-12-26",
  "timeWindow": "10:00 AM - 12:00 PM",
  "location": "home",
  "address": { ... },
  "inspectorName": "John Smith",
  "confirmationNumber": "APR-2025-12345"
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `OfferRequested` | Trade-in started | `{ userId }` |
| `VehicleDetailsSubmitted` | Vehicle info provided | `{ vin, mileage, condition }` |
| `AIOfferGenerated` | AI valuation complete | `{ offerId, amount }` |
| `FirmOfferCreated` | Offer presented | `{ offerId, amount, validUntil }` |
| `OfferAccepted` | User accepts | `{ offerId }` |
| `OfferRejected` | User declines | `{ offerId, reason }` |
| `OfferExpired` | Offer expired | `{ offerId }` |
| `AppraisalScheduled` | Appraisal booked | `{ appraisalId, date }` |
| `VehicleInspected` | Inspection done | `{ appraisalId, condition }` |
| `OfferAdjusted` | Offer modified | `{ offerId, oldAmount, newAmount }` |
| `FinalOfferConfirmed` | Final price agreed | `{ offerId, finalAmount }` |
| `TradeInCompleted` | Trade-in finalized | `{ tradeInId, creditAmount }` |

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
