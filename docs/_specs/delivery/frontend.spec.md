# Delivery - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Delivery & Logistics

---

## Overview

The Delivery feature enables customers to schedule vehicle delivery or pickup, track delivery status, and confirm receipt of their purchased vehicle.

---

## User Stories

### US-1: Choose Delivery Method
**As a** car buyer
**I want to** choose between home delivery or pickup
**So that** I can receive my vehicle conveniently

**Acceptance Criteria:**
- Clear options for delivery vs pickup
- Delivery fee (if any) clearly displayed
- Available pickup locations shown on map
- Delivery time estimate provided

### US-2: Schedule Delivery
**As a** car buyer
**I want to** select a delivery date and time
**So that** I know when to expect my vehicle

**Acceptance Criteria:**
- Calendar shows available dates
- Time windows displayed (morning/afternoon/evening)
- Address verification for delivery
- Reschedule option available

### US-3: Track Delivery
**As a** car buyer
**I want to** track my vehicle delivery in real-time
**So that** I know exactly when it will arrive

**Acceptance Criteria:**
- Live GPS tracking on delivery day
- Driver contact information
- ETA updates
- SMS/push notifications

### US-4: Confirm Receipt
**As a** car buyer
**I want to** confirm vehicle receipt
**So that** my purchase is complete

**Acceptance Criteria:**
- Digital signature for handover
- Photo documentation
- Condition acknowledgment
- Keys and documents received

---

## UI Components

### Delivery Method Selection

```
Layout: Two-column card selection

Delivery Card:
┌─────────────────────────────────────┐
│  🚚 Home Delivery                   │
│  ─────────────────                   │
│  We deliver to your door            │
│                                       │
│  • Free delivery within 50km        │
│  • $X.XX per additional km          │
│  • Available dates shown below      │
│                                       │
│  [Select Delivery]                   │
└─────────────────────────────────────┘

Pickup Card:
┌─────────────────────────────────────┐
│  📍 Pickup at Location              │
│  ─────────────────                   │
│  Pick up at our service center      │
│                                       │
│  • No additional cost               │
│  • 3 locations available            │
│  • Flexible scheduling              │
│                                       │
│  [Select Pickup]                     │
└─────────────────────────────────────┘
```

### Address Entry Form

```
Card Layout:
- Title: "Delivery Address"
- Autocomplete address input
- Unit/Apt number field
- Special instructions textarea
- Map preview of location
- "Confirm Address" button

Validation:
- Address verification via API
- Delivery zone confirmation
- Access instructions prompt
```

### Pickup Location Selector

```
Layout: Map + List view

Left Panel (Map):
- Interactive map
- Markers for each location
- Current location button
- Zoom controls

Right Panel (List):
- Location cards with:
  - Name
  - Address
  - Distance from user
  - Hours of operation
  - Select button
- Sort by distance
```

### Calendar Picker

```
Layout: Month view calendar

Features:
- Available dates highlighted in blue
- Unavailable dates grayed out
- Today indicator
- Selected date highlighted
- Previous/Next month navigation
- Next 14 days shown

Availability Legend:
- Available: Blue fill
- Limited: Yellow fill
- Unavailable: Gray, disabled
```

### Time Window Selector

```
Layout: Time slot buttons

Options:
- Morning (9 AM - 12 PM)
- Afternoon (12 PM - 4 PM)
- Evening (4 PM - 7 PM)

Each option shows:
- Time range
- Availability status
- Selection radio
```

### Delivery Confirmation Card

```
┌─────────────────────────────────────┐
│  ✓ Delivery Scheduled               │
│  ─────────────────                   │
│                                       │
│  Date: Saturday, December 28, 2025  │
│  Time: Morning (9 AM - 12 PM)       │
│                                       │
│  Delivery Address:                   │
│  123 Main Street, Unit 4B           │
│  Toronto, ON M5V 2K1                │
│                                       │
│  Your Driver:                        │
│  Will be assigned 24 hours before   │
│                                       │
│  [Add to Calendar]  [Reschedule]    │
│                                       │
└─────────────────────────────────────┘
```

### Delivery Tracking Page

```
Layout: Full-page tracking view

Top Section:
- Vehicle info summary
- ETA countdown/estimate
- Driver photo and name
- "Contact Driver" button

Map Section (60% of viewport):
- Full-screen map
- Vehicle marker (animated)
- Delivery location marker
- Route line
- Real-time position updates

Bottom Sheet (Mobile):
- Swipe up for more details
- Delivery steps timeline
- Driver info
- Contact options
```

### Tracking Timeline

```
Vertical timeline:

● Vehicle Prepared
  └ December 27, 2:30 PM

● In Transit
  └ December 28, 8:15 AM - Departed facility

◐ Arriving Soon (current)
  └ ETA: 10:30 AM - 15 minutes away

○ Delivered
  └ Pending
```

### Driver Info Card

