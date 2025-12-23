# Vehicle Acquisition - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Acquisition (Sell Your Car)

---

## Overview

The Vehicle Acquisition backend handles instant offer generation, vehicle appraisal management, purchase processing, and payment disbursement to sellers.

---

## Domain Events

### Instant Offer Generation

| Event | Description | Payload |
|-------|-------------|---------|
| `OfferRequested` | Customer initiates offer | `{ userId, timestamp }` |
| `VehicleDetailsSubmitted` | Vehicle info provided | `{ vin, make, model, year, mileage, condition, photos[] }` |
| `AIOfferGenerated` | AI valuation complete | `{ offerId, amount, vehicleId, expiryDate }` |
| `FirmOfferCreated` | Offer presented | `{ offerId, amount, validUntil }` |
| `OfferAccepted` | Customer accepts | `{ offerId, acceptedAt, customerId }` |
| `OfferRejected` | Customer declines | `{ offerId, rejectedAt, reason }` |
| `OfferExpired` | Validity ended | `{ offerId, expiredAt }` |

### Appraisal & Inspection

| Event | Description | Payload |
|-------|-------------|---------|
| `AppraisalScheduled` | Appointment booked | `{ appointmentId, scheduledDate, location, inspectorId }` |
| `VehicleInspectionStarted` | Inspection begins | `{ inspectionId, vehicleId, inspectorId, startTime }` |
| `InspectionCompleted` | Inspection done | `{ inspectionId, completedAt, finalCondition }` |
| `ConditionAssessed` | Condition evaluated | `{ inspectionId, actualCondition, discrepanciesFound }` |
| `OfferAdjusted` | Offer modified | `{ offerId, originalAmount, adjustedAmount, reason }` |
| `FinalOfferConfirmed` | Final price agreed | `{ offerId, finalAmount, confirmedAt }` |

### Purchase

| Event | Description | Payload |
|-------|-------------|---------|
| `PurchaseAgreementSigned` | Agreement executed | `{ agreementId, vehicleId, sellerId, amount }` |
| `VehiclePurchased` | Ownership transfer | `{ purchaseId, vehicleId, amount, purchaseDate }` |
| `PaymentInitiated` | Payment started | `{ paymentId, amount, paymentMethod }` |
| `InstantPaymentProcessed` | Instant deposit | `{ paymentId, amount, bankAccountId, processedAt }` |
| `FundsTransferred` | Payment complete | `{ paymentId, transferredAt, confirmationNumber }` |
| `VehiclePickupScheduled` | Pickup arranged | `{ pickupId, scheduledDate, location, driverId }` |
| `VehicleCollected` | Vehicle picked up | `{ pickupId, collectedAt, vehicleCondition, mileageReading }` |

---

## API Endpoints

### Offer Management

```
POST /api/v1/offers/request
  Description: Initiate offer request
  Auth: Optional (guest or authenticated)
  Request Body:
    {
      "userId": "string (optional)"
    }
  Response: 201 Created
    {
      "requestId": "uuid",
      "timestamp": "ISO-8601"
    }

POST /api/v1/offers/vehicle-details
  Description: Submit vehicle information
  Auth: Optional
  Request Body:
    {
      "requestId": "uuid",
      "vin": "string (17 chars)",
      "make": "string",
      "model": "string",
      "year": "number",
      "trim": "string",
      "mileage": "number",
      "condition": "excellent|good|fair|poor"
    }
  Response: 200 OK
    {
      "vehicleId": "uuid",
      "vehicleDetails": {
        "make": "string",
        "model": "string",
        "year": "number",
        "trim": "string",
        "engine": "string",
        "transmission": "string"
      },
      "validationStatus": "valid|invalid|needs_review"
    }

POST /api/v1/offers/photos
  Description: Upload vehicle photos
  Auth: Optional
  Content-Type: multipart/form-data
  Request Body:
    - vehicleId: uuid
    - photos: File[] (max 20, max 10MB each)
  Response: 200 OK
    {
      "photoUrls": ["string"],
      "uploadedCount": "number",
      "processingStatus": "complete|processing"
    }

POST /api/v1/offers/generate
  Description: Generate AI-powered offer
  Auth: Optional
  Request Body:
    {
      "vehicleId": "uuid",
      "requestId": "uuid"
    }
  Response: 201 Created
    {
      "offerId": "uuid",
      "amount": "number",
      "currency": "CAD",
      "validUntil": "ISO-8601",
      "expiresInSeconds": "number",
      "breakdown": {
        "baseValue": "number",
        "conditionAdjustment": "number",
        "marketAdjustment": "number"
      }
    }

GET /api/v1/offers/:offerId
  Description: Retrieve offer details
  Auth: Optional (must match original requestor)
  Response: 200 OK
    {
      "offerId": "uuid",
      "amount": "number",
      "status": "pending|accepted|rejected|expired",
      "validUntil": "ISO-8601",
      "vehicle": { ... },
      "createdAt": "ISO-8601"
    }

POST /api/v1/offers/:offerId/accept
  Description: Accept offer
  Auth: Required
  Request Body:
    {
      "customerId": "uuid"
    }
  Response: 200 OK
    {
      "offerId": "uuid",
      "acceptedAt": "ISO-8601",
      "nextSteps": ["schedule_appraisal"]
    }

POST /api/v1/offers/:offerId/reject
  Description: Decline offer
  Auth: Optional
  Request Body:
    {
      "reason": "string (optional)"
    }
  Response: 200 OK
    {
      "offerId": "uuid",
      "rejectedAt": "ISO-8601"
    }
```

