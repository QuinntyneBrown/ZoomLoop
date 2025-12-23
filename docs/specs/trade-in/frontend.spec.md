# Trade-In - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Trade-In
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

The Trade-In feature allows customers to get an instant offer for their current vehicle and apply the value toward their purchase. This includes vehicle evaluation, offer generation, and appraisal scheduling.

---

## Requirements

### REQ-TI-F-001: Instant Offer Form
**Description:** Quick vehicle valuation form
**Priority:** High

**Acceptance Criteria:**
- [ ] Enter license plate OR VIN to start
- [ ] Auto-populate vehicle details from lookup
- [ ] Collect condition information
- [ ] Photo upload for accurate valuation
- [ ] Generate offer within 23 seconds (per Clutch model)
- [ ] Offer valid for 7 days

### REQ-TI-F-002: Condition Assessment
**Description:** Self-assessment of vehicle condition
**Priority:** High

**Acceptance Criteria:**
- [ ] Exterior condition rating (Excellent/Good/Fair/Poor)
- [ ] Interior condition rating
- [ ] Mechanical condition questions
- [ ] Accident history disclosure
- [ ] Modification disclosure
- [ ] Photo upload for each category

### REQ-TI-F-003: Offer Presentation
**Description:** Display and explain the offer
**Priority:** High

**Acceptance Criteria:**
- [ ] Clear offer amount displayed
- [ ] Comparison to typical dealer offers
- [ ] Offer breakdown explanation
- [ ] Accept or decline options
- [ ] Schedule appraisal CTA
- [ ] Share offer via email/link

### REQ-TI-F-004: Appraisal Scheduling
**Description:** Book in-person inspection
**Priority:** Medium

**Acceptance Criteria:**
- [ ] Select appraisal location (home or facility)
- [ ] Calendar date picker
- [ ] Time slot selection
- [ ] Confirmation email
- [ ] Reschedule/cancel options

---

## UI Components

### Step 1: Vehicle Identification

```
┌─────────────────────────────────────────────────────────────────┐
│  Get Your Instant Offer                                          │
│  ─────────────────────────                                       │
│                                                                   │
│  Enter your license plate or VIN to get started                  │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  License Plate         Province                           │  │
│  │  [ABCD 123        ]    [Ontario ▼]                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ─────────── OR ───────────                                      │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  VIN (Vehicle Identification Number)                       │  │
│  │  [1HGCV1F19MA123456                               ]       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│                              [Get My Offer →]                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Vehicle Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│  Is this your vehicle?                                           │
│  ────────────────────────                                        │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [Vehicle Image Placeholder]                               │  │
│  │                                                            │  │
│  │  2021 Honda Civic LX                                       │  │
│  │  Sedan • Automatic • White                                 │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  Current Mileage (km) *                                          │
│  [45000          ]                                               │
│                                                                   │
│  [Yes, This Is My Vehicle]    [No, Edit Details]                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Step 3: Condition Assessment

```
┌─────────────────────────────────────────────────────────────────┐
│  Tell us about your vehicle's condition                          │
│  ─────────────────────────────────────────                       │
│                                                                   │
│  Exterior Condition                                              │
│  ○ Excellent - No visible damage or wear                        │
│  ● Good - Minor scratches or small dents                        │
│  ○ Fair - Moderate scratches, dents, or paint damage            │
│  ○ Poor - Significant damage or rust                            │
│                                                                   │
│  Interior Condition                                              │
│  ○ Excellent - Like new                                         │
│  ● Good - Normal wear, clean                                    │
│  ○ Fair - Visible wear, stains, or odors                        │
│  ○ Poor - Significant damage                                    │
│                                                                   │
│  Has the vehicle been in any accidents?                          │
│  ○ No accidents  ● Minor accident  ○ Major accident             │
│                                                                   │
│  Are there any mechanical issues?                                │
│  ☐ Check engine light on                                        │
│  ☐ Transmission issues                                          │
│  ☐ Engine problems                                              │
│  ☐ Brake issues                                                 │
│  ☑ None of the above                                            │
│                                                                   │
│  Upload photos (optional but increases accuracy)                 │
│  [+] Exterior   [+] Interior   [+] Dashboard                    │
│                                                                   │
│                              [Get My Offer →]                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Offer Display

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    Your Instant Offer                            │
│                                                                   │
│                      $12,500                                     │
│                   (Bold, 48px, Green)                            │
│                                                                   │
│                 Valid until Dec 30, 2025                         │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  2021 Honda Civic LX                                             │
│  45,000 km • Good Condition                                      │
│                                                                   │
│  How we calculated your offer:                                   │
│  • Market value: $14,000                                         │
│  • Condition adjustment: -$1,000                                 │
│  • Mileage adjustment: -$500                                     │
│                                                                   │
│  💡 This is typically $1,500+ more than dealer trade-in         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │          Accept Offer & Schedule Appraisal               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Decline]              [Save Offer for Later]                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface TradeInState {
  // Vehicle identification
  identificationMethod: 'plate' | 'vin' | null;
  licensePlate: string;
  province: string;
  vin: string;

  // Vehicle details
  vehicle: TradeInVehicle | null;
  mileage: number;

  // Condition
  exteriorCondition: ConditionRating;
  interiorCondition: ConditionRating;
  accidentHistory: 'none' | 'minor' | 'major';
  mechanicalIssues: string[];
  photos: UploadedPhoto[];

  // Offer
  offer: TradeInOffer | null;
  offerStatus: 'pending' | 'generated' | 'accepted' | 'declined' | 'expired';

  // Appraisal
  appraisalScheduled: boolean;
  appraisalDate: string | null;
  appraisalLocation: 'home' | 'facility';
}

type ConditionRating = 'excellent' | 'good' | 'fair' | 'poor';

interface TradeInOffer {
  id: string;
  amount: number;
  marketValue: number;
  adjustments: Adjustment[];
  validUntil: string;
  comparisonToDealerTrade: number;
}
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `TradeInRequested` | Form started | `{ userId }` |
| `TradeInDetailsSubmitted` | Vehicle details entered | `{ vin, mileage }` |
| `TradeInOfferGenerated` | Offer calculated | `{ offerId, amount }` |
| `TradeInOfferAccepted` | User accepts offer | `{ offerId }` |
| `TradeInOfferDeclined` | User declines | `{ offerId, reason }` |
| `TradeInAppraisalScheduled` | Appraisal booked | `{ offerId, date, location }` |
| `TradeInInspected` | Appraisal completed | `{ offerId, finalValue }` |
| `TradeInCompleted` | Trade-in finalized | `{ tradeInId, purchaseId }` |

---

## Mockup

![Trade-In Mockup](./mockup-tradein.png)
