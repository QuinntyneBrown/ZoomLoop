# Purchase - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Purchase Process

---

## Overview

The Purchase feature enables customers to buy vehicles from the platform, including reservation, financing, documentation, and payment processing.

---

## User Stories

### US-1: Reserve Vehicle
**As a** car buyer
**I want to** reserve a vehicle with a deposit
**So that** I can secure my choice while completing the purchase

**Acceptance Criteria:**
- $100 refundable deposit clearly displayed
- Reservation period (7 days) explained
- Credit card or debit payment accepted
- Confirmation email sent immediately
- Vehicle marked as reserved in listings

### US-2: Apply for Financing
**As a** car buyer
**I want to** apply for vehicle financing
**So that** I can afford the purchase with monthly payments

**Acceptance Criteria:**
- Quick pre-qualification form
- Multiple loan options presented
- Monthly payment calculator
- Clear terms and conditions
- Instant decision display

### US-3: Complete Documentation
**As a** car buyer
**I want to** complete purchase paperwork online
**So that** I don't have to visit a dealership

**Acceptance Criteria:**
- E-signature support
- Document preview before signing
- Progress tracker for documentation
- Insurance upload capability
- Document download after completion

### US-4: Make Payment
**As a** car buyer
**I want to** pay for my vehicle securely
**So that** I can complete my purchase

**Acceptance Criteria:**
- Multiple payment methods supported
- Payment breakdown displayed
- Secure payment processing
- Receipt and confirmation provided

---

## UI Components

### Get Started Button

```
Location: Vehicle detail page, sidebar
Style: Primary button (full-width)
Text: "Get Started - $100 Deposit"
Height: 56px
Font: 18px Bold #FFFFFF
Background: #0066FF
```

### Reservation Modal

```
Size: 560px x 640px
Background: #FFFFFF
Border-radius: 16px
Padding: 32px

Content:
1. Vehicle Summary Card
   - Thumbnail image
   - Title, year, mileage
   - Price

2. Deposit Information
   - Amount: $100
   - "Fully refundable within reservation period"
   - Reservation period: 7 days

3. Contact Form
   - Full Name
   - Email
   - Phone
   - Preferred contact method

4. Payment Section
   - Card number input
   - Expiry / CVC
   - Billing address

5. Terms checkbox
   - Link to terms and conditions

6. Submit Button
   - "Complete Reservation"
   - Loading state during processing
```

### Reservation Confirmation Page

```
Layout: Centered content, max-width 600px

Content:
- Success icon (animated checkmark)
- "You've Reserved Your Vehicle!"
- Confirmation number
- Vehicle summary
- Next steps timeline:
  1. "An advisor will contact you within 24 hours"
  2. "Complete financing (if applicable)"
  3. "Sign purchase documents"
  4. "Schedule delivery"
- Advisor contact info (after assignment)
- "View My Reservations" button
```

### Financing Widget

```
Location: Vehicle detail sidebar
Background: #F5F7FA
Border-radius: 12px
Padding: 24px

Content:
- "Finance This Vehicle"
- Monthly payment estimate (prominent)
- Based on: term, rate, down payment
- Adjustable sliders:
  - Down payment ($0 - 50%)
  - Term (24, 36, 48, 60, 72 months)
- "Get Pre-Approved" button
- "Rates from X.XX% APR" disclaimer
```

### Financing Application Form

```
Multi-step form with progress indicator

Step 1: Personal Information
- Full legal name
- Date of birth
- Social Insurance Number (masked)
- Address (autocomplete)
- Time at address
- Housing status (own/rent)

Step 2: Employment Information
- Employment status
- Employer name
- Job title
- Time at employer
- Annual income
- Additional income (optional)

Step 3: Verification
- ID upload (driver's license)
- Consent checkboxes
- Submit button
```

### Financing Results Page

```
Layout: Card-based options

Header:
- "Congratulations, you're pre-approved!"
- Or: "Let's explore your options"

Option Cards (2-4 options):
┌─────────────────────────────────────┐
│  Recommended                         │
│  ─────────────────                   │
│  $XXX/month                          │
│  X.XX% APR                           │
│  XX months                           │
│  $X,XXX down payment                │
│  Total: $XX,XXX                      │
│                                       │
│  [Select This Option]                │
└─────────────────────────────────────┘

Comparison table below cards:
- Monthly payment
- APR
- Term
- Total interest
- Total cost
```

### Document Signing Page

```
Layout: Split view

Left Panel (60%):
- Document viewer
- PDF preview
- Page navigation
- Zoom controls

Right Panel (40%):
- Document list with status
- Current document name
- Signature boxes (highlighted)
- Initial boxes
- Date fields
- Progress indicator

Bottom Bar:
- "Previous" / "Next" buttons
- "Sign & Continue" button
- "Save & Exit" link
```

### Insurance Upload Section

```
Card Layout:
- Title: "Vehicle Insurance"
- Instructions text
- Upload zone (drag-and-drop)
- Required fields:
  - Insurance provider
  - Policy number
  - Effective date
  - Expiration date
- Status: Pending/Verified
- "Upload Insurance" button
```

### Payment Summary Page

