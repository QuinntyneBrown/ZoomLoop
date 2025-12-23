# Test Ownership - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** 10-Day Money-Back Guarantee (Test Ownership)

---

## Overview

The Test Ownership feature allows customers to "test own" their purchased vehicle for 10 days or 750 km, with the option to return or exchange if not satisfied.

---

## User Stories

### US-1: Understand Trial Period
**As a** car buyer
**I want to** understand the trial period terms
**So that** I feel confident in my purchase

**Acceptance Criteria:**
- Clear explanation of 10-day/750km limit
- Return/exchange process explained
- Terms and conditions accessible
- FAQ section available

### US-2: Track Trial Period
**As a** car owner
**I want to** track my remaining trial period
**So that** I know how much time I have to decide

**Acceptance Criteria:**
- Days remaining countdown
- Estimated mileage tracker
- End date clearly displayed
- Notifications before expiry

### US-3: Request Return
**As a** car owner
**I want to** request a return if not satisfied
**So that** I can get my money back

**Acceptance Criteria:**
- Simple return request form
- Reason selection
- Pickup scheduling
- Refund timeline displayed

### US-4: Request Exchange
**As a** car owner
**I want to** exchange for a different vehicle
**So that** I can find the right fit

**Acceptance Criteria:**
- Browse available vehicles
- Apply original payment
- Seamless transition process
- New trial period option

---

## UI Components

### Trial Period Banner

```
Location: Account dashboard, vehicle detail
Style: Highlighted card

┌─────────────────────────────────────────────────────┐
│  🎯 Your 10-Day Trial Period                        │
│  ─────────────────────────                          │
│                                                       │
│  ⏱️ 7 days remaining          🚗 ~320 km driven     │
│  Ends: December 30, 2025                            │
│                                                       │
│  [View Details]  [Request Return]  [Exchange]       │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Trial Progress Card

```
Detailed view:

┌─────────────────────────────────────────────────────┐
│  Trial Period Progress                               │
│                                                       │
│  Time Remaining                                      │
│  ████████████░░░░░░░░░░ 7 of 10 days               │
│  Started: Dec 21 • Ends: Dec 30                     │
│                                                       │
│  Estimated Mileage                                   │
│  ██████░░░░░░░░░░░░░░░░ ~320 of 750 km            │
│  (Self-reported estimate)                           │
│                                                       │
│  ⚠️ Trial ends at whichever limit reached first    │
│                                                       │
│  2021 Honda Civic LX                                │
│  VIN: 1HGBH41JXMN109186                            │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### Trial Terms Modal

```
Size: 600px x 700px

Content:
- Title: "10-Day Money-Back Guarantee"

- Terms Summary:
  • 10 calendar days or 750 km, whichever first
  • Vehicle must be unmodified
  • No accidents or damage
  • Original condition required

- Refund Information:
  • Full refund minus non-refundable fees
  • Processing time: 5-7 business days
  • Original payment method

- Exchange Information:
  • Apply payment to new vehicle
  • Price difference settled
  • New trial period available

- Full terms link
- Close button
```

### Mileage Update Prompt

```
Periodic prompt (Day 3, 5, 7):

┌─────────────────────────────────────────────────────┐
│  📊 Update Your Mileage                             │
│                                                       │
│  Help us track your trial progress.                 │
│  What's your current odometer reading?              │
│                                                       │
│  [_______] km                                        │
│                                                       │
│  Last reading: ~320 km (estimated)                  │
│                                                       │
│  [Update]  [Skip for Now]                           │
└─────────────────────────────────────────────────────┘
```

### Return Request Form

```
Multi-step form:

Step 1: Reason for Return
- Radio options:
  ○ Not the right fit for my needs
  ○ Didn't meet expectations
  ○ Found a better option elsewhere
  ○ Financial circumstances changed
  ○ Other (text input)
- Optional: Additional comments

Step 2: Vehicle Condition
- Confirmation checkboxes:
  ☐ Vehicle has not been in any accidents
  ☐ No modifications have been made
  ☐ Vehicle is in same condition as received
- Photo upload (current condition)

Step 3: Pickup Scheduling
- Calendar picker
- Time window selection
- Address confirmation

Step 4: Review & Confirm
- Return summary
- Refund breakdown
- Processing timeline
- Submit button
```

### Refund Summary Card

