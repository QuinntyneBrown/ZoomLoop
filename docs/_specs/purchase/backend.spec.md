# Purchase - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Purchase Process

---

## Overview

The Purchase backend handles the complete vehicle buying flow including reservations, financing applications, documentation processing, and payment collection.

---

## Domain Events

### Reservation

| Event | Description | Payload |
|-------|-------------|---------|
| `GetStartedClicked` | Customer initiates | `{ vehicleId, userId, timestamp }` |
| `VehicleReservationInitiated` | Process started | `{ reservationId, vehicleId, userId }` |
| `ContactInformationSubmitted` | Details provided | `{ userId, name, email, phone, address }` |
| `DepositPaid` | Deposit processed | `{ depositId, amount, paymentMethod }` |
| `ReservationConfirmed` | Vehicle reserved | `{ reservationId, vehicleId, expiresAt }` |

### Pre-Purchase

| Event | Description | Payload |
|-------|-------------|---------|
| `AdvisorAssigned` | Rep assigned | `{ advisorId, customerId, assignedAt }` |
| `CustomerContacted` | Advisor reaches out | `{ contactId, advisorId, method }` |
| `FinancingOptionsPresented` | Options shown | `{ customerId, options[] }` |
| `FinancingSelected` | Option chosen | `{ applicationId, selectedOption }` |
| `FinancingApproved` | Loan approved | `{ applicationId, amount, terms }` |
| `FinancingDeclined` | Loan denied | `{ applicationId, reason }` |

### Documentation

| Event | Description | Payload |
|-------|-------------|---------|
| `PaperworkInitiated` | Docs started | `{ transactionId, vehicleId, customerId }` |
| `PurchaseAgreementGenerated` | Contract created | `{ agreementId, terms }` |
| `DocumentsSigned` | E-signature complete | `{ agreementId, signatureHash }` |
| `InsuranceUploaded` | Policy uploaded | `{ customerId, policyNumber }` |
| `InsuranceVerified` | Coverage confirmed | `{ customerId, verifiedAt }` |
| `RegistrationProcessed` | Registration done | `{ vehicleId, registrationNumber }` |

### Payment

| Event | Description | Payload |
|-------|-------------|---------|
| `PaymentMethodSelected` | Method chosen | `{ customerId, paymentType }` |
| `DownPaymentReceived` | Down payment paid | `{ paymentId, amount }` |
| `FullPaymentReceived` | Full amount paid | `{ transactionId, totalAmount }` |
| `FinancingCompleted` | Loan disbursed | `{ financingId, disbursedAmount }` |

---

## API Endpoints

### Reservation

```
POST /api/v1/reservations
  Description: Create vehicle reservation
  Auth: Required
  Request Body:
    {
      "vehicleId": "uuid",
      "contactInfo": {
        "name": "string",
        "email": "string",
        "phone": "string",
        "preferredContact": "email|phone|sms"
      },
      "paymentMethod": {
        "type": "card",
        "token": "string"
      }
    }
  Response: 201 Created
    {
      "reservationId": "uuid",
      "confirmationNumber": "string",
      "depositAmount": 100.00,
      "expiresAt": "ISO-8601",
      "vehicleSummary": { ... },
      "nextSteps": ["string"]
    }

GET /api/v1/reservations/:reservationId
  Description: Get reservation details
  Auth: Required
  Response: 200 OK
    {
      "reservationId": "uuid",
      "vehicleId": "uuid",
      "vehicle": { ... },
      "status": "active|expired|converted|cancelled",
      "depositAmount": number,
      "depositPaidAt": "ISO-8601",
      "expiresAt": "ISO-8601",
      "advisor": {
        "id": "uuid",
        "name": "string",
        "phone": "string",
        "email": "string"
      },
      "purchaseProgress": {
        "currentStep": "string",
        "completedSteps": ["string"],
        "remainingSteps": ["string"]
      }
    }

DELETE /api/v1/reservations/:reservationId
  Description: Cancel reservation
  Auth: Required
  Response: 200 OK
    {
      "cancelled": true,
      "refundAmount": number,
      "refundStatus": "processing|completed"
    }

POST /api/v1/reservations/:reservationId/extend
  Description: Request reservation extension
  Auth: Required
  Request Body:
    {
      "reason": "string"
    }
  Response: 200 OK
    {
      "extended": boolean,
      "newExpiresAt": "ISO-8601"
    }
```

