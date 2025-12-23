# Trade-In - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Trade-In

---

## Overview

The Trade-In feature enables customers to trade their current vehicle when purchasing a new one, applying the trade-in value as credit toward the purchase.

---

## User Stories

### US-1: Get Trade-In Offer
**As a** car buyer
**I want to** get an offer for my trade-in vehicle
**So that** I can reduce my purchase cost

### US-2: Apply Trade-In Credit
**As a** car buyer
**I want to** apply my trade-in value to my purchase
**So that** I pay less out of pocket

### US-3: Complete Trade-In
**As a** car buyer
**I want to** hand over my trade-in at delivery
**So that** the process is convenient

---

## UI Components

### Trade-In Entry Point

```
Location: Vehicle detail page, purchase flow

┌─────────────────────────────────────┐
│  💱 Have a Trade-In?                │
│  ─────────────────                   │
│  Get an instant offer for your      │
│  current vehicle.                    │
│                                       │
│  [Get Trade-In Offer]                │
└─────────────────────────────────────┘
```

### Trade-In Form

```
Same form as vehicle acquisition:
- VIN entry or manual selection
- Year/Make/Model/Trim
- Mileage
- Condition assessment
- Photo upload (optional)
```

### Trade-In Offer Display

```
┌─────────────────────────────────────┐
│  Your Trade-In Offer                │
│                                       │
│  2018 Toyota Camry SE               │
│  75,000 km • Good Condition          │
│                                       │
│  Trade-In Value: $18,500            │
│                                       │
│  [Apply to Purchase]  [Decline]      │
│                                       │
│  Offer valid for 7 days             │
└─────────────────────────────────────┘
```

### Purchase Summary with Trade-In

```
┌─────────────────────────────────────┐
│  Price Summary                       │
│                                       │
│  2021 Honda Civic LX    $24,999.00  │
│  Fees & Taxes            $3,250.00  │
│  ─────────────────────────────────  │
│  Subtotal               $28,249.00  │
│                                       │
│  Trade-In Credit       -$18,500.00  │
│  (2018 Toyota Camry)                 │
│  ─────────────────────────────────  │
│  Amount Due              $9,749.00  │
│                                       │
│  [Edit Trade-In]  [Remove]           │
└─────────────────────────────────────┘
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/trade-in` | TradeInPage | Standalone trade-in |
| `/trade-in/offer` | TradeInOfferPage | View offer |
| `/purchase/:id/trade-in` | PurchaseTradeInPage | Trade-in during purchase |

---

## API Integration

```
POST /api/v1/trade-ins
  Body: { vehicleDetails, condition }
  Response: { tradeInId, offer }

POST /api/v1/trade-ins/:tradeInId/apply
  Body: { purchaseId }
  Response: { applied, newTotal }

GET /api/v1/trade-ins/:tradeInId
  Response: TradeInDetails
```

---

## Analytics Events

- `trade_in_started`
- `trade_in_offer_received`
- `trade_in_applied`
- `trade_in_declined`
- `trade_in_completed`
