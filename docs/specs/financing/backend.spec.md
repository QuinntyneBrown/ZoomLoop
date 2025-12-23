# Financing - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Financing

---

## Overview

The Financing backend handles loan applications, credit checks, lender integration, and loan document processing.

---

## Domain Events

### Financing Application

| Event | Description | Payload |
|-------|-------------|---------|
| `FinancingApplicationStarted` | Application begun | `{ applicationId, customerId, startedAt }` |
| `CreditCheckAuthorized` | Credit permission | `{ applicationId, authorizedAt }` |
| `CreditScoreRetrieved` | Credit obtained | `{ applicationId, creditScore, retrievedAt }` |
| `FinancingOptionsCalculated` | Options generated | `{ applicationId, options[], calculatedAt }` |
| `FinancingTermsPresented` | Terms shown | `{ applicationId, terms[], presentedAt }` |

### Financing Approval

| Event | Description | Payload |
|-------|-------------|---------|
| `FinancingApplicationSubmitted` | Sent to lender | `{ applicationId, lenderId, submittedAt }` |
| `FinancingUnderReview` | Lender reviewing | `{ applicationId, reviewStartedAt }` |
| `FinancingApproved` | Loan approved | `{ applicationId, amount, rate, term, approvedAt }` |
| `FinancingDenied` | Loan denied | `{ applicationId, deniedAt, reason }` |
| `FinancingTermsAccepted` | Customer accepts | `{ applicationId, acceptedAt }` |
| `LoanAgreementSigned` | Contract signed | `{ loanId, signedAt, agreementHash }` |

---

## API Endpoints

### Pre-Qualification

```
POST /api/v1/financing/prequalify
  Description: Quick pre-qualification check
  Auth: Optional
  Request Body:
    {
      "annualIncome": number,
      "employmentStatus": "employed|self_employed|retired|student|other",
      "creditEstimate": "excellent|good|fair|building",
      "vehiclePrice": number
    }
  Response: 200 OK
    {
      "prequalified": boolean,
      "maxApprovalAmount": number,
      "estimatedRate": {
        "min": number,
        "max": number
      },
      "estimatedPayment": {
        "min": number,
        "max": number
      },
      "validFor": "30 days",
      "nextSteps": ["string"]
    }
```

### Application

```
POST /api/v1/financing/applications
  Description: Submit full financing application
  Auth: Required
  Request Body:
    {
      "vehicleId": "uuid",
      "requestedAmount": number,
      "personalInfo": {
        "legalName": {
          "first": "string",
          "middle": "string",
          "last": "string"
        },
        "dateOfBirth": "YYYY-MM-DD",
        "sin": "string (encrypted)",
        "address": {
          "street": "string",
          "city": "string",
          "province": "string",
          "postalCode": "string"
        },
        "timeAtAddress": {
          "years": number,
          "months": number
        },
        "previousAddress": { ... }, // if < 2 years
        "housingStatus": "own|rent|other",
        "monthlyHousingPayment": number,
        "email": "string",
        "phone": "string"
      },
      "employmentInfo": {
        "status": "employed|self_employed|retired|student|other",
        "employer": "string",
        "employerPhone": "string",
        "jobTitle": "string",
        "timeAtEmployer": {
          "years": number,
          "months": number
        },
        "annualIncome": number,
        "payFrequency": "weekly|biweekly|monthly",
        "additionalIncome": number,
        "additionalIncomeSource": "string"
      },
      "references": [
        {
          "name": "string",
          "relationship": "string",
          "phone": "string"
        }
      ],
      "consent": {
        "creditCheck": boolean,
        "termsAccepted": boolean,
        "electronicConsent": boolean
      }
    }
  Response: 201 Created
    {
      "applicationId": "uuid",
      "status": "submitted",
      "submittedAt": "ISO-8601",
      "estimatedDecisionTime": "minutes|hours"
    }

GET /api/v1/financing/applications/:applicationId
  Description: Get application status
  Auth: Required
  Response: 200 OK
    {
      "applicationId": "uuid",
      "status": "submitted|under_review|approved|declined|needs_info",
      "vehicleId": "uuid",
      "requestedAmount": number,
      "submittedAt": "ISO-8601",
      "decision": {
        "status": "approved|declined",
        "decidedAt": "ISO-8601",
        "reason": "string"
      },
      "timeline": [
        { "event": "string", "timestamp": "ISO-8601" }
      ]
    }

GET /api/v1/financing/applications/:applicationId/options
  Description: Get approved financing options
  Auth: Required
  Response: 200 OK
    {
      "applicationId": "uuid",
      "vehiclePrice": number,
      "options": [
        {
          "optionId": "uuid",
          "lender": {
            "id": "uuid",
            "name": "string",
            "logo": "string"
          },
          "terms": {
            "apr": number,
            "term": number,
            "monthlyPayment": number,
            "downPayment": number,
            "financeAmount": number,
            "totalInterest": number,
            "totalCost": number,
            "firstPaymentDate": "ISO-8601"
          },
          "isRecommended": boolean,
          "expiresAt": "ISO-8601"
        }
      ]
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
      "loanId": "uuid",
      "terms": { ... },
      "nextStep": "sign_documents"
    }
```