### Financing

```
POST /api/v1/financing/prequalify
  Description: Quick pre-qualification check
  Auth: Required
  Request Body:
    {
      "reservationId": "uuid",
      "annualIncome": number,
      "creditScoreEstimate": "excellent|good|fair|poor"
    }
  Response: 200 OK
    {
      "prequalified": boolean,
      "estimatedRate": number,
      "estimatedPayment": number,
      "term": number
    }

POST /api/v1/financing/applications
  Description: Submit full financing application
  Auth: Required
  Request Body:
    {
      "reservationId": "uuid",
      "personalInfo": {
        "legalName": "string",
        "dateOfBirth": "YYYY-MM-DD",
        "sin": "string (encrypted)",
        "address": {
          "street": "string",
          "city": "string",
          "province": "string",
          "postalCode": "string"
        },
        "timeAtAddress": number,
        "housingStatus": "own|rent|other"
      },
      "employmentInfo": {
        "status": "employed|self_employed|retired|other",
        "employer": "string",
        "jobTitle": "string",
        "timeAtEmployer": number,
        "annualIncome": number,
        "additionalIncome": number
      },
      "consentToCredit": boolean
    }
  Response: 201 Created
    {
      "applicationId": "uuid",
      "status": "submitted",
      "estimatedDecisionTime": "minutes"
    }

GET /api/v1/financing/applications/:applicationId
  Description: Get application status
  Auth: Required
  Response: 200 OK
    {
      "applicationId": "uuid",
      "status": "pending|approved|declined|needs_info",
      "submittedAt": "ISO-8601",
      "decidedAt": "ISO-8601",
      "decision": {
        "approved": boolean,
        "reason": "string"
      }
    }

GET /api/v1/financing/applications/:applicationId/options
  Description: Get approved financing options
  Auth: Required
  Response: 200 OK
    {
      "options": [
        {
          "optionId": "uuid",
          "lender": "string",
          "apr": number,
          "term": number,
          "monthlyPayment": number,
          "downPayment": number,
          "totalInterest": number,
          "totalCost": number,
          "isRecommended": boolean
        }
      ],
      "vehiclePrice": number,
      "expiresAt": "ISO-8601"
    }

POST /api/v1/financing/applications/:applicationId/select
  Description: Select financing option
  Auth: Required
  Request Body:
    {
      "optionId": "uuid"
    }
  Response: 200 OK
    {
      "selected": true,
      "financingTerms": { ... },
      "nextStep": "documents"
    }
```

### Documents

```
GET /api/v1/purchases/:purchaseId/documents
  Description: Get required documents
  Auth: Required
  Response: 200 OK
    {
      "documents": [
        {
          "documentId": "uuid",
          "type": "purchase_agreement|financing_contract|disclosure",
          "title": "string",
          "status": "pending|signed|rejected",
          "requiredSignatures": number,
          "completedSignatures": number,
          "pdfUrl": "string",
          "order": number
        }
      ],
      "allSigned": boolean
    }

GET /api/v1/documents/:documentId
  Description: Get document for viewing/signing
  Auth: Required
  Response: 200 OK
    {
      "documentId": "uuid",
      "title": "string",
      "pdfUrl": "string",
      "signatureFields": [
        {
          "fieldId": "uuid",
          "type": "signature|initials|date",
          "page": number,
          "x": number,
          "y": number,
          "width": number,
          "height": number,
          "required": boolean,
          "signed": boolean
        }
      ]
    }

POST /api/v1/documents/:documentId/sign
  Description: Submit signatures for document
  Auth: Required
  Request Body:
    {
      "signatures": [
        {
          "fieldId": "uuid",
          "type": "signature|initials|date",
          "value": "string (base64 for signature image)",
          "timestamp": "ISO-8601"
        }
      ]
    }
  Response: 200 OK
    {
      "documentId": "uuid",
      "signed": true,
      "signedAt": "ISO-8601",
      "signedPdfUrl": "string",
      "nextDocument": "uuid" | null
    }
```

### Insurance

