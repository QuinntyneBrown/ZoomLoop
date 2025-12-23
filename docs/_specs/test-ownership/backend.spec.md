# Test Ownership - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** 10-Day Money-Back Guarantee (Test Ownership)

---

## Overview

The Test Ownership backend manages the trial period tracking, return/exchange processing, and refund disbursement.

---

## Domain Events

### Trial Period

| Event | Description | Payload |
|-------|-------------|---------|
| `TestOwnershipStarted` | Trial begins | `{ trialId, vehicleId, customerId, startDate, endDate }` |
| `TestDriveCompleted` | Driving recorded | `{ trialId, mileageDriven, driveDate }` |
| `TestPeriodDayElapsed` | Daily tracking | `{ trialId, dayNumber, currentMileage }` |
| `MileageTracked` | Odometer recorded | `{ trialId, mileage, trackedAt }` |
| `TestPeriodExpired` | Trial ended | `{ trialId, expiredAt, finalMileage }` |
| `VehicleKept` | Customer keeps | `{ trialId, keptAt, finalDecision }` |

### Returns & Exchanges

| Event | Description | Payload |
|-------|-------------|---------|
| `ReturnRequested` | Return initiated | `{ returnId, vehicleId, customerId, reason }` |
| `ExchangeRequested` | Exchange initiated | `{ exchangeId, vehicleId, customerId, desiredVehicleId }` |
| `ReturnConditionVerified` | Inspection done | `{ returnId, inspectionResult, noAccidents, noModifications }` |
| `RefundApproved` | Refund accepted | `{ returnId, refundAmount }` |
| `RefundProcessed` | Money returned | `{ refundId, amount, feesDeducted }` |
| `ExchangeApproved` | Swap authorized | `{ exchangeId, newVehicleId }` |
| `VehicleReturned` | Physical return | `{ returnId, returnedAt, returnMileage }` |
| `VehicleExchanged` | Swap completed | `{ exchangeId, exchangedAt, newVehicleId }` |

---

## API Endpoints

### Trial Period

```
GET /api/v1/trials/:purchaseId
  Description: Get trial period details
  Auth: Required
  Response: 200 OK
    {
      "trialId": "uuid",
      "purchaseId": "uuid",
      "vehicleId": "uuid",
      "vehicle": {
        "make": "string",
        "model": "string",
        "year": number,
        "vin": "string"
      },
      "status": "active|ended|returned|exchanged|kept",
      "startDate": "ISO-8601",
      "endDate": "ISO-8601",
      "daysTotal": 10,
      "daysRemaining": number,
      "daysElapsed": number,
      "mileage": {
        "current": number,
        "max": 750,
        "lastUpdated": "ISO-8601"
      },
      "terms": {
        "returnEligible": boolean,
        "exchangeEligible": boolean,
        "requirements": ["string"]
      }
    }

POST /api/v1/trials/:purchaseId/mileage
  Description: Update mileage reading
  Auth: Required
  Request Body:
    {
      "mileage": number,
      "readingDate": "ISO-8601"
    }
  Response: 200 OK
    {
      "updated": true,
      "mileage": number,
      "remainingMileage": number,
      "withinLimit": boolean
    }

POST /api/v1/trials/:purchaseId/keep
  Description: Confirm keeping vehicle
  Auth: Required
  Request Body:
    {
      "confirmation": true
    }
  Response: 200 OK
    {
      "confirmed": true,
      "keptAt": "ISO-8601",
      "nextSteps": ["warranty_activation"]
    }
```

### Returns