```
Layout: Two-column

Left: Payment Breakdown
┌─────────────────────────────────────┐
│  Vehicle Price         $24,999.00   │
│  Documentation Fee        $499.00   │
│  Registration            $120.00   │
│  ───────────────────────────────    │
│  Subtotal              $25,618.00   │
│  Trade-in Credit       -$8,000.00   │
│  Deposit Applied         -$100.00   │
│  ───────────────────────────────    │
│  Amount Due            $17,518.00   │
│                                       │
│  OR                                   │
│                                       │
│  Financed Amount       $12,518.00   │
│  Down Payment           $5,000.00   │
│  ───────────────────────────────    │
│  Due Today             $5,100.00    │
│  (includes deposit)                  │
└─────────────────────────────────────┘

Right: Payment Method
- Saved payment methods
- Add new card
- Bank transfer option
- Financing details (if applicable)

Bottom:
- Terms acceptance checkbox
- "Complete Purchase" button
```

### Purchase Progress Tracker

```
Steps:
1. Reserve Vehicle ✓
2. Apply for Financing (if applicable)
3. Complete Documentation
4. Upload Insurance
5. Make Payment
6. Schedule Delivery

Stepper:
- Completed: Green circle with checkmark
- Current: Blue filled circle
- Upcoming: Gray outlined circle
- Connector lines between steps
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/purchase/:vehicleId/reserve` | ReservationPage | Deposit and reservation |
| `/purchase/:reservationId/financing` | FinancingPage | Loan application |
| `/purchase/:reservationId/documents` | DocumentsPage | Paperwork signing |
| `/purchase/:reservationId/insurance` | InsurancePage | Insurance upload |
| `/purchase/:reservationId/payment` | PaymentPage | Final payment |
| `/purchase/:reservationId/confirmation` | ConfirmationPage | Purchase complete |
| `/my/purchases` | PurchasesListPage | User's purchases |
| `/my/purchases/:purchaseId` | PurchaseDetailPage | Single purchase |

---

## State Management

### Purchase State

```typescript
interface PurchaseState {
  reservationId: string | null;
  vehicleId: string;
  vehicle: Vehicle | null;
  step: PurchaseStep;
  deposit: {
    paid: boolean;
    amount: number;
    paidAt: Date | null;
  };
  financing: {
    applied: boolean;
    approved: boolean;
    selectedOption: FinancingOption | null;
    options: FinancingOption[];
  };
  documents: {
    required: Document[];
    signed: Document[];
    pending: Document[];
  };
  insurance: {
    uploaded: boolean;
    verified: boolean;
    details: InsuranceDetails | null;
  };
  payment: {
    breakdown: PaymentBreakdown;
    method: PaymentMethod | null;
    completed: boolean;
  };
  advisor: AdvisorInfo | null;
}

enum PurchaseStep {
  RESERVATION = 'reservation',
  FINANCING = 'financing',
  DOCUMENTS = 'documents',
  INSURANCE = 'insurance',
  PAYMENT = 'payment',
  COMPLETE = 'complete'
}
```

---

## API Integration

### Reservation

```
POST /api/v1/reservations
  Body: { vehicleId, contactInfo, paymentMethod }
  Response: { reservationId, confirmationNumber, expiresAt }

GET /api/v1/reservations/:reservationId
  Response: ReservationDetails
```

### Financing

```
POST /api/v1/financing/prequalify
  Body: { reservationId, income, creditEstimate }
  Response: { prequalified, estimatedRate, estimatedPayment }

POST /api/v1/financing/apply
  Body: { reservationId, personalInfo, employmentInfo }
  Response: { applicationId, status }

GET /api/v1/financing/:applicationId/options
  Response: { options: FinancingOption[] }

POST /api/v1/financing/:applicationId/select
  Body: { optionId }
  Response: { selected, nextStep }
```

### Documents

```
GET /api/v1/purchases/:purchaseId/documents
  Response: { documents: Document[] }

GET /api/v1/documents/:documentId
  Response: Document with PDF URL

POST /api/v1/documents/:documentId/sign
  Body: { signatures: SignatureData[] }
  Response: { signed, nextDocument }
```

### Insurance

```
POST /api/v1/purchases/:purchaseId/insurance
  Body: FormData (policy document, details)
  Response: { uploaded, verificationStatus }

GET /api/v1/purchases/:purchaseId/insurance
  Response: InsuranceDetails
```

### Payment

```
GET /api/v1/purchases/:purchaseId/payment-summary
  Response: PaymentBreakdown

POST /api/v1/purchases/:purchaseId/pay
  Body: { paymentMethodId, amount }
  Response: { transactionId, status }
```

---

## Responsive Design

### Desktop (1440px+)
- Split-view for document signing
- Side-by-side financing comparison
- Full progress tracker visible

### Tablet (768px - 1439px)
- Stacked document view
- Scrollable financing options
- Horizontal progress tracker

### Mobile (< 768px)
- Full-screen document viewer
- Card carousel for financing
- Vertical progress accordion
- Sticky bottom CTA bar

---

## Accessibility

- Form validation messages linked to inputs
- Document viewer keyboard navigable
- Signature pad alternatives (typed signature)
- Progress announced by screen readers
- Focus management between steps
- Payment form autocomplete enabled

---

## Security

- PCI-compliant payment forms
- SSN masked in input and display
- ID uploads encrypted
- Session timeout warnings
- Document access logging

---

## Analytics Events

- `reservation_started`
- `reservation_completed`
- `financing_prequalify_started`
- `financing_application_submitted`
- `financing_option_selected`
- `document_signed`
- `insurance_uploaded`
- `payment_initiated`
- `purchase_completed`