### Calculator

```
GET /api/v1/financing/calculator
  Description: Calculate payment estimates
  Auth: Optional
  Query Parameters:
    - vehiclePrice: number
    - downPayment: number
    - term: number (months)
    - creditTier: excellent|good|fair|building
  Response: 200 OK
    {
      "monthlyPayment": number,
      "estimatedAPR": number,
      "totalInterest": number,
      "totalCost": number,
      "amortization": [
        {
          "payment": number,
          "principal": number,
          "interest": number,
          "balance": number
        }
      ]
    }
```

---

## Data Models

```typescript
interface FinancingApplication {
  id: string;
  customerId: string;
  vehicleId: string;
  requestedAmount: number;
  personalInfo: EncryptedPersonalInfo;
  employmentInfo: EmploymentInfo;
  references: Reference[];
  consent: ConsentRecord;
  creditCheck?: {
    authorized: boolean;
    authorizedAt: Date;
    score?: number;
    retrievedAt?: Date;
  };
  status: ApplicationStatus;
  submittedAt: Date;
  decidedAt?: Date;
  selectedOptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface FinancingOption {
  id: string;
  applicationId: string;
  lenderId: string;
  apr: number;
  term: number;
  monthlyPayment: number;
  downPayment: number;
  financeAmount: number;
  totalInterest: number;
  totalCost: number;
  firstPaymentDate: Date;
  isRecommended: boolean;
  expiresAt: Date;
}

interface Loan {
  id: string;
  applicationId: string;
  optionId: string;
  customerId: string;
  vehicleId: string;
  lenderId: string;
  principal: number;
  apr: number;
  term: number;
  monthlyPayment: number;
  firstPaymentDate: Date;
  status: LoanStatus;
  agreementSignedAt?: Date;
  disbursedAt?: Date;
  createdAt: Date;
}

enum LoanStatus {
  PENDING_SIGNATURE = 'pending_signature',
  SIGNED = 'signed',
  DISBURSED = 'disbursed',
  ACTIVE = 'active',
  PAID_OFF = 'paid_off',
  DEFAULTED = 'defaulted'
}
```

---

## Business Rules

1. Credit check requires explicit authorization
2. Applications expire after 30 days
3. Approval valid for 14 days
4. Multiple lender submissions for best rates
5. Down payment affects rate and approval
6. Maximum term varies by vehicle age

---

## Lender Integration

### Supported Lenders

- Bank partners
- Captive finance
- Credit unions
- Subprime lenders

### Integration Flow

1. Application formatted per lender spec
2. Submit to multiple lenders in parallel
3. Aggregate responses
4. Present best options to customer
5. Selected lender notified
6. Documents generated by lender

---

## Security

- SIN encrypted with AES-256
- Credit data tokenized
- PII access audit logged
- Data retention per regulations