```
┌─────────────────────────────────────┐
│  👤 John Smith                       │
│  Your Delivery Specialist            │
│                                       │
│  📞 (416) 555-0123                  │
│  [Call]  [Text]                      │
│                                       │
│  Vehicle: White Ford Transit Van    │
│  License: ABCD 123                   │
└─────────────────────────────────────┘
```

### Handover Confirmation

```
Multi-step confirmation:

Step 1: Vehicle Condition
- Photo of vehicle at delivery
- "Vehicle matches expectations" checkbox
- Note any issues field

Step 2: Documents Received
- Checklist:
  ☑ Vehicle Registration
  ☑ Insurance Card
  ☑ Owner's Manual
  ☑ Spare Keys

Step 3: Keys Received
- "I have received all keys" checkbox
- Key count confirmation

Step 4: Signature
- Signature pad
- "Sign to Confirm Receipt"

Step 5: Confirmation
- Success message
- Download receipt button
- Start trial period notification
```

---

## Page Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/delivery/:purchaseId/method` | DeliveryMethodPage | Choose delivery/pickup |
| `/delivery/:purchaseId/schedule` | SchedulePage | Date/time selection |
| `/delivery/:purchaseId/confirmation` | ConfirmationPage | Booking confirmed |
| `/delivery/:purchaseId/track` | TrackingPage | Live tracking |
| `/delivery/:deliveryId/handover` | HandoverPage | Confirm receipt |
| `/my/deliveries` | DeliveriesListPage | All deliveries |

---

## State Management

### Delivery State

```typescript
interface DeliveryState {
  purchaseId: string;
  method: 'delivery' | 'pickup' | null;
  deliveryAddress: Address | null;
  pickupLocation: Location | null;
  scheduledDate: Date | null;
  timeWindow: TimeWindow | null;
  status: DeliveryStatus;
  tracking: {
    isLive: boolean;
    driverLocation: GeoPoint | null;
    eta: Date | null;
    lastUpdated: Date | null;
  };
  driver: DriverInfo | null;
  handover: {
    completed: boolean;
    signature: string | null;
    photos: string[];
    confirmedAt: Date | null;
  };
}

enum DeliveryStatus {
  PENDING_SCHEDULE = 'pending_schedule',
  SCHEDULED = 'scheduled',
  PREPARING = 'preparing',
  IN_TRANSIT = 'in_transit',
  ARRIVING = 'arriving',
  DELIVERED = 'delivered'
}

type TimeWindow = 'morning' | 'afternoon' | 'evening';
```

---

## API Integration

### Scheduling

```
GET /api/v1/deliveries/:purchaseId/availability
  Query: { method, postalCode, startDate, endDate }
  Response: { dates: AvailableDate[] }

POST /api/v1/deliveries/:purchaseId/schedule
  Body: { method, address/locationId, date, timeWindow }
  Response: { deliveryId, confirmationNumber, scheduledAt }

PUT /api/v1/deliveries/:deliveryId/reschedule
  Body: { date, timeWindow }
  Response: { updated, newSchedule }
```

### Tracking

```
GET /api/v1/deliveries/:deliveryId/status
  Response: { status, eta, driver, lastUpdate }

GET /api/v1/deliveries/:deliveryId/tracking
  Response: { driverLocation, route, eta }
  (WebSocket available for real-time)

WS /api/v1/deliveries/:deliveryId/live
  Messages: { type: 'location_update', data: { lat, lng, eta } }
```

### Handover

```
POST /api/v1/deliveries/:deliveryId/handover
  Body: { signature, photos[], documentsReceived, keysReceived }
  Response: { confirmed, trialPeriodStart }
```

---

## Real-time Features

### WebSocket Connection

```typescript
// Connect to delivery tracking
const ws = new WebSocket(`wss://api.example.com/deliveries/${deliveryId}/live`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  switch (data.type) {
    case 'location_update':
      updateDriverMarker(data.lat, data.lng);
      updateETA(data.eta);
      break;
    case 'status_change':
      updateStatus(data.status);
      break;
    case 'arriving':
      showArrivingNotification();
      break;
  }
};
```

### Push Notifications

- "Your vehicle is being prepared for delivery"
- "Your vehicle is on the way! Driver: John"
- "Your vehicle is 15 minutes away"
- "Your vehicle has arrived"

---

## Responsive Design

### Desktop (1440px+)
- Side-by-side map and scheduling
- Full calendar view
- Split-screen tracking with timeline

### Tablet (768px - 1439px)
- Stacked layout with map above
- Scrollable time slots
- Full-width tracking map

### Mobile (< 768px)
- Bottom sheet for scheduling
- Full-screen tracking map
- Swipe-up details panel
- Sticky "Contact Driver" button

---

## Accessibility

- Map has keyboard-navigable location list alternative
- Calendar dates announced with availability status
- Live tracking has text-based status updates
- Signature pad has typed name alternative
- Progress announcements via ARIA live regions

---

## Analytics Events

- `delivery_method_selected`
- `delivery_scheduled`
- `delivery_rescheduled`
- `tracking_viewed`
- `driver_contacted`
- `handover_started`
- `handover_completed`