```
POST /api/v1/purchases/:purchaseId/insurance
  Description: Upload insurance information
  Auth: Required
  Content-Type: multipart/form-data
  Request Body:
    - document: File
    - provider: string
    - policyNumber: string
    - effectiveDate: ISO-8601
    - expirationDate: ISO-8601
  Response: 200 OK
    {
      "insuranceId": "uuid",
      "uploadedAt": "ISO-8601",
      "status": "pending_verification",
      "estimatedVerificationTime": "hours"
    }

GET /api/v1/purchases/:purchaseId/insurance
  Description: Get insurance status
  Auth: Required
  Response: 200 OK
    {
      "insuranceId": "uuid",
      "provider": "string",
      "policyNumber": "string",
      "effectiveDate": "ISO-8601",
      "expirationDate": "ISO-8601",
      "status": "pending|verified|rejected",
      "verifiedAt": "ISO-8601",
      "rejectionReason": "string"
    }
```

### Payment

```
GET /api/v1/purchases/:purchaseId/payment-summary
  Description: Get payment breakdown
  Auth: Required
  Response: 200 OK
    {
      "vehiclePrice": number,
      "fees": [
        { "name": "Documentation Fee", "amount": 499.00 },
        { "name": "Registration", "amount": 120.00 }
      ],
      "taxes": [
        { "name": "HST", "rate": 0.13, "amount": number }
      ],
      "credits": [
        { "name": "Deposit", "amount": -100.00 },
        { "name": "Trade-in Credit", "amount": number }
      ],
      "subtotal": number,
      "totalDue": number,
      "financing": {
        "downPayment": number,
        "financed": number,
        "dueToday": number
      }
    }

GET /api/v1/purchases/:purchaseId/payment-methods
  Description: Get available payment methods
  Auth: Required
  Response: 200 OK
    {
      "savedMethods": [
        {
          "id": "uuid",
          "type": "card",
          "last4": "string",
          "brand": "string",
          "expiryMonth": number,
          "expiryYear": number
        }
      ],
      "availableTypes": ["card", "bank_transfer", "certified_check"]
    }

POST /api/v1/purchases/:purchaseId/pay
  Description: Process payment
  Auth: Required
  Request Body:
    {
      "paymentMethodId": "uuid" | null,
      "newPaymentMethod": {
        "type": "card|bank_transfer",
        "token": "string"
      },
      "amount": number,
      "agreedToTerms": boolean
    }
  Response: 200 OK
    {
      "transactionId": "uuid",
      "status": "processing|completed|failed",
      "amount": number,
      "processedAt": "ISO-8601",
      "receiptUrl": "string"
    }

POST /api/v1/purchases/:purchaseId/complete
  Description: Finalize purchase
  Auth: Required
  Response: 200 OK
    {
      "purchaseId": "uuid",
      "completedAt": "ISO-8601",
      "confirmationNumber": "string",
      "nextSteps": ["schedule_delivery"],
      "documents": [
        { "type": "receipt", "url": "string" },
        { "type": "purchase_agreement", "url": "string" }
      ]
    }
```

---

## Data Models

### Reservation

```typescript
interface Reservation {
  id: string;
  vehicleId: string;
  customerId: string;
  confirmationNumber: string;
  status: ReservationStatus;
  depositAmount: number;
  depositTransactionId: string;
  depositPaidAt: Date;
  expiresAt: Date;
  extendedAt?: Date;
  advisorId?: string;
  createdAt: Date;
  updatedAt: Date;
  convertedToPurchaseId?: string;
  cancelledAt?: Date;
  cancellationReason?: string;
}

enum ReservationStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CONVERTED = 'converted',
  CANCELLED = 'cancelled'
}
```

### FinancingApplication

```typescript
interface FinancingApplication {
  id: string;
  reservationId: string;
  customerId: string;
  vehicleId: string;
  vehiclePrice: number;
  personalInfo: EncryptedPersonalInfo;
  employmentInfo: EmploymentInfo;
  creditCheckAuthorized: boolean;
  creditScore?: number;
  status: FinancingStatus;
  submittedAt: Date;
  decidedAt?: Date;
  selectedOptionId?: string;
  lenderReferenceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum FinancingStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  DECLINED = 'declined',
  NEEDS_INFO = 'needs_info',
  COMPLETED = 'completed'
}

interface FinancingOption {
  id: string;
  applicationId: string;
  lenderId: string;
  lenderName: string;
  apr: number;
  term: number; // months
  monthlyPayment: number;
  downPaymentRequired: number;
  downPaymentPercent: number;
  totalInterest: number;
  totalCost: number;
  validUntil: Date;
  isRecommended: boolean;
}
```

