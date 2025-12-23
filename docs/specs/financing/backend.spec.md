# Financing - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Financing
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

Backend services for financing handle loan applications, credit checks, lender integrations, and financing agreement management.

---

## Requirements

### REQ-FN-B-001: Payment Calculation
**Description:** Calculate loan payments based on inputs
**Priority:** High

**Acceptance Criteria:**
- [ ] Calculate monthly payment using standard amortization
- [ ] Support variable APR ranges based on credit tiers
- [ ] Include all fees in total cost calculation
- [ ] Support bi-weekly payment calculations

### REQ-FN-B-002: Credit Check Integration
**Description:** Integrate with credit bureaus for checks
**Priority:** High

**Acceptance Criteria:**
- [ ] Soft pull for pre-qualification (Equifax, TransUnion)
- [ ] Hard pull for final approval
- [ ] Secure handling of SIN data
- [ ] Compliance with PIPEDA regulations

### REQ-FN-B-003: Lender Integration
**Description:** Connect with financing partners
**Priority:** High

**Acceptance Criteria:**
- [ ] Submit applications to multiple lenders
- [ ] Aggregate and compare offers
- [ ] Handle approval/denial responses
- [ ] Support conditional approvals

---

## API Endpoints

### POST /api/v1/financing/calculate

Calculate loan payments.

**Request:**
```json
{
  "vehiclePrice": 24999,
  "downPayment": 2500,
  "term": 60,
  "creditTier": "good"
}
```

**Response:**
```json
{
  "monthlyPayment": {
    "min": 385,
    "max": 435
  },
  "biweeklyPayment": {
    "min": 178,
    "max": 201
  },
  "apr": {
    "min": 6.99,
    "max": 12.99
  },
  "totalCost": {
    "min": 25600,
    "max": 28600
  },
  "loanAmount": 22499
}
```

---

### POST /api/v1/financing/applications

Submit financing application.

**Request:**
```json
{
  "vehicleId": "veh_abc123",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1985-06-15",
    "email": "john@example.com",
    "phone": "416-555-1234",
    "address": {
      "street": "123 Main St",
      "city": "Toronto",
      "province": "ON",
      "postalCode": "M5V 2T6"
    }
  },
  "employmentInfo": {
    "status": "employed",
    "employer": "Tech Corp",
    "jobTitle": "Software Developer",
    "monthsEmployed": 36,
    "monthlyIncome": 7500
  },
  "financialInfo": {
    "monthlyHousingPayment": 1500,
    "monthlyDebtPayments": 300
  },
  "downPayment": 2500,
  "term": 60,
  "consentToCreditCheck": true
}
```

**Response:**
```json
{
  "applicationId": "app_xyz789",
  "status": "submitted",
  "estimatedDecisionTime": "2-5 minutes",
  "createdAt": "2025-12-23T10:30:00Z"
}
```

---

### GET /api/v1/financing/applications/:applicationId/options

Get financing options after approval.

**Response:**
```json
{
  "applicationId": "app_xyz789",
  "status": "approved",
  "options": [
    {
      "id": "opt_001",
      "lender": "TD Auto Finance",
      "lenderLogo": "https://cdn.example.com/lenders/td.png",
      "apr": 6.99,
      "term": 60,
      "monthlyPayment": 379,
      "downPayment": 2500,
      "loanAmount": 22499,
      "totalCost": 25240,
      "totalInterest": 2741,
      "isBestRate": true,
      "expiresAt": "2025-12-30T23:59:59Z"
    },
    {
      "id": "opt_002",
      "lender": "Scotiabank",
      "lenderLogo": "https://cdn.example.com/lenders/scotia.png",
      "apr": 8.49,
      "term": 60,
      "monthlyPayment": 395,
      "downPayment": 2500,
      "loanAmount": 22499,
      "totalCost": 26200,
      "totalInterest": 3701,
      "isBestRate": false,
      "expiresAt": "2025-12-30T23:59:59Z"
    }
  ],
  "approvedAmount": 22499,
  "creditScore": 720,
  "expiresAt": "2025-12-30T23:59:59Z"
}
```

---

### POST /api/v1/financing/applications/:applicationId/select

Select financing option.

**Request:**
```json
{
  "optionId": "opt_001"
}
```

**Response:**
```json
{
  "applicationId": "app_xyz789",
  "selectedOption": {
    "id": "opt_001",
    "lender": "TD Auto Finance",
    "apr": 6.99,
    "term": 60,
    "monthlyPayment": 379
  },
  "nextSteps": [
    "Review loan agreement",
    "E-sign documents",
    "Complete vehicle purchase"
  ],
  "agreementUrl": "/api/v1/financing/applications/app_xyz789/agreement"
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `FinancingApplicationStarted` | Application created | `{ applicationId, vehicleId, userId }` |
| `CreditCheckAuthorized` | User consents to credit check | `{ applicationId, userId }` |
| `CreditScoreRetrieved` | Credit score obtained | `{ applicationId, creditScore }` |
| `FinancingOptionsCalculated` | Lender options generated | `{ applicationId, optionCount }` |
| `FinancingApproved` | Application approved | `{ applicationId, approvedAmount, apr }` |
| `FinancingDenied` | Application denied | `{ applicationId, reason }` |
| `FinancingTermsAccepted` | Customer selects option | `{ applicationId, optionId }` |
| `LoanAgreementSigned` | E-signature completed | `{ loanId, signedAt }` |
| `FinancingCompleted` | Loan disbursed | `{ loanId, disbursedAmount }` |

---

## Data Models

```typescript
interface FinancingApplication {
  id: string;
  vehicleId: string;
  userId: string;
  status: ApplicationStatus;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  financialInfo: FinancialInfo;
  requestedAmount: number;
  downPayment: number;
  term: number;
  creditScore: number | null;
  approvedAmount: number | null;
  selectedOptionId: string | null;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'credit_check_pending'
  | 'under_review'
  | 'approved'
  | 'denied'
  | 'expired'
  | 'completed';
```

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
