# Checkout & Purchase - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Purchase Flow
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

The Checkout & Purchase feature enables customers to complete the vehicle purchase process, including reservation, documentation, payment, and delivery scheduling.

---

## Requirements

### REQ-CP-F-001: Vehicle Reservation
**Description:** Reserve vehicle with refundable deposit
**Priority:** High

**Acceptance Criteria:**
- [ ] $100 refundable deposit to reserve
- [ ] Credit card payment for deposit
- [ ] Reservation confirmation with timer
- [ ] Vehicle marked as reserved immediately
- [ ] Email confirmation sent

### REQ-CP-F-002: Purchase Flow
**Description:** Multi-step checkout process
**Priority:** High

**Acceptance Criteria:**
- [ ] Step 1: Contact Information
- [ ] Step 2: Trade-In (optional)
- [ ] Step 3: Financing or Full Payment
- [ ] Step 4: Insurance Upload
- [ ] Step 5: Delivery/Pickup Selection
- [ ] Step 6: Review & Confirm
- [ ] Progress indicator visible
- [ ] Save progress for later

### REQ-CP-F-003: Payment Processing
**Description:** Handle various payment methods
**Priority:** High

**Acceptance Criteria:**
- [ ] Credit/Debit card
- [ ] Bank transfer/EFT
- [ ] Certified cheque
- [ ] Financing disbursement
- [ ] Trade-in credit applied
- [ ] PCI-compliant payment form

### REQ-CP-F-004: Documentation
**Description:** Digital document signing
**Priority:** High

**Acceptance Criteria:**
- [ ] Purchase agreement generation
- [ ] E-signature integration
- [ ] Document preview before signing
- [ ] Download signed documents
- [ ] Insurance verification

### REQ-CP-F-005: Order Confirmation
**Description:** Confirm purchase and next steps
**Priority:** High

**Acceptance Criteria:**
- [ ] Order confirmation page
- [ ] Order number displayed
- [ ] Next steps clearly outlined
- [ ] Advisor contact information
- [ ] Delivery date confirmation

---

## UI Components

### Checkout Steps

```
┌─────────────────────────────────────────────────────────────────┐
│  Step Progress Bar                                               │
│  ○───────○───────○───────○───────○───────●                      │
│  Info   Trade  Finance  Insure  Deliver  Review                 │
└─────────────────────────────────────────────────────────────────┘
```

### Step 1: Contact Information

```
┌─────────────────────────────────────────────────────────────────┐
│  Contact Information                                             │
│  ─────────────────────                                           │
│                                                                   │
│  First Name *              Last Name *                           │
│  [_________________]       [_________________]                   │
│                                                                   │
│  Email *                   Phone *                               │
│  [_________________]       [_________________]                   │
│                                                                   │
│  Address *                                                       │
│  [_____________________________________________________]        │
│                                                                   │
│  City *                    Province *       Postal Code *        │
│  [______________]          [ON ▼]           [_______]            │
│                                                                   │
│                              [Continue →]                        │
└─────────────────────────────────────────────────────────────────┘
```

### Order Summary Sidebar

```
┌────────────────────────────────┐
│  Order Summary                 │
│  ────────────────              │
│                                │
│  2021 Honda Civic LX           │
│  [Vehicle Image]               │
│                                │
│  Vehicle Price     $24,999     │
│  Trade-In Credit   -$8,000     │
│  ────────────────────────      │
│  Subtotal          $16,999     │
│                                │
│  Admin Fee         $499        │
│  Documentation     $150        │
│  HST (13%)         $2,294      │
│  ────────────────────────      │
│  Total Due         $19,942     │
│                                │
│  Financing: $329/mo            │
│  (60 months @ 6.99% APR)       │
│                                │
│  ✓ 10-Day Money-Back Guarantee │
│  ✓ Free Delivery               │
│  ✓ 210-Point Inspection        │
│                                │
└────────────────────────────────┘
```

### Payment Form

```
┌─────────────────────────────────────────────────────────────────┐
│  Payment Method                                                  │
│  ──────────────                                                  │
│                                                                   │
│  ○ Pay in Full ($19,942)                                        │
│  ● Finance ($329/month)                                         │
│  ○ Bank Transfer                                                 │
│                                                                   │
│  ────────────────────────────────────────────                    │
│                                                                   │
│  Down Payment                                                    │
│                                                                   │
│  Card Number                                                     │
│  [____ ____ ____ ____]                                          │
│                                                                   │
│  Expiry Date        CVV                                          │
│  [MM/YY]            [___]                                        │
│                                                                   │
│  Name on Card                                                    │
│  [_____________________________]                                 │
│                                                                   │
│  🔒 Secured by Stripe                                            │
│                                                                   │
│                              [Complete Purchase →]               │
└─────────────────────────────────────────────────────────────────┘
```

### Order Confirmation

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                         ✓                                        │
│                                                                   │
│          Congratulations! Your order is confirmed.               │
│                                                                   │
│          Order #CLT-2025-12345                                   │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  2021 Honda Civic LX                                             │
│  Total: $19,942 (Financed at $329/month)                         │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│                                                                   │
│  What's Next?                                                    │
│                                                                   │
│  1. ✓ Order placed - Complete                                   │
│  2. ○ Insurance verification - Upload by Dec 25                 │
│  3. ○ Final paperwork - Within 24 hours                         │
│  4. ○ Delivery scheduled - Dec 28, 2025                         │
│                                                                   │
│  Your Advisor:                                                   │
│  Sarah Johnson                                                   │
│  📞 416-555-1234                                                 │
│  📧 sarah@clutchclone.ca                                         │
│                                                                   │
│  [View Order Details]    [Return to Homepage]                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface CheckoutState {
  currentStep: number;
  vehicleId: string;
  reservationId: string | null;

  // Contact
  contactInfo: ContactInfo | null;

  // Trade-In
  hasTradeIn: boolean;
  tradeInValue: number;

  // Financing
  paymentMethod: 'full' | 'finance' | 'bank_transfer';
  financingOption: FinancingOption | null;
  downPayment: number;

  // Insurance
  insuranceUploaded: boolean;
  insuranceDocumentUrl: string | null;

  // Delivery
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress: Address | null;
  deliveryDate: string | null;

  // Order
  orderId: string | null;
  orderStatus: OrderStatus;

  // Pricing
  pricing: OrderPricing;
}

interface OrderPricing {
  vehiclePrice: number;
  tradeInCredit: number;
  adminFee: number;
  documentationFee: number;
  taxRate: number;
  taxAmount: number;
  totalDue: number;
}
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `GetStartedClicked` | Start purchase flow | `{ vehicleId }` |
| `VehicleReservationInitiated` | Reservation started | `{ vehicleId, userId }` |
| `DepositPaid` | $100 deposit paid | `{ reservationId, amount }` |
| `ReservationConfirmed` | Vehicle reserved | `{ reservationId, vehicleId }` |
| `ContactInformationSubmitted` | Contact info saved | `{ userId, email }` |
| `PaymentMethodSelected` | Payment method chosen | `{ method }` |
| `DocumentsSigned` | E-signature complete | `{ documentId }` |
| `InsuranceUploaded` | Insurance uploaded | `{ userId, policyNumber }` |
| `DeliveryScheduled` | Delivery date set | `{ deliveryDate, address }` |
| `PurchaseCompleted` | Order finalized | `{ orderId, totalAmount }` |

---

## Mockup

![Checkout Mockup](./mockup-checkout.png)
