# Test Ownership - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Test Ownership & Returns
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** C

---

## Overview

Backend services for the test ownership feature manage trial periods, return processing, refund calculations, and vehicle exchange workflows.

---

## API Endpoints

### GET /api/v1/trials/:trialId

Get trial period status.

**Response:**
```json
{
  "trialId": "trial_abc123",
  "orderId": "ord_xyz789",
  "vehicleId": "veh_def456",
  "vehicle": {
    "make": "Honda",
    "model": "Civic",
    "year": 2021
  },
  "status": "active",
  "startDate": "2025-12-28T13:45:00Z",
  "endDate": "2026-01-07T23:59:59Z",
  "daysRemaining": 7,
  "startMileage": 35420,
  "currentMileage": 35647,
  "mileageUsed": 227,
  "mileageRemaining": 523,
  "limits": {
    "maxDays": 10,
    "maxMileage": 750
  },
  "conditions": {
    "noAccidents": true,
    "noModifications": true,
    "noDamage": true
  }
}
```

---

### POST /api/v1/trials/:trialId/returns

Initiate return request.

**Request:**
```json
{
  "reason": "vehicle_expectations",
  "reasonDetails": "Interior space smaller than expected",
  "conditionConfirmation": {
    "noAccidents": true,
    "noModifications": true,
    "noDamage": true
  },
  "currentMileage": 35652
}
```

**Response:**
```json
{
  "returnId": "ret_abc123",
  "trialId": "trial_abc123",
  "status": "pending_pickup",
  "refundEstimate": {
    "purchaseAmount": 1994200,
    "nonRefundableFees": 29900,
    "estimatedRefund": 1964300
  },
  "nextSteps": [
    "Schedule pickup",
    "Prepare vehicle and documents",
    "Await inspection"
  ],
  "createdAt": "2025-12-30T10:00:00Z"
}
```

---

### POST /api/v1/trials/:trialId/returns/:returnId/pickup

Schedule return pickup.

**Request:**
```json
{
  "address": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5V 2T6"
  },
  "preferredDate": "2025-12-30",
  "preferredTimeWindow": "12:00-15:00"
}
```

**Response:**
```json
{
  "pickupId": "pick_xyz789",
  "returnId": "ret_abc123",
  "scheduledDate": "2025-12-30",
  "timeWindow": "12:00 PM - 3:00 PM",
  "address": { ... },
  "confirmationNumber": "RET-2025-12345"
}
```

---

### POST /api/v1/trials/:trialId/exchanges

Initiate vehicle exchange.

**Request:**
```json
{
  "newVehicleId": "veh_new123",
  "conditionConfirmation": {
    "noAccidents": true,
    "noModifications": true,
    "noDamage": true
  },
  "currentMileage": 35652
}
```

**Response:**
```json
{
  "exchangeId": "exch_abc123",
  "trialId": "trial_abc123",
  "status": "pending_approval",
  "currentVehicle": {
    "id": "veh_def456",
    "title": "2021 Honda Civic LX",
    "purchasePrice": 2499900
  },
  "newVehicle": {
    "id": "veh_new123",
    "title": "2021 Toyota Corolla LE",
    "price": 2399900
  },
  "priceDifference": -100000,
  "action": "refund_difference",
  "nextSteps": [
    "Return current vehicle",
    "New vehicle prepared",
    "Schedule new delivery"
  ]
}
```

---

### POST /api/v1/trials/:trialId/complete

Complete trial and keep vehicle.

**Response:**
```json
{
  "trialId": "trial_abc123",
  "status": "completed",
  "outcome": "kept",
  "completedAt": "2025-12-31T10:00:00Z",
  "message": "Congratulations! Your vehicle purchase is now final."
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `TestOwnershipStarted` | Trial begins | `{ trialId, vehicleId, endDate, maxMileage }` |
| `TestDriveCompleted` | Mileage recorded | `{ trialId, mileageDriven }` |
| `MileageTracked` | Periodic tracking | `{ trialId, currentMileage }` |
| `TestPeriodDayElapsed` | Daily check | `{ trialId, dayNumber }` |
| `TestPeriodExpired` | Trial ended | `{ trialId, finalMileage }` |
| `ReturnRequested` | Return initiated | `{ returnId, trialId, reason }` |
| `ExchangeRequested` | Exchange initiated | `{ exchangeId, trialId, newVehicleId }` |
| `ReturnConditionVerified` | Inspection passed | `{ returnId, inspectionResult }` |
| `RefundApproved` | Refund authorized | `{ returnId, amount }` |
| `RefundProcessed` | Refund sent | `{ returnId, amount, processedAt }` |
| `VehicleReturned` | Vehicle received | `{ returnId, returnMileage }` |
| `VehicleExchanged` | Exchange complete | `{ exchangeId, newVehicleId }` |
| `VehicleKept` | Trial completed successfully | `{ trialId }` |

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
