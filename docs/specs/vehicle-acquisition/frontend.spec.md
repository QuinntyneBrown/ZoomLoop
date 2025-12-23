# Vehicle Acquisition - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Acquisition (Sell Your Car)

---

## Overview

The Vehicle Acquisition feature enables customers to sell their vehicles to the platform. This includes the instant offer flow, vehicle appraisal scheduling, and final purchase completion.

---

## User Stories

### US-1: Get Instant Offer
**As a** vehicle seller
**I want to** receive an instant offer for my car
**So that** I can quickly understand its value

**Acceptance Criteria:**
- User can initiate offer request from homepage or dedicated sell page
- VIN or Year/Make/Model entry supported
- Mileage and condition questions presented
- Photo upload capability (optional but recommended)
- AI-generated offer displayed within seconds
- Offer valid for 7 days with countdown timer

### US-2: Accept Offer
**As a** vehicle seller
**I want to** accept the offer and schedule an appraisal
**So that** I can complete the sale

**Acceptance Criteria:**
- Clear CTA to accept offer
- Calendar integration for appraisal scheduling
- Location selection (customer address or service center)
- Confirmation email/SMS sent

### US-3: Track Sale Progress
**As a** vehicle seller
**I want to** track my sale progress
**So that** I know what to expect next

**Acceptance Criteria:**
- Progress stepper showing current status
- Estimated timeline for each step
- Notification preferences for updates

---

## UI Components

### Sell Landing Page

```
Layout: Full-width hero with form
Height: 600px (desktop), auto (mobile)
Background: Gradient overlay on car image
```

**Components:**
1. Hero Section
   - Headline: "Get a Firm Offer in Seconds"
   - Subheadline: "No haggling. Get paid instantly."
   - Font: H1 48px Bold #FFFFFF

2. Offer Form Widget
   - Width: 600px centered
   - Background: #FFFFFF
   - Border-radius: 12px
   - Padding: 32px
   - Shadow: Level 3

### VIN Entry Form

```
Form Fields:
- VIN Input (17 characters)
  - Width: 100%
  - Height: 48px
  - Monospace font for VIN
  - Auto-formatting with validation

- OR Divider with "Don't have VIN?" link

- Manual Entry Fields (if no VIN):
  - Year Dropdown (2000-2025)
  - Make Dropdown (populated dynamically)
  - Model Dropdown (dependent on Make)
  - Trim Dropdown (dependent on Model)
```

### Mileage & Condition Form

```
Mileage Input:
- Numeric input with comma formatting
- Helper text: "Enter current odometer reading"

Condition Assessment:
- Radio button group with icons
- Options: Excellent, Good, Fair, Poor
- Each option has tooltip with description

Photo Upload:
- Drag-and-drop zone
- Grid of uploaded photos (max 20)
- Required angles: Front, Back, Interior, Dashboard
- File types: JPG, PNG, HEIC
- Max file size: 10MB each
```

### Offer Display Card

```
Layout: Centered card
Width: 500px
Background: #FFFFFF
Border: 2px solid #00C853
Border-radius: 16px
Padding: 48px

Content:
- Success icon (animated checkmark)
- "Your Offer" label (14px #8B95A5)
- Offer Amount (48px Bold #0066FF)
- "Valid for 7 days" with countdown
- Vehicle summary (Make/Model/Year)

Actions:
- Primary: "Accept Offer" button
- Secondary: "Decline" link
- Tertiary: "Get a second opinion" link
```

### Appraisal Scheduling Modal

```
Modal Size: 640px x 600px
Background: #FFFFFF
Border-radius: 12px

Content:
- Calendar picker (next 14 days)
- Time slot selection (30-min intervals)
- Location type toggle (Home/Service Center)
- Address input (if home selected)
- Confirmation summary
```

### Progress Tracker

