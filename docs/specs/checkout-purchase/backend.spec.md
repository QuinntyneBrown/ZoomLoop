# Checkout & Purchase - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Purchase Flow
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** A (MVP) - Core purchase; B - Enhanced flow

---

## Overview

Backend services for the checkout and purchase flow handle reservations, payment processing, document generation, and order management.

---

## Requirements

### REQ-CP-B-001: Reservation Management
**Description:** Handle vehicle reservations
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Process $100 refundable deposit
- [ ] Mark vehicle as reserved atomically
- [ ] Set reservation expiry (48-72 hours)
- [ ] Handle concurrent reservation attempts
- [ ] Auto-expire and release reservations

### REQ-CP-B-002: Payment Processing
**Description:** Handle various payment methods
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] PCI-DSS compliant payment handling
- [ ] Stripe integration for cards
- [ ] Bank transfer instructions generation
- [ ] Refund processing
- [ ] Payment reconciliation

### REQ-CP-B-003: Document Generation
**Description:** Generate purchase documents
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Purchase agreement generation (PDF)
- [ ] E-signature integration (DocuSign/HelloSign)
- [ ] Document storage and retrieval
- [ ] Audit trail for signatures

---

## API Endpoints

### POST /api/v1/reservations

Create vehicle reservation.

**Request:**
```json
{
  "vehicleId": "veh_abc123",
  "paymentMethod": {
    "type": "card",
    "token": "tok_visa"
  }
}
```

**Response (201 Created):**
```json
{
  "reservationId": "res_xyz789",
  "vehicleId": "veh_abc123",
  "status": "confirmed",
  "depositAmount": 10000,
  "depositCharge": {
    "id": "ch_123",
    "amount": 10000,
    "currency": "cad"
  },
  "expiresAt": "2025-12-26T10:30:00Z",
  "createdAt": "2025-12-23T10:30:00Z"
}
```

---

### POST /api/v1/orders

Create purchase order.

**Request:**
```json
{
  "reservationId": "res_xyz789",
  "vehicleId": "veh_abc123",
  "contactInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "416-555-1234",
    "address": {
      "street": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 2T6"
    }
  },
  "tradeIn": {
    "tradeInId": "trade_123",
    "creditAmount": 800000
  },
  "payment": {
    "method": "finance",
    "financingApplicationId": "app_xyz789",
    "downPayment": 250000
  },
  "delivery": {
    "method": "delivery",
    "address": {
      "street": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 2T6"
    },
    "preferredDate": "2025-12-28"
  }
}
```

**Response (201 Created):**
```json
{
  "orderId": "ord_abc123",
  "orderNumber": "CLT-2025-12345",
  "status": "pending_documents",
  "vehicle": {
    "id": "veh_abc123",
    "make": "Honda",
    "model": "Civic",
    "year": 2021
  },
  "pricing": {
    "vehiclePrice": 2499900,
    "tradeInCredit": -800000,
    "adminFee": 49900,
    "documentationFee": 15000,
    "subtotal": 1764800,
    "taxRate": 0.13,
    "taxAmount": 229424,
    "totalDue": 1994224
  },
  "nextSteps": [
    {
      "step": "sign_documents",
      "status": "pending",
      "url": "/api/v1/orders/ord_abc123/documents"
    },
    {
      "step": "upload_insurance",
      "status": "pending",
      "url": "/api/v1/orders/ord_abc123/insurance"
    }
  ],
  "advisor": {
    "name": "Sarah Johnson",
    "email": "sarah@clutchclone.ca",
    "phone": "416-555-1234"
  },
  "createdAt": "2025-12-23T11:00:00Z"
}
```

---

### GET /api/v1/orders/:orderId

Get order details.

**Response:**
```json
{
  "orderId": "ord_abc123",
  "orderNumber": "CLT-2025-12345",
  "status": "pending_delivery",
  "vehicle": { ... },
  "pricing": { ... },
  "payment": {
    "method": "finance",
    "depositPaid": 10000,
    "downPaymentPaid": 250000,
    "financingAmount": 1734224,
    "monthlyPayment": 32900
  },
  "documents": [
    {
      "type": "purchase_agreement",
      "status": "signed",
      "signedAt": "2025-12-23T12:00:00Z",
      "url": "https://cdn.example.com/docs/ord_abc123/agreement.pdf"
    }
  ],
  "insurance": {
    "status": "verified",
    "policyNumber": "POL-12345",
    "provider": "Intact Insurance"
  },
  "delivery": {
    "method": "delivery",
    "status": "scheduled",
    "scheduledDate": "2025-12-28",
    "timeWindow": "10:00 AM - 2:00 PM",
    "address": { ... }
  },
  "timeline": [
    { "event": "Order placed", "timestamp": "2025-12-23T11:00:00Z", "status": "completed" },
    { "event": "Documents signed", "timestamp": "2025-12-23T12:00:00Z", "status": "completed" },
    { "event": "Insurance verified", "timestamp": "2025-12-23T14:00:00Z", "status": "completed" },
    { "event": "Delivery scheduled", "timestamp": "2025-12-28T10:00:00Z", "status": "pending" }
  ]
}
```

---

### POST /api/v1/orders/:orderId/documents/sign

Initiate document signing.

**Response:**
```json
{
  "signatureUrl": "https://sign.example.com/envelope/env_123",
  "expiresAt": "2025-12-24T10:00:00Z"
}
```

---

### POST /api/v1/orders/:orderId/insurance

Upload insurance proof.

**Request (multipart/form-data):**
- `file`: Insurance document (PDF/image)
- `policyNumber`: Policy number
- `provider`: Insurance provider

**Response:**
```json
{
  "insuranceId": "ins_123",
  "status": "pending_verification",
  "submittedAt": "2025-12-23T13:00:00Z"
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleReservationInitiated` | Reservation started | `{ reservationId, vehicleId, userId }` |
| `DepositPaid` | Deposit processed | `{ reservationId, amount }` |
| `ReservationConfirmed` | Vehicle reserved | `{ reservationId, vehicleId, expiresAt }` |
| `ReservationExpired` | Reservation timed out | `{ reservationId, vehicleId }` |
| `PurchaseAgreementGenerated` | Agreement created | `{ orderId, agreementId }` |
| `DocumentsSigned` | E-signature complete | `{ orderId, signedAt }` |
| `InsuranceUploaded` | Insurance submitted | `{ orderId, policyNumber }` |
| `InsuranceVerified` | Insurance approved | `{ orderId, verifiedAt }` |
| `FullPaymentReceived` | Full payment processed | `{ orderId, amount }` |
| `PurchaseCompleted` | Order finalized | `{ orderId, vehicleId, customerId }` |
| `AdvisorAssigned` | Advisor assigned | `{ orderId, advisorId }` |

---

## Data Models

```typescript
interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  vehicleId: string;
  customerId: string;
  reservationId: string;

  contactInfo: ContactInfo;
  pricing: OrderPricing;
  payment: PaymentInfo;
  tradeIn: TradeInInfo | null;
  delivery: DeliveryInfo;

  advisorId: string;
  documents: Document[];
  insurance: InsuranceInfo | null;

  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

type OrderStatus =
  | 'pending_payment'
  | 'pending_documents'
  | 'pending_insurance'
  | 'pending_delivery'
  | 'in_transit'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';
```

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
