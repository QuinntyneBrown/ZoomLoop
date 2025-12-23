# Warranty - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Warranty & Protection

---

## Overview

The Warranty feature enables customers to view their warranty coverage, purchase extended warranties, and submit warranty claims.

---

## User Stories

### US-1: View Warranty Coverage
**As a** vehicle owner
**I want to** see my warranty details
**So that** I understand what's covered

### US-2: Purchase Extended Warranty
**As a** vehicle buyer
**I want to** buy extended coverage
**So that** I have longer protection

### US-3: Submit Warranty Claim
**As a** vehicle owner
**I want to** file a warranty claim
**So that** I can get covered repairs

---

## UI Components

### Warranty Summary Card

```
┌─────────────────────────────────────┐
│  Warranty Coverage                   │
│  2021 Honda Civic LX                │
│                                       │
│  ✓ Included Warranty                │
│  90 Days / 4,500 km                 │
│  Expires: March 21, 2026            │
│                                       │
│  Coverage:                           │
│  • Powertrain                        │
│  • Major Components                  │
│  • Electrical Systems               │
│                                       │
│  [View Full Coverage]                │
│  [File a Claim]                      │
│                                       │
│  ─────────────────                   │
│  Want More Coverage?                 │
│  [Explore Extended Warranty →]       │
└─────────────────────────────────────┘
```

### Coverage Details Page

```
┌─────────────────────────────────────────────────────────────┐
│  Your Warranty Coverage                                       │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  Basic Warranty                    ✓ Active             ││
│  │  90 Days / 4,500 km • Expires Mar 21, 2026             ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
│  What's Covered                                              │
│  ──────────────                                               │
│  ✓ Engine and Transmission                                   │
│  ✓ Drive Axle                                                │
│  ✓ Electrical Components                                     │
│  ✓ Air Conditioning                                          │
│  ✓ Steering and Suspension                                   │
│  ✓ Brakes                                                    │
│                                                                │
│  What's Not Covered                                          │
│  ─────────────────                                            │
│  ✗ Wear and tear items (brakes pads, tires, wipers)         │
│  ✗ Maintenance services (oil change, filters)               │
│  ✗ Cosmetic damage                                           │
│  ✗ Pre-existing conditions                                   │
│                                                                │
│  Deductible: $100 per visit                                  │
│                                                                │
│  [Download Coverage Document]                                 │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Extended Warranty Options

```
┌─────────────────────────────────────────────────────────────┐
│  Extend Your Protection                                       │
│                                                                │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  Basic Plus     │ │  Comprehensive  │ │  Premium        ││
│  │─────────────────│ │─────────────────│ │─────────────────││
│  │  1 Year         │ │  2 Years        │ │  3 Years        ││
│  │  20,000 km      │ │  40,000 km      │ │  60,000 km      ││
│  │                  │ │                  │ │                  ││
│  │  $899           │ │  $1,499         │ │  $2,199         ││
│  │                  │ │  ★ Most Popular│ │                  ││
│  │  Powertrain     │ │  Powertrain     │ │  Bumper-to-     ││
│  │  coverage       │ │  + Major        │ │  Bumper         ││
│  │                  │ │  Components     │ │  coverage       ││
│  │                  │ │                  │ │                  ││
│  │  [Select]        │ │  [Select]        │ │  [Select]        ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                                │
│  All plans include:                                          │
│  • 24/7 Roadside Assistance                                  │
│  • Rental Car Reimbursement                                  │
│  • Trip Interruption Coverage                                │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Warranty Claim Form

```
Step 1: Describe the Issue
┌─────────────────────────────────────────────────────────────┐
│  What's the problem?                                         │
│                                                                │
│  Issue Category                                              │
│  [Engine/Transmission ▼]                                     │
│                                                                │
│  Describe the issue                                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                                                           ││
│  │  The engine is making a clicking noise when starting...  ││
│  │                                                           ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
│  When did you first notice this?                             │
│  [December 20, 2025]                                         │
│                                                                │
│  Current Mileage                                             │
│  [38,500] km                                                 │
│                                                                │
│  [Continue]                                                   │
└─────────────────────────────────────────────────────────────┘

Step 2: Supporting Evidence
┌─────────────────────────────────────────────────────────────┐
│  Add photos or videos (optional)                             │
│                                                                │
│  [Drag and drop or click to upload]                          │
│                                                                │
│  Has the vehicle been inspected by a mechanic?               │
│  ○ Yes  ○ No                                                 │
│                                                                │
│  [Continue]                                                   │
└─────────────────────────────────────────────────────────────┘

Step 3: Submit Claim
┌─────────────────────────────────────────────────────────────┐
│  Review and Submit                                           │
│                                                                │
│  Issue: Engine clicking noise                                │
│  Category: Engine/Transmission                               │
│  First noticed: Dec 20, 2025                                 │
│  Mileage: 38,500 km                                          │
│                                                                │
│  Warranty Status: ✓ Active                                   │
│  Coverage: Powertrain included                               │
│                                                                │
│  [Submit Claim]                                               │
│                                                                │
│  A service advisor will contact you within 24 hours.         │
└─────────────────────────────────────────────────────────────┘
```

### Claim Status Card

```
┌─────────────────────────────────────┐
│  Claim #WC-2025-12345               │
│  Submitted: Dec 21, 2025            │
│                                       │
│  Status: Under Review               │
│  ████████░░░░░░░░░░░░               │
│                                       │
│  Issue: Engine clicking noise       │
│                                       │
│  Timeline:                           │
│  ● Submitted - Dec 21               │
│  ◐ Under Review - Dec 22            │
│  ○ Approved/Denied                  │
│  ○ Service Scheduled                │
│  ○ Completed                        │
│                                       │
│  [View Details]  [Contact Support]   │
└─────────────────────────────────────┘
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/my/warranty` | WarrantyOverviewPage | Coverage summary |
| `/my/warranty/coverage` | CoverageDetailsPage | Full coverage |
| `/my/warranty/extend` | ExtendWarrantyPage | Buy extended |
| `/my/warranty/claims` | ClaimsListPage | All claims |
| `/my/warranty/claims/new` | NewClaimPage | File claim |
| `/my/warranty/claims/:id` | ClaimDetailPage | Claim status |

---

## API Integration

```
GET /api/v1/warranties/:vehicleId
  Response: WarrantyDetails

GET /api/v1/warranties/:vehicleId/options
  Response: ExtendedWarrantyOptions[]

POST /api/v1/warranties/:vehicleId/extend
  Body: { optionId, paymentMethodId }

POST /api/v1/warranty-claims
  Body: { vehicleId, category, description, photos[] }

GET /api/v1/warranty-claims/:claimId
  Response: ClaimDetails
```

---

## Analytics Events

- `warranty_viewed`
- `extended_warranty_viewed`
- `extended_warranty_purchased`
- `claim_started`
- `claim_submitted`
- `claim_approved`