```
Layout: Horizontal stepper
Steps:
1. Offer Received (green checkmark if complete)
2. Appraisal Scheduled
3. Inspection Complete
4. Payment Processed
5. Vehicle Collected

Active step: Blue circle with step number
Completed step: Green circle with checkmark
Pending step: Gray circle with step number
Connecting lines: Solid if complete, dashed if pending
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/sell` | SellLandingPage | Entry point for selling |
| `/sell/details` | VehicleDetailsForm | VIN/vehicle info entry |
| `/sell/condition` | ConditionAssessment | Mileage and condition |
| `/sell/photos` | PhotoUpload | Vehicle photo upload |
| `/sell/offer/:offerId` | OfferDisplay | Show generated offer |
| `/sell/schedule/:offerId` | AppraisalSchedule | Book appraisal |
| `/sell/confirmation/:offerId` | ConfirmationPage | Booking confirmed |
| `/sell/track/:offerId` | TrackProgress | Sale progress |

---

## State Management

### Offer State

```typescript
interface OfferState {
  offerId: string | null;
  vehicleDetails: VehicleDetails | null;
  condition: ConditionAssessment | null;
  photos: UploadedPhoto[];
  offer: {
    amount: number;
    validUntil: Date;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
  } | null;
  appraisal: {
    scheduledDate: Date;
    location: Address;
    inspectorId: string;
  } | null;
  currentStep: number;
}
```

### Actions

- `REQUEST_OFFER` - Initiate offer generation
- `SUBMIT_VEHICLE_DETAILS` - Save vehicle info
- `UPLOAD_PHOTO` - Add photo to submission
- `GENERATE_OFFER` - Trigger AI valuation
- `ACCEPT_OFFER` - Customer accepts
- `REJECT_OFFER` - Customer declines
- `SCHEDULE_APPRAISAL` - Book inspection
- `UPDATE_PROGRESS` - Track status changes

---

## API Integration

### Endpoints

```
POST /api/v1/offers/request
  Request: { userId }
  Response: { requestId, timestamp }

POST /api/v1/offers/vehicle-details
  Request: { vin, make, model, year, mileage, condition }
  Response: { vehicleId, validationStatus }

POST /api/v1/offers/photos
  Request: FormData with photos
  Response: { photoUrls[], uploadStatus }

POST /api/v1/offers/generate
  Request: { vehicleId, condition, photos[] }
  Response: { offerId, amount, validUntil }

POST /api/v1/offers/:offerId/accept
  Request: { customerId }
  Response: { acceptedAt, nextSteps }

POST /api/v1/appraisals/schedule
  Request: { offerId, date, timeSlot, location }
  Response: { appointmentId, confirmationNumber }
```

---

## Responsive Design

### Desktop (1440px+)
- Centered form layout, max-width 600px
- Side-by-side photo upload grid (4 columns)
- Full progress tracker visible

### Tablet (768px - 1439px)
- Form width 90% of container
- Photo grid 3 columns
- Progress tracker horizontal

### Mobile (< 768px)
- Full-width form with 16px padding
- Photo grid 2 columns
- Progress tracker vertical/accordion

---

## Accessibility

- All form inputs have associated labels
- Error messages linked to inputs via aria-describedby
- Photo upload supports keyboard navigation
- Progress tracker uses aria-current for active step
- VIN input announces validation status
- Offer amount announced by screen readers

---

## Performance

- Lazy load photo upload component
- Compress photos client-side before upload
- Cache vehicle make/model data
- Prefetch next form step
- Show skeleton loaders during API calls

---

## Error Handling

| Error | User Message | Action |
|-------|--------------|--------|
| Invalid VIN | "Please enter a valid 17-character VIN" | Highlight field, show format hint |
| VIN not found | "We couldn't find this vehicle. Try manual entry." | Show manual entry option |
| Photo upload failed | "Upload failed. Please try again." | Retry button with exponential backoff |
| Offer generation failed | "We're having trouble. Please try again in a moment." | Retry with countdown |
| Network error | "Connection lost. Your progress has been saved." | Auto-retry when online |

---

## Analytics Events

- `sell_page_viewed`
- `vin_entered`
- `manual_entry_selected`
- `condition_selected`
- `photos_uploaded`
- `offer_generated`
- `offer_accepted`
- `offer_rejected`
- `appraisal_scheduled`
- `progress_checked`