```
GET /api/v1/trials/:purchaseId/return-eligibility
  Description: Check return eligibility
  Auth: Required
  Response: 200 OK
    {
      "eligible": boolean,
      "reasons": ["string"],
      "estimatedRefund": {
        "purchaseAmount": number,
        "nonRefundableFees": number,
        "estimatedRefund": number
      },
      "requirements": ["string"],
      "deadline": "ISO-8601"
    }

POST /api/v1/trials/:purchaseId/return
  Description: Request vehicle return
  Auth: Required
  Request Body:
    {
      "reason": "not_right_fit|unmet_expectations|found_better|financial|other",
      "reasonDetails": "string",
      "condition": {
        "noAccidents": boolean,
        "noModifications": boolean,
        "sameCondition": boolean
      },
      "photos": ["string"],
      "preferredPickupDate": "ISO-8601",
      "preferredTimeWindow": "morning|afternoon|evening"
    }
  Response: 201 Created
    {
      "returnId": "uuid",
      "status": "requested",
      "createdAt": "ISO-8601",
      "nextSteps": ["await_approval", "schedule_pickup"]
    }

GET /api/v1/returns/:returnId
  Description: Get return request status
  Auth: Required
  Response: 200 OK
    {
      "returnId": "uuid",
      "purchaseId": "uuid",
      "vehicleId": "uuid",
      "status": "requested|approved|rejected|pickup_scheduled|collected|refund_processing|completed",
      "reason": "string",
      "createdAt": "ISO-8601",
      "approvedAt": "ISO-8601",
      "pickup": {
        "scheduled": boolean,
        "date": "ISO-8601",
        "timeWindow": "string",
        "address": { ... }
      },
      "refund": {
        "amount": number,
        "feesDeducted": number,
        "status": "pending|processing|completed",
        "processedAt": "ISO-8601",
        "paymentMethod": "string"
      },
      "timeline": [
        {
          "event": "string",
          "timestamp": "ISO-8601",
          "description": "string"
        }
      ]
    }

PUT /api/v1/returns/:returnId/pickup
  Description: Schedule/reschedule pickup
  Auth: Required
  Request Body:
    {
      "date": "ISO-8601",
      "timeWindow": "morning|afternoon|evening",
      "address": { ... }
    }
  Response: 200 OK

DELETE /api/v1/returns/:returnId
  Description: Cancel return request
  Auth: Required
  Response: 200 OK
    {
      "cancelled": true,
      "cancelledAt": "ISO-8601"
    }
```

### Exchanges

```
GET /api/v1/trials/:purchaseId/exchange-eligibility
  Description: Check exchange eligibility
  Auth: Required
  Response: 200 OK
    {
      "eligible": boolean,
      "currentVehicleValue": number,
      "availableCredit": number
    }

POST /api/v1/trials/:purchaseId/exchange
  Description: Request vehicle exchange
  Auth: Required
  Request Body:
    {
      "targetVehicleId": "uuid"
    }
  Response: 201 Created
    {
      "exchangeId": "uuid",
      "currentVehicle": { ... },
      "targetVehicle": { ... },
      "priceComparison": {
        "currentValue": number,
        "targetPrice": number,
        "difference": number,
        "additionalPayment": number,
        "refundDue": number
      },
      "nextSteps": ["confirm_exchange", "schedule_swap"]
    }

POST /api/v1/exchanges/:exchangeId/confirm
  Description: Confirm exchange
  Auth: Required
  Request Body:
    {
      "acceptTerms": boolean,
      "paymentMethodId": "uuid" // if additional payment
    }
  Response: 200 OK
    {
      "confirmed": true,
      "swapSchedule": {
        "returnDate": "ISO-8601",
        "pickupDate": "ISO-8601"
      }
    }

GET /api/v1/exchanges/:exchangeId
  Description: Get exchange status
  Auth: Required
  Response: 200 OK
    {
      "exchangeId": "uuid",
      "status": "requested|confirmed|return_scheduled|returned|new_vehicle_ready|completed",
      "currentVehicle": { ... },
      "targetVehicle": { ... },
      "priceSettlement": {
        "difference": number,
        "settled": boolean,
        "settledAt": "ISO-8601"
      },
      "newTrialPeriod": {
        "available": boolean,
        "startDate": "ISO-8601",
        "endDate": "ISO-8601"
      }
    }
```

---

## Data Models

### TrialPeriod

```typescript
interface TrialPeriod {
  id: string;
  purchaseId: string;
  vehicleId: string;
  customerId: string;
  status: TrialStatus;
  startDate: Date;
  endDate: Date;
  maxDays: number;
  maxMileage: number;
  startMileage: number;
  currentMileage?: number;
  lastMileageUpdate?: Date;
  endedAt?: Date;
  endReason?: 'expired' | 'returned' | 'exchanged' | 'kept';
  createdAt: Date;
  updatedAt: Date;
}

enum TrialStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  RETURNED = 'returned',
  EXCHANGED = 'exchanged',
  KEPT = 'kept'
}
```

### ReturnRequest