```
┌─────────────────────────────────────────────────────┐
│  Estimated Refund                                    │
│                                                       │
│  Vehicle Purchase         $24,999.00                │
│  Documentation Fee          -$499.00                │
│  (Non-refundable)                                    │
│  ─────────────────────────────────                  │
│  Total Refund             $24,500.00                │
│                                                       │
│  Refunded to: •••• 4242                             │
│  Processing: 5-7 business days                      │
│                                                       │
│  ℹ️ Some fees (registration, taxes) may be          │
│     partially refundable based on your location.    │
└─────────────────────────────────────────────────────┘
```

### Exchange Flow

```
Step 1: Browse Vehicles
- Standard vehicle search/browse
- "Apply to Exchange" button on cards
- Filter by similar price range

Step 2: Price Comparison
┌─────────────────────────────────────────────────────┐
│  Exchange Summary                                    │
│                                                       │
│  Returning:                 Getting:                │
│  2021 Honda Civic LX       2021 Toyota Corolla LE   │
│  $24,999                    $25,499                  │
│                                                       │
│  Price Difference: +$500.00                         │
│  (Additional payment required)                       │
│                                                       │
│  [Proceed with Exchange]                            │
└─────────────────────────────────────────────────────┘

Step 3: Schedule Swap
- Single appointment for return + pickup
- Or: Two separate appointments

Step 4: Complete Exchange
- Sign new agreement
- Process payment difference
- Confirm new trial period
```

### Return Status Tracker

```
Timeline view:

○ Return Requested
  └ December 28, 2:30 PM

● Return Approved
  └ December 28, 3:15 PM

◐ Pickup Scheduled (current)
  └ December 30, Morning (9 AM - 12 PM)

○ Vehicle Collected
  └ Pending

○ Refund Processed
  └ Pending (5-7 business days after collection)
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/trial/:purchaseId` | TrialDashboard | Trial period overview |
| `/trial/:purchaseId/terms` | TrialTermsPage | Full terms |
| `/trial/:purchaseId/return` | ReturnRequestPage | Return form |
| `/trial/:purchaseId/exchange` | ExchangePage | Exchange flow |
| `/trial/:purchaseId/status` | ReturnStatusPage | Return tracking |

---

## State Management

```typescript
interface TrialState {
  purchaseId: string;
  vehicle: Vehicle;
  trialPeriod: {
    startDate: Date;
    endDate: Date;
    daysRemaining: number;
    estimatedMileage: number;
    maxMileage: number;
    status: 'active' | 'ended' | 'returned' | 'kept';
  };
  returnRequest: {
    requested: boolean;
    requestId: string | null;
    status: ReturnStatus | null;
    reason: string | null;
    scheduledPickup: Date | null;
  };
  exchangeRequest: {
    requested: boolean;
    targetVehicleId: string | null;
    priceDifference: number;
  };
}

enum ReturnStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  PICKUP_SCHEDULED = 'pickup_scheduled',
  COLLECTED = 'collected',
  REFUND_PROCESSING = 'refund_processing',
  COMPLETED = 'completed'
}
```

---

## API Integration

```
GET /api/v1/trials/:purchaseId
  Response: TrialPeriodDetails

POST /api/v1/trials/:purchaseId/mileage
  Body: { mileage: number }

POST /api/v1/trials/:purchaseId/return
  Body: { reason, condition, photos[], pickupDate }

GET /api/v1/trials/:purchaseId/return-status
  Response: ReturnStatus

POST /api/v1/trials/:purchaseId/exchange
  Body: { targetVehicleId }

POST /api/v1/trials/:purchaseId/keep
  Body: { confirmation: true }
```

---

## Notifications

- Day 1: "Your 10-day trial has started"
- Day 3: "Update your mileage"
- Day 7: "3 days left in your trial"
- Day 9: "1 day left - decide to keep or return"
- Day 10: "Trial period ended - congratulations!"

---

## Accessibility

- Progress bars have aria-valuenow and labels
- Form validation messages announced
- Timeline has role="list" semantics
- Countdown timer not auto-updating (manual refresh)

---

## Analytics Events

- `trial_started`
- `trial_dashboard_viewed`
- `mileage_updated`
- `return_initiated`
- `return_submitted`
- `exchange_initiated`
- `exchange_completed`
- `vehicle_kept`
