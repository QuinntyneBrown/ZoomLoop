# Financing - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Financing
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** B

---

## Overview

The Financing feature enables customers to apply for vehicle financing, get pre-approved, compare loan options, and complete financing as part of the vehicle purchase process.

---

## Requirements

### REQ-FN-F-001: Financing Calculator
**Description:** Interactive payment calculator on vehicle pages
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Calculate monthly payments based on price, down payment, term, rate
- [ ] Adjustable down payment slider ($0 - 50% of price)
- [ ] Term options: 24, 36, 48, 60, 72, 84 months
- [ ] Display estimated APR range
- [ ] Update calculations in real-time
- [ ] Show bi-weekly payment option

### REQ-FN-F-002: Pre-Approval Application
**Description:** Online financing pre-approval application
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Multi-step application form
- [ ] Personal information collection
- [ ] Employment and income verification
- [ ] Credit check authorization
- [ ] Soft pull for pre-qualification (no credit impact)
- [ ] Hard pull for final approval
- [ ] Application save and resume
- [ ] Progress indicator

### REQ-FN-F-003: Financing Options Display
**Description:** Present approved financing options
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Show multiple lender options
- [ ] Compare rates, terms, monthly payments
- [ ] Highlight best rate option
- [ ] Display total cost of loan
- [ ] Show APR (Annual Percentage Rate)
- [ ] Terms and conditions link

### REQ-FN-F-004: Financing Selection
**Description:** Allow customer to select and confirm financing
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Select preferred financing option
- [ ] Review final terms
- [ ] E-signature for financing agreement
- [ ] Confirmation receipt

---

## UI Components

### Payment Calculator

```
┌────────────────────────────────────────────────────────────────┐
│  Monthly Payment Calculator                                     │
│  ───────────────────────────                                    │
│                                                                  │
│  Vehicle Price: $24,999                                         │
│                                                                  │
│  Down Payment                                                    │
│  $0 ──────────●────────────────────────────── $12,500           │
│  $2,500                                                          │
│                                                                  │
│  Loan Term                                                       │
│  [24] [36] [48] [60*] [72] [84] months                          │
│                                                                  │
│  Estimated Rate: 6.99% - 12.99% APR                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  Estimated Monthly Payment                               │    │
│  │                                                          │    │
│  │  $385 - $435 /month                                      │    │
│  │  (Based on credit score)                                 │    │
│  │                                                          │    │
│  │  Bi-weekly: $178 - $201                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  [Get Pre-Approved] ← Primary CTA                               │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

### Pre-Approval Application Steps

```
Step 1: Personal Information
- Full name
- Date of birth
- Email
- Phone
- Address

Step 2: Employment
- Employment status
- Employer name
- Job title
- Time at job
- Monthly income

Step 3: Financial
- Monthly housing payment
- Other monthly debts
- Bank account info (optional)

Step 4: Credit Authorization
- SIN (last 4 digits)
- Credit check consent
- Terms agreement

Step 5: Review & Submit
```

### Financing Options Display

```
┌──────────────────────────────────────────────────────────────────┐
│  Your Financing Options                                           │
│  ────────────────────────                                         │
│                                                                    │
│  ┌─────────────────────────────┐  ┌─────────────────────────────┐ │
│  │  ⭐ BEST RATE               │  │  Option 2                   │ │
│  │                             │  │                             │ │
│  │  Lender: TD Auto Finance    │  │  Lender: Scotiabank        │ │
│  │                             │  │                             │ │
│  │  $379/month                 │  │  $395/month                 │ │
│  │  (60 months @ 6.99% APR)    │  │  (60 months @ 8.49% APR)    │ │
│  │                             │  │                             │ │
│  │  Down Payment: $2,500       │  │  Down Payment: $2,500       │ │
│  │  Total Cost: $25,240        │  │  Total Cost: $26,200        │ │
│  │                             │  │                             │ │
│  │  [Select This Option]       │  │  [Select This Option]       │ │
│  │                             │  │                             │ │
│  └─────────────────────────────┘  └─────────────────────────────┘ │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface FinancingState {
  // Calculator
  calculator: {
    vehiclePrice: number;
    downPayment: number;
    term: number;
    estimatedRateMin: number;
    estimatedRateMax: number;
    monthlyPaymentMin: number;
    monthlyPaymentMax: number;
  };

  // Application
  application: {
    step: number;
    personalInfo: PersonalInfo | null;
    employmentInfo: EmploymentInfo | null;
    financialInfo: FinancialInfo | null;
    isSubmitting: boolean;
    applicationId: string | null;
  };

  // Approval
  approval: {
    status: 'pending' | 'approved' | 'denied' | null;
    options: FinancingOption[];
    selectedOptionId: string | null;
    approvalExpiry: string | null;
  };
}

interface FinancingOption {
  id: string;
  lender: string;
  apr: number;
  term: number;
  monthlyPayment: number;
  downPayment: number;
  totalCost: number;
  isBestRate: boolean;
}
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `FinancingApplicationStarted` | Application opened | `{ vehicleId, userId }` |
| `FinancingOptionsCalculated` | Calculator updated | `{ vehicleId, term, downPayment }` |
| `CreditCheckAuthorized` | User consents | `{ applicationId, userId }` |
| `FinancingOptionsPresented` | Options displayed | `{ applicationId, optionCount }` |
| `FinancingSelected` | Option selected | `{ applicationId, optionId, lender }` |
| `FinancingApproved` | Loan approved | `{ applicationId, amount, apr }` |
| `FinancingDeclined` | Loan denied | `{ applicationId, reason }` |
| `LoanAgreementSigned` | E-signature completed | `{ loanId, signedAt }` |

---

## Mockup

![Financing Mockup](./mockup-financing.png)