### Appraisal Management

```
GET /api/v1/appraisals/availability
  Description: Get available time slots
  Auth: Required
  Query Params:
    - offerId: uuid
    - location: home|service_center
    - startDate: ISO-8601
    - endDate: ISO-8601
  Response: 200 OK
    {
      "availableSlots": [
        {
          "date": "ISO-8601",
          "timeSlots": ["09:00", "09:30", "10:00", ...]
        }
      ],
      "nearestServiceCenter": {
        "id": "uuid",
        "name": "string",
        "address": "string",
        "distance": "number"
      }
    }

POST /api/v1/appraisals/schedule
  Description: Schedule appraisal appointment
  Auth: Required
  Request Body:
    {
      "offerId": "uuid",
      "date": "ISO-8601",
      "timeSlot": "string",
      "locationType": "home|service_center",
      "address": {
        "street": "string",
        "city": "string",
        "province": "string",
        "postalCode": "string"
      }
    }
  Response: 201 Created
    {
      "appointmentId": "uuid",
      "confirmationNumber": "string",
      "scheduledDate": "ISO-8601",
      "inspectorName": "string",
      "estimatedDuration": "number (minutes)"
    }

PUT /api/v1/appraisals/:appointmentId/reschedule
  Description: Reschedule appointment
  Auth: Required
  Request Body:
    {
      "newDate": "ISO-8601",
      "newTimeSlot": "string"
    }
  Response: 200 OK

DELETE /api/v1/appraisals/:appointmentId
  Description: Cancel appointment
  Auth: Required
  Response: 204 No Content
```

### Inspection Processing

```
POST /api/v1/inspections/:inspectionId/start
  Description: Begin vehicle inspection
  Auth: Required (Inspector role)
  Request Body:
    {
      "inspectorId": "uuid",
      "vehicleId": "uuid",
      "mileageReading": "number"
    }
  Response: 200 OK

POST /api/v1/inspections/:inspectionId/checkpoint
  Description: Record inspection checkpoint
  Auth: Required (Inspector role)
  Request Body:
    {
      "checkpointId": "string",
      "status": "pass|fail|note",
      "notes": "string",
      "photos": ["string"]
    }
  Response: 200 OK

POST /api/v1/inspections/:inspectionId/complete
  Description: Complete inspection
  Auth: Required (Inspector role)
  Request Body:
    {
      "finalCondition": "excellent|good|fair|poor",
      "discrepancies": [
        {
          "category": "string",
          "description": "string",
          "impactOnValue": "number"
        }
      ],
      "recommendations": ["string"]
    }
  Response: 200 OK
    {
      "inspectionId": "uuid",
      "completedAt": "ISO-8601",
      "adjustedOffer": {
        "originalAmount": "number",
        "adjustedAmount": "number",
        "adjustmentReason": "string"
      }
    }
```

### Purchase Processing

```
POST /api/v1/purchases
  Description: Create purchase record
  Auth: Required
  Request Body:
    {
      "offerId": "uuid",
      "sellerId": "uuid",
      "finalAmount": "number"
    }
  Response: 201 Created
    {
      "purchaseId": "uuid",
      "agreementUrl": "string",
      "status": "pending_signature"
    }

POST /api/v1/purchases/:purchaseId/sign
  Description: Sign purchase agreement
  Auth: Required
  Request Body:
    {
      "signatureData": "string",
      "agreedToTerms": "boolean"
    }
  Response: 200 OK

POST /api/v1/purchases/:purchaseId/payment
  Description: Process payment to seller
  Auth: Required (System)
  Request Body:
    {
      "bankAccountId": "uuid",
      "amount": "number"
    }
  Response: 200 OK
    {
      "paymentId": "uuid",
      "status": "processing|completed",
      "estimatedArrival": "ISO-8601"
    }
```

---

## Data Models

### Offer

```typescript
interface Offer {
  id: string;
  requestId: string;
  vehicleId: string;
  customerId?: string;
  amount: number;
  currency: string;
  status: OfferStatus;
  validUntil: Date;
  breakdown: {
    baseValue: number;
    conditionAdjustment: number;
    marketAdjustment: number;
    mileageAdjustment: number;
  };
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  rejectedAt?: Date;
  expiredAt?: Date;
}

enum OfferStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired'
}
```

