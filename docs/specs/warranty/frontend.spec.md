# Warranty & Protection - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Warranty & Protection Plans
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

The Warranty feature provides customers with included warranty coverage on all vehicles and optional extended protection plans for additional peace of mind.

---

## Requirements

### REQ-WR-F-001: Warranty Information Display
**Description:** Display included warranty coverage
**Priority:** High

**Acceptance Criteria:**
- [ ] Show standard 90-day warranty details
- [ ] Coverage breakdown by category
- [ ] What's covered vs. not covered
- [ ] Warranty start/end dates
- [ ] Digital warranty card access

### REQ-WR-F-002: Extended Warranty Options
**Description:** Present extended coverage plans
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Multiple coverage levels (1yr, 2yr, 3yr+)
- [ ] Coverage comparison table
- [ ] Price for each plan
- [ ] Add to purchase or buy later
- [ ] Plan details and exclusions

### REQ-WR-F-003: Warranty Claims
**Description:** Submit and track warranty claims
**Priority:** High

**Acceptance Criteria:**
- [ ] Claim submission form
- [ ] Issue description and photos
- [ ] Claim status tracking
- [ ] Approved service centers
- [ ] Claim history

---

## UI Components

### Included Warranty Card

```
┌─────────────────────────────────────────────────────────────────┐
│  🛡️ Your Warranty Coverage                                      │
│  ─────────────────────────                                       │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  90-Day Limited Warranty                                   │  │
│  │  ────────────────────────                                  │  │
│  │                                                            │  │
│  │  Coverage Period: Dec 28, 2025 - Mar 28, 2026             │  │
│  │  Vehicle: 2021 Honda Civic LX                              │  │
│  │  VIN: 1HGCV1F19MA123456                                    │  │
│  │                                                            │  │
│  │  ✓ Engine                  ✓ Transmission                 │  │
│  │  ✓ Drive Axle             ✓ Electrical                    │  │
│  │  ✓ Air Conditioning       ✓ Suspension                    │  │
│  │                                                            │  │
│  │  Deductible: $100 per claim                                │  │
│  │                                                            │  │
│  │  [View Full Coverage Details]  [Download Warranty Card]    │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Want more coverage? [Upgrade to Extended Protection →]          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Extended Protection Plans

```
┌─────────────────────────────────────────────────────────────────┐
│  Extended Protection Plans                                       │
│  ─────────────────────────                                       │
│                                                                   │
│  Protect your investment with comprehensive coverage.           │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  BASIC       │  │  ★ PREMIUM   │  │  PLATINUM    │          │
│  │  1 Year      │  │  3 Years     │  │  5 Years     │          │
│  │              │  │              │  │              │          │
│  │  $599        │  │  $1,299      │  │  $1,999      │          │
│  │              │  │              │  │              │          │
│  │  ✓ Engine    │  │  ✓ Engine    │  │  ✓ All Basic │          │
│  │  ✓ Trans     │  │  ✓ Trans     │  │  ✓ All Premium│         │
│  │  ✓ Drivetrain│  │  ✓ Drivetrain│  │  ✓ Brakes    │          │
│  │              │  │  ✓ Electrical│  │  ✓ Steering  │          │
│  │              │  │  ✓ A/C       │  │  ✓ Exhaust   │          │
│  │              │  │  ✓ Seals     │  │  ✓ Roadside  │          │
│  │              │  │              │  │  ✓ Rental Car│          │
│  │              │  │              │  │              │          │
│  │  $0 deduct.  │  │  $0 deduct.  │  │  $0 deduct.  │          │
│  │              │  │              │  │              │          │
│  │  [Select]    │  │  [Select]    │  │  [Select]    │          │
│  │              │  │  BEST VALUE  │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  All plans include: Transferable warranty, No claim limit,       │
│  Nationwide coverage, Pay as you go financing available          │
│                                                                   │
│  [Compare All Plans]                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Warranty Claim Form

```
┌─────────────────────────────────────────────────────────────────┐
│  Submit a Warranty Claim                                         │
│  ─────────────────────────                                       │
│                                                                   │
│  Vehicle: 2021 Honda Civic LX                                    │
│  Warranty: 90-Day Limited + Premium Extended                     │
│                                                                   │
│  Issue Category *                                                │
│  [Engine ▼]                                                      │
│                                                                   │
│  Describe the Issue *                                            │
│  [                                                    ]          │
│  [                                                    ]          │
│  [                                                    ]          │
│                                                                   │
│  Current Mileage *                                               │
│  [38,500     ] km                                                │
│                                                                   │
│  When did the issue start? *                                     │
│  [December 30, 2025 ▼]                                           │
│                                                                   │
│  Upload Photos/Videos (optional)                                 │
│  [+ Add Files]                                                   │
│                                                                   │
│  Preferred Service Location                                      │
│  ○ Clutch Service Center - Toronto                              │
│  ○ Authorized Partner - Honda Downtown                          │
│  ○ I'll choose later                                            │
│                                                                   │
│                              [Submit Claim →]                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface WarrantyState {
  // Included warranty
  standardWarranty: WarrantyCoverage | null;

  // Extended warranty
  extendedWarranty: ExtendedWarranty | null;
  availablePlans: WarrantyPlan[];

  // Claims
  claims: WarrantyClaim[];
  activeClaim: WarrantyClaim | null;

  // Service
  serviceCenters: ServiceCenter[];
}

interface WarrantyCoverage {
  id: string;
  type: 'standard' | 'extended';
  vehicleId: string;
  startDate: string;
  endDate: string;
  coverageItems: string[];
  deductible: number;
  status: 'active' | 'expired';
}

interface WarrantyClaim {
  id: string;
  warrantyId: string;
  category: string;
  description: string;
  mileage: number;
  status: ClaimStatus;
  serviceCenterId: string | null;
  createdAt: string;
  resolvedAt: string | null;
}

type ClaimStatus = 'submitted' | 'under_review' | 'approved' | 'denied' | 'in_service' | 'completed';
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `WarrantyIncluded` | Vehicle purchased | `{ warrantyId, vehicleId, coverage }` |
| `ExtendedWarrantyOffered` | Options presented | `{ vehicleId, plans }` |
| `ExtendedWarrantyPurchased` | Plan bought | `{ warrantyId, planType, cost }` |
| `WarrantyClaimSubmitted` | Claim filed | `{ claimId, category }` |
| `WarrantyClaimApproved` | Claim accepted | `{ claimId, coverageAmount }` |
| `WarrantyClaimDenied` | Claim rejected | `{ claimId, reason }` |
| `WarrantyServiceScheduled` | Repair scheduled | `{ claimId, serviceCenterId, date }` |
| `WarrantyServiceCompleted` | Repair done | `{ claimId, repairDetails }` |

---

## Mockup

![Warranty Mockup](./mockup-warranty.png)
