# Test Ownership (10-Day Money-Back Guarantee) - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Test Ownership & Returns
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

The Test Ownership feature provides customers with a 10-day/750km trial period during which they can return or exchange the vehicle for a full refund. This is a key differentiator and trust-building feature.

---

## Requirements

### REQ-TO-F-001: Trial Period Dashboard
**Description:** Display trial period status and options
**Priority:** High

**Acceptance Criteria:**
- [ ] Show days remaining in trial
- [ ] Show mileage remaining (750km limit)
- [ ] Display trial end date
- [ ] Return/exchange button visible
- [ ] Terms and conditions accessible

### REQ-TO-F-002: Return Process
**Description:** Initiate and complete vehicle return
**Priority:** High

**Acceptance Criteria:**
- [ ] Return request form
- [ ] Reason selection (optional)
- [ ] Condition disclosure
- [ ] Pickup scheduling
- [ ] Refund estimate display
- [ ] Confirmation email

### REQ-TO-F-003: Exchange Process
**Description:** Exchange for different vehicle
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Browse available vehicles
- [ ] Select replacement vehicle
- [ ] Price difference calculation
- [ ] Exchange confirmation
- [ ] New delivery scheduling

### REQ-TO-F-004: Trial Completion
**Description:** Finalize purchase after trial
**Priority:** High

**Acceptance Criteria:**
- [ ] Auto-completion after 10 days/750km
- [ ] Email notification before expiry
- [ ] Option to complete early
- [ ] Confirmation of final purchase

---

## UI Components

### Trial Period Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│  Your 10-Day Money-Back Guarantee                                │
│  ─────────────────────────────────                               │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │  2021 Honda Civic LX                                       │  │
│  │  Delivered: Dec 28, 2025                                   │  │
│  │                                                            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │   7 Days         │  │   523 km         │               │  │
│  │  │   Remaining      │  │   Remaining      │               │  │
│  │  │   ───────────    │  │   ───────────    │               │  │
│  │  │   ████████░░░    │  │   ██████░░░░░    │               │  │
│  │  │   (of 10 days)   │  │   (of 750 km)    │               │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  │                                                            │  │
│  │  Trial ends: January 7, 2026 at 11:59 PM                  │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Not 100% satisfied?                                             │
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │  🔄 Return Vehicle   │  │  🔀 Exchange Vehicle │            │
│  │                      │  │                      │            │
│  │  Get a full refund   │  │  Swap for a different│            │
│  │  No questions asked  │  │  vehicle             │            │
│  │                      │  │                      │            │
│  │  [Start Return]      │  │  [Browse Vehicles]   │            │
│  └──────────────────────┘  └──────────────────────┘            │
│                                                                   │
│  ✓ Love Your Car? [Complete Purchase Early]                     │
│                                                                   │
│  Terms: Vehicle must be unmodified, accident-free, and          │
│  undamaged. Some fees may apply. [View Full Terms]              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Return Request Form

```
┌─────────────────────────────────────────────────────────────────┐
│  Return Your Vehicle                                             │
│  ─────────────────────                                           │
│                                                                   │
│  We're sorry to see you go! Please help us understand.          │
│                                                                   │
│  Reason for return (optional)                                    │
│  ○ Changed my mind                                               │
│  ○ Vehicle didn't meet expectations                              │
│  ○ Found a better option elsewhere                               │
│  ○ Financial reasons                                             │
│  ○ Other: [________________]                                     │
│                                                                   │
│  Vehicle Condition Confirmation                                  │
│  ☑ Vehicle has not been in any accidents                        │
│  ☑ No modifications have been made                              │
│  ☑ Vehicle is undamaged beyond normal wear                      │
│                                                                   │
│  Current Mileage                                                 │
│  [35,652] km                                                     │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  Refund Estimate                                                 │
│                                                                   │
│  Purchase Amount           $19,942                               │
│  Less: Non-refundable fees -$299                                │
│  ─────────────────────────────────                               │
│  Estimated Refund          $19,643                               │
│                                                                   │
│  ⓘ Final refund calculated after vehicle inspection             │
│                                                                   │
│                              [Schedule Pickup →]                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Pickup Scheduling

```
┌─────────────────────────────────────────────────────────────────┐
│  Schedule Vehicle Pickup                                         │
│  ─────────────────────────                                       │
│                                                                   │
│  We'll pick up your vehicle at no additional cost.              │
│                                                                   │
│  Pickup Address                                                  │
│  [123 Main St, Toronto, ON M5V 2T6 ▼]                           │
│                                                                   │
│  Select Date                                                     │
│  [December 30, 2025 ▼]                                           │
│                                                                   │
│  Select Time                                                     │
│  ○ 9:00 AM - 12:00 PM                                           │
│  ● 12:00 PM - 3:00 PM                                           │
│  ○ 3:00 PM - 6:00 PM                                            │
│                                                                   │
│  What to have ready:                                             │
│  • Vehicle keys (all sets)                                       │
│  • Registration documents                                        │
│  • Remove all personal belongings                                │
│                                                                   │
│                         [Confirm Return →]                       │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface TestOwnershipState {
  trialId: string;
  vehicleId: string;
  orderId: string;

  // Trial status
  startDate: string;
  endDate: string;
  daysRemaining: number;
  startMileage: number;
  currentMileage: number;
  mileageRemaining: number;
  status: TrialStatus;

  // Return
  returnRequest: ReturnRequest | null;
  pickupScheduled: boolean;
  pickupDate: string | null;

  // Exchange
  exchangeVehicleId: string | null;

  // Completion
  isCompleted: boolean;
  completedAt: string | null;
  outcome: 'kept' | 'returned' | 'exchanged' | null;
}

type TrialStatus = 'active' | 'expiring_soon' | 'expired' | 'return_requested' | 'completed';
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `TestOwnershipStarted` | Vehicle delivered | `{ trialId, vehicleId, endDate }` |
| `MileageTracked` | Mileage recorded | `{ trialId, mileage }` |
| `ReturnRequested` | Return initiated | `{ trialId, reason }` |
| `ExchangeRequested` | Exchange initiated | `{ trialId, newVehicleId }` |
| `ReturnConditionVerified` | Inspection passed | `{ trialId }` |
| `RefundApproved` | Refund authorized | `{ trialId, amount }` |
| `RefundProcessed` | Refund completed | `{ trialId, amount }` |
| `VehicleReturned` | Vehicle picked up | `{ trialId, returnMileage }` |
| `VehicleExchanged` | Exchange completed | `{ trialId, newVehicleId }` |
| `VehicleKept` | Trial completed | `{ trialId }` |
| `TestPeriodExpired` | 10 days/750km reached | `{ trialId }` |

---

## Mockup

![Test Ownership Mockup](./mockup-testownership.png)