### Vehicle (Acquisition)

```typescript
interface AcquisitionVehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  mileage: number;
  declaredCondition: Condition;
  actualCondition?: Condition;
  photos: string[];
  engine: string;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  features: string[];
  createdAt: Date;
}

enum Condition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}
```

### Appraisal

```typescript
interface Appraisal {
  id: string;
  offerId: string;
  vehicleId: string;
  customerId: string;
  inspectorId: string;
  scheduledDate: Date;
  locationType: 'home' | 'service_center';
  location: Address;
  status: AppraisalStatus;
  confirmationNumber: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

enum AppraisalStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### Inspection

```typescript
interface Inspection {
  id: string;
  appraisalId: string;
  vehicleId: string;
  inspectorId: string;
  checkpoints: InspectionCheckpoint[];
  discrepancies: Discrepancy[];
  finalCondition: Condition;
  mileageReading: number;
  startedAt: Date;
  completedAt?: Date;
}

interface InspectionCheckpoint {
  id: string;
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'note';
  notes?: string;
  photos?: string[];
}

interface Discrepancy {
  category: string;
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  impactOnValue: number;
}
```

### Purchase

```typescript
interface Purchase {
  id: string;
  offerId: string;
  vehicleId: string;
  sellerId: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  agreementId: string;
  agreementSignedAt?: Date;
  paymentId?: string;
  paymentProcessedAt?: Date;
  pickupScheduledAt?: Date;
  vehicleCollectedAt?: Date;
  createdAt: Date;
}

enum PurchaseStatus {
  PENDING_SIGNATURE = 'pending_signature',
  PENDING_PAYMENT = 'pending_payment',
  PAYMENT_PROCESSING = 'payment_processing',
  PENDING_PICKUP = 'pending_pickup',
  COMPLETED = 'completed'
}
```

---

## Business Rules

### Offer Generation

1. VIN must be valid 17-character format
2. Vehicle must be within acceptable age range (typically < 15 years)
3. Mileage must be reasonable for vehicle age
4. AI valuation considers:
   - Market comparables
   - Condition assessment
   - Mileage adjustment
   - Regional demand
   - Seasonality

### Offer Validity

1. Offers valid for 7 days from generation
2. Only one active offer per VIN
3. Offer expires automatically if not accepted
4. Customer can request new offer after expiration

### Appraisal Scheduling

1. Appraisals available within 14-day window
2. Time slots in 30-minute intervals
3. Home appraisals limited to service area
4. Minimum 24-hour notice required
5. Maximum 2 reschedules allowed

### Offer Adjustment

1. Original offer honored if no discrepancies found
2. Adjustments require documented justification
3. Customer can decline adjusted offer
4. Major discrepancies may void offer entirely

### Payment Processing

1. Instant payment via direct deposit
2. Bank account must be verified
3. Payment initiated after agreement signed
4. Funds typically arrive within 24 hours

---

## Service Dependencies

### External Services

- **VIN Decoder API**: Vehicle specification lookup
- **Valuation Service**: AI-powered pricing engine
- **Payment Gateway**: Instant fund transfers
- **Calendar Service**: Appointment scheduling
- **Notification Service**: Email/SMS confirmations
- **Document Service**: Agreement generation

### Internal Services

- **User Service**: Customer authentication
- **Vehicle Service**: Vehicle data management
- **Inspector Service**: Inspector assignment
- **Analytics Service**: Event tracking

---

## Security

### Authentication

- Offer generation: Optional (creates guest session)
- Offer acceptance: Required (verified customer)
- Payment processing: Required + bank verification

### Data Protection

- VIN encrypted at rest
- Bank details tokenized
- Personal information PII-compliant
- Audit logging for all transactions

### Rate Limiting

- Offer requests: 5 per IP per hour
- Photo uploads: 20 per session
- API calls: 100 per minute per user

---

## Error Handling

| Error Code | Description | HTTP Status |
|------------|-------------|-------------|
| `INVALID_VIN` | VIN format invalid | 400 |
| `VIN_NOT_FOUND` | Vehicle not in database | 404 |
| `OFFER_EXPIRED` | Offer no longer valid | 410 |
| `OFFER_ALREADY_ACCEPTED` | Duplicate acceptance | 409 |
| `NO_AVAILABILITY` | No appointment slots | 404 |
| `INSPECTION_FAILED` | Vehicle didn't pass inspection | 422 |
| `PAYMENT_FAILED` | Payment processing error | 502 |

---

## Monitoring & Alerts

### Key Metrics

- Offers generated per hour
- Offer acceptance rate
- Average time to acceptance
- Appraisal completion rate
- Payment success rate
- Average payment time

### Alerts

- Offer generation failures > 5%
- Payment failures > 1%
- Appraisal no-shows > 10%
- API latency > 2 seconds