### Purchase

```typescript
interface Purchase {
  id: string;
  reservationId: string;
  vehicleId: string;
  customerId: string;
  advisorId: string;
  vehiclePrice: number;
  fees: Fee[];
  taxes: Tax[];
  credits: Credit[];
  totalAmount: number;
  financingApplicationId?: string;
  financingOptionId?: string;
  downPaymentAmount?: number;
  financedAmount?: number;
  status: PurchaseStatus;
  documentsStatus: DocumentsStatus;
  insuranceStatus: InsuranceStatus;
  paymentStatus: PaymentStatus;
  completedAt?: Date;
  confirmationNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

enum PurchaseStatus {
  PENDING_DOCUMENTS = 'pending_documents',
  PENDING_INSURANCE = 'pending_insurance',
  PENDING_PAYMENT = 'pending_payment',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}
```

### Document

```typescript
interface PurchaseDocument {
  id: string;
  purchaseId: string;
  type: DocumentType;
  title: string;
  templateId: string;
  pdfUrl: string;
  signedPdfUrl?: string;
  status: DocumentStatus;
  signatureFields: SignatureField[];
  generatedAt: Date;
  signedAt?: Date;
  order: number;
}

enum DocumentType {
  PURCHASE_AGREEMENT = 'purchase_agreement',
  FINANCING_CONTRACT = 'financing_contract',
  DISCLOSURE = 'disclosure',
  ODOMETER_STATEMENT = 'odometer_statement',
  TITLE_APPLICATION = 'title_application'
}
```

---

## Business Rules

### Reservation

1. $100 refundable deposit required
2. Reservation valid for 7 days
3. Maximum 1 extension per reservation (3 days)
4. Vehicle unavailable to others during reservation
5. Full refund if cancelled within period
6. Auto-expire if not converted to purchase

### Financing

1. Credit check requires explicit consent
2. Multiple lender options presented when available
3. Financing options valid for 48 hours
4. Down payment minimum varies by credit tier
5. Maximum financing term: 84 months
6. Interest rates based on credit, term, and amount

### Documentation

1. All documents must be signed before payment
2. E-signature legally binding
3. Signed documents stored for 7 years
4. Documents generated from templates with customer data

### Insurance

1. Insurance required before delivery
2. Must cover full vehicle value
3. Customer name must match purchase
4. Verified within 24 hours

### Payment

1. Payment required within 48 hours of document signing
2. Multiple payment methods accepted
3. Deposit applied to final payment
4. Trade-in credit applied after appraisal

---

## Service Dependencies

### External Services

- **Payment Gateway**: Stripe/Adyen for payments
- **Credit Bureau**: Equifax/TransUnion for credit checks
- **Lender APIs**: Third-party financing
- **Document Service**: DocuSign/HelloSign for e-signatures
- **Insurance Verification**: Third-party verification

### Internal Services

- **User Service**: Customer authentication
- **Vehicle Service**: Vehicle data
- **Inventory Service**: Availability updates
- **Notification Service**: Email/SMS confirmations
- **Advisor Service**: Assignment and tracking

---

## Security

### Data Protection

- SIN encrypted with AES-256
- Credit data tokenized
- PCI DSS compliance for payments
- Document access audit logged

### Access Control

- Customer can only access own purchases
- Advisor can access assigned customers
- Manager override for escalations

---

## Error Handling

| Error Code | Description | HTTP Status |
|------------|-------------|-------------|
| `VEHICLE_UNAVAILABLE` | Vehicle already reserved/sold | 409 |
| `RESERVATION_EXPIRED` | Reservation period ended | 410 |
| `FINANCING_DECLINED` | Loan application denied | 422 |
| `DOCUMENT_ALREADY_SIGNED` | Cannot re-sign | 409 |
| `INSURANCE_INVALID` | Policy doesn't meet requirements | 422 |
| `PAYMENT_FAILED` | Payment processing error | 402 |
| `INSUFFICIENT_FUNDS` | Payment declined | 402 |

---

## Monitoring

### Key Metrics

- Reservation conversion rate
- Financing approval rate
- Average time to complete purchase
- Document signing completion rate
- Payment success rate

### Alerts

- Reservation conversion < 20%
- Payment failure rate > 5%
- Document signing timeout > 2 hours
- Financing decision > 24 hours