```typescript
interface ReturnRequest {
  id: string;
  trialId: string;
  purchaseId: string;
  vehicleId: string;
  customerId: string;
  status: ReturnStatus;
  reason: ReturnReason;
  reasonDetails?: string;
  conditionStatement: {
    noAccidents: boolean;
    noModifications: boolean;
    sameCondition: boolean;
  };
  photos: string[];
  pickup?: {
    scheduledDate: Date;
    timeWindow: string;
    address: Address;
    driverId?: string;
  };
  inspection?: {
    completedAt: Date;
    inspectorId: string;
    passed: boolean;
    notes?: string;
    issues?: string[];
  };
  refund?: {
    purchaseAmount: number;
    feesDeducted: number;
    refundAmount: number;
    status: 'pending' | 'processing' | 'completed';
    processedAt?: Date;
    transactionId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PICKUP_SCHEDULED = 'pickup_scheduled',
  COLLECTED = 'collected',
  INSPECTING = 'inspecting',
  INSPECTION_PASSED = 'inspection_passed',
  INSPECTION_FAILED = 'inspection_failed',
  REFUND_PROCESSING = 'refund_processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

enum ReturnReason {
  NOT_RIGHT_FIT = 'not_right_fit',
  UNMET_EXPECTATIONS = 'unmet_expectations',
  FOUND_BETTER = 'found_better',
  FINANCIAL = 'financial',
  OTHER = 'other'
}
```

### ExchangeRequest

```typescript
interface ExchangeRequest {
  id: string;
  trialId: string;
  purchaseId: string;
  currentVehicleId: string;
  targetVehicleId: string;
  customerId: string;
  status: ExchangeStatus;
  priceComparison: {
    currentValue: number;
    targetPrice: number;
    difference: number;
  };
  paymentSettlement?: {
    amount: number;
    direction: 'customer_pays' | 'refund_to_customer';
    transactionId?: string;
    settledAt?: Date;
  };
  returnSchedule?: {
    date: Date;
    timeWindow: string;
    address: Address;
  };
  newDeliverySchedule?: {
    date: Date;
    timeWindow: string;
    address: Address;
  };
  newTrialPeriod?: {
    trialId: string;
    startDate: Date;
    endDate: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

enum ExchangeStatus {
  REQUESTED = 'requested',
  CONFIRMED = 'confirmed',
  RETURN_SCHEDULED = 'return_scheduled',
  RETURNED = 'returned',
  NEW_VEHICLE_READY = 'new_vehicle_ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

---

## Business Rules

### Trial Period

1. Trial starts upon confirmed vehicle handover
2. 10 calendar days OR 750 km, whichever first
3. Trial ends automatically at midnight on day 10
4. Mileage tracking is customer-reported + verified at return

### Return Eligibility

1. Vehicle must be unmodified
2. No accidents during trial period
3. No significant damage beyond normal wear
4. Return request must be submitted within trial period
5. Actual pickup can occur after trial ends (if requested in time)

### Refund Calculation

```
Refund = Purchase Amount - Non-Refundable Fees

Non-Refundable Fees:
- Documentation fee
- Provincial/local fees (varies)
- Third-party service fees
```

### Exchange Rules

1. Exchange available for same or different model
2. Price difference settled at exchange
3. If target price lower: partial refund
4. If target price higher: customer pays difference
5. New trial period available on exchanged vehicle

---

## Scheduled Jobs

### Daily Trial Check

```
Schedule: Daily at midnight
Action:
- Identify trials ending today
- Send final day notification
- Update status to 'ended' if no action
```

### Mileage Reminders

```
Schedule: Day 3, 5, 7 of trial
Action:
- Send mileage update reminder
- Track engagement
```

### Return Pickup Reminders

```
Schedule: 24 hours before pickup
Action:
- Send pickup reminder to customer
- Confirm driver assignment
```

---

## Service Dependencies

### External Services

- **Payment Gateway**: Refund processing
- **SMS/Email Service**: Notifications

### Internal Services

- **Delivery Service**: Pickup scheduling
- **Vehicle Service**: Vehicle status updates
- **Inventory Service**: Return to inventory
- **User Service**: Customer notifications

---

## Monitoring

### Key Metrics

- Return rate
- Exchange rate
- Average trial duration
- Refund processing time
- Customer satisfaction post-trial

### Alerts

- Return rate > 10%
- Refund processing > 7 days
- Failed inspections > 5%
