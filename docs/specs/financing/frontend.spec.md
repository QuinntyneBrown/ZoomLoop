# Financing - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Financing

---

## Overview

The Financing feature enables customers to apply for vehicle loans, compare financing options, and complete loan documentation.

---

## User Stories

### US-1: Pre-Qualify for Financing
**As a** car buyer
**I want to** quickly check if I qualify for financing
**So that** I know my budget before shopping

### US-2: Apply for Financing
**As a** car buyer
**I want to** complete a full financing application
**So that** I can get approved for a loan

### US-3: Compare Loan Options
**As a** car buyer
**I want to** compare different loan terms
**So that** I can choose the best option for me

### US-4: Calculate Payments
**As a** car buyer
**I want to** calculate monthly payments
**So that** I can plan my budget

---

## UI Components

### Payment Calculator Widget

```
Location: Vehicle detail sidebar

┌─────────────────────────────────────┐
│  Monthly Payment Estimate           │
│                                       │
│  $458/month                          │
│  ─────────────────                   │
│                                       │
│  Down Payment                        │
│  $0 ────●──────────────── $10,000   │
│  Selected: $2,500                    │
│                                       │
│  Loan Term                           │
│  ○ 36  ○ 48  ● 60  ○ 72 months      │
│                                       │
│  Est. APR: 6.99%                    │
│  Total: $27,480                      │
│                                       │
│  [Get Pre-Approved]                  │
│                                       │
│  ℹ️ Based on estimated rate.        │
│     Actual terms may vary.           │
└─────────────────────────────────────┘
```

### Pre-Qualification Form

```
Quick form (2 minutes):

┌─────────────────────────────────────┐
│  Get Pre-Qualified in Minutes       │
│                                       │
│  Annual Income                       │
│  [___________________]               │
│                                       │
│  Employment Status                   │
│  [Employed ▼]                        │
│                                       │
│  Estimated Credit Score              │
│  ○ Excellent (750+)                 │
│  ○ Good (700-749)                   │
│  ○ Fair (650-699)                   │
│  ○ Building (<650)                  │
│                                       │
│  [Check Pre-Qualification]           │
│                                       │
│  🔒 No impact to credit score       │
└─────────────────────────────────────┘
```

### Pre-Qualification Result

```
┌─────────────────────────────────────┐
│  ✓ You're Pre-Qualified!            │
│                                       │
│  Estimated approval up to:           │
│  $35,000                             │
│                                       │
│  Estimated rate:                     │
│  5.99% - 7.99% APR                  │
│                                       │
│  [Continue to Full Application]      │
│  [Browse Vehicles in Budget]         │
│                                       │
│  Pre-qualification valid for 30 days │
└─────────────────────────────────────┘
```

### Full Application Form

```
Multi-step wizard:

Step 1: Personal Information
- Legal Name
- Date of Birth
- Social Insurance Number (masked)
- Address
- Time at Current Address
- Housing Status (Own/Rent/Other)
- Monthly Housing Payment

Step 2: Employment
- Employment Status
- Employer Name
- Employer Phone
- Job Title
- Time at Employer
- Annual Income
- Additional Income Sources

Step 3: References
- Reference 1 (Name, Relationship, Phone)
- Reference 2 (Name, Relationship, Phone)

Step 4: Consent & Submit
- Credit check authorization
- Terms acceptance
- Electronic consent
- Submit button
```

### Financing Options Display

```
┌─────────────────────────────────────────────────────────────┐
│  Your Financing Options                                       │
│                                                                │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  ★ Recommended  │ │  Lower Payment  │ │  Pay Off Faster ││
│  │─────────────────│ │─────────────────│ │─────────────────││
│  │  $458/month     │ │  $392/month     │ │  $567/month     ││
│  │  60 months      │ │  72 months      │ │  48 months      ││
│  │  6.49% APR      │ │  6.99% APR      │ │  5.99% APR      ││
│  │                  │ │                  │ │                  ││
│  │  Down: $2,500   │ │  Down: $2,500   │ │  Down: $2,500   ││
│  │  Total: $27,480 │ │  Total: $28,224 │ │  Total: $27,216 ││
│  │  Interest: $2,981│ │  Interest: $3,725│ │  Interest: $2,717││
│  │                  │ │                  │ │                  ││
│  │  [Select]        │ │  [Select]        │ │  [Select]        ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                                │
│  All options from: Premier Auto Finance                       │
│  Approval expires: Jan 15, 2026                              │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Loan Terms Comparison Table

```
┌──────────────────────────────────────────────────────────────┐
│                  │ Option 1 │ Option 2 │ Option 3 │         │
│──────────────────│──────────│──────────│──────────│         │
│ Monthly Payment  │ $458     │ $392     │ $567     │         │
│ Term             │ 60 mo    │ 72 mo    │ 48 mo    │         │
│ APR              │ 6.49%    │ 6.99%    │ 5.99%    │         │
│ Total Interest   │ $2,981   │ $3,725   │ $2,717   │         │
│ Total Cost       │ $27,480  │ $28,224  │ $27,216  │         │
│ First Payment    │ Feb 1    │ Feb 1    │ Feb 1    │         │
└──────────────────────────────────────────────────────────────┘
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/financing` | FinancingLandingPage | Pre-qualification |
| `/financing/apply` | FinancingApplicationPage | Full application |
| `/financing/options` | FinancingOptionsPage | View options |
| `/financing/calculator` | CalculatorPage | Payment calculator |
| `/purchase/:id/financing` | PurchaseFinancingPage | Financing in purchase |

---

## State Management

```typescript
interface FinancingState {
  preQualification: {
    completed: boolean;
    approved: boolean;
    maxAmount: number;
    estimatedRate: { min: number; max: number };
    validUntil: Date;
  } | null;
  application: {
    id: string;
    status: ApplicationStatus;
    submittedAt: Date;
  } | null;
  options: FinancingOption[];
  selectedOption: FinancingOption | null;
  calculator: {
    vehiclePrice: number;
    downPayment: number;
    term: number;
    rate: number;
    monthlyPayment: number;
  };
}
```

---

## API Integration

```
POST /api/v1/financing/prequalify
  Body: { income, employmentStatus, creditEstimate }
  Response: { prequalified, maxAmount, estimatedRate }

POST /api/v1/financing/applications
  Body: { personalInfo, employmentInfo, references }
  Response: { applicationId, status }

GET /api/v1/financing/applications/:id/options
  Response: { options: FinancingOption[] }

POST /api/v1/financing/applications/:id/select
  Body: { optionId }
  Response: { selected, terms }

GET /api/v1/financing/calculator
  Query: { price, downPayment, term, creditTier }
  Response: { monthlyPayment, totalInterest, totalCost }
```

---

## Analytics Events

- `financing_calculator_used`
- `prequalification_started`
- `prequalification_completed`
- `financing_application_started`
- `financing_application_submitted`
- `financing_approved`
- `financing_option_selected`
