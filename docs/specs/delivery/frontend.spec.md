# Delivery - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Delivery & Logistics
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** B

---

## Overview

The Delivery feature enables customers to schedule vehicle delivery or pickup, track delivery status in real-time, and complete the handover process.

---

## Requirements

### REQ-DL-F-001: Delivery Method Selection
**Description:** Choose between delivery and pickup
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Option for home delivery
- [ ] Option for facility pickup
- [ ] Display estimated delivery dates
- [ ] Show delivery cost (free within X km)
- [ ] Address validation for delivery

### REQ-DL-F-002: Delivery Scheduling
**Description:** Schedule delivery date and time
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Calendar view for date selection
- [ ] Available time windows displayed
- [ ] Earliest available date highlighted
- [ ] Reschedule option before dispatch
- [ ] Confirmation email sent

### REQ-DL-F-003: Delivery Tracking
**Description:** Track vehicle delivery in real-time
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Order status timeline
- [ ] Real-time driver location (day of delivery)
- [ ] ETA updates
- [ ] SMS/push notifications
- [ ] Contact driver option

### REQ-DL-F-004: Delivery Completion
**Description:** Complete handover process
**Priority:** High
**Phase:** B

**Acceptance Criteria:**
- [ ] Digital signature for receipt
- [ ] Vehicle condition acknowledgment
- [ ] Document handover checklist
- [ ] Photo capture at delivery
- [ ] 10-day trial period starts

---

## UI Components

### Delivery Method Selection

```
┌─────────────────────────────────────────────────────────────────┐
│  How would you like to receive your vehicle?                     │
│  ────────────────────────────────────────────                    │
│                                                                   │
│  ┌────────────────────────────┐  ┌────────────────────────────┐ │
│  │  ○ Home Delivery           │  │  ○ Pickup at Facility      │ │
│  │                            │  │                            │ │
│  │  🚚 Delivered to your door │  │  📍 Visit our location     │ │
│  │                            │  │                            │ │
│  │  FREE within 400km         │  │  Toronto - 123 Auto Lane   │ │
│  │  Earliest: Dec 28          │  │  Open 9AM - 7PM            │ │
│  │                            │  │  Earliest: Dec 26          │ │
│  │                            │  │                            │ │
│  └────────────────────────────┘  └────────────────────────────┘ │
│                                                                   │
│  Delivery Address                                                │
│  [123 Main St, Toronto, ON M5V 2T6 ▼]                           │
│  [+ Add new address]                                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Delivery Scheduling

```
┌─────────────────────────────────────────────────────────────────┐
│  Select Delivery Date                                            │
│  ─────────────────────                                           │
│                                                                   │
│       December 2025                                              │
│  Su   Mo   Tu   We   Th   Fr   Sa                               │
│  22   23   24   25   26   27   [28]                             │
│  29   30   31    1    2    3    4                               │
│                                                                   │
│  ● Dec 28 (Earliest Available)                                  │
│                                                                   │
│  Select Time Window                                              │
│  ○ 9:00 AM - 12:00 PM                                           │
│  ● 12:00 PM - 3:00 PM                                           │
│  ○ 3:00 PM - 6:00 PM                                            │
│                                                                   │
│  Special Instructions (optional)                                 │
│  [Gate code: 1234, ring doorbell               ]                │
│                                                                   │
│                         [Confirm Delivery →]                     │
└─────────────────────────────────────────────────────────────────┘
```

### Delivery Tracking

```
┌─────────────────────────────────────────────────────────────────┐
│  Track Your Delivery                                             │
│  ─────────────────────                                           │
│                                                                   │
│  Order #CLT-2025-12345                                           │
│  2021 Honda Civic LX                                             │
│                                                                   │
│  Estimated Arrival: Today, 1:30 PM - 2:30 PM                    │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                     [MAP VIEW]                           │   │
│  │                                                          │   │
│  │            🚚 ────────────────> 🏠                       │   │
│  │                                                          │   │
│  │     Driver: Mike T.           15 mins away               │   │
│  │                                                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
│  Delivery Timeline                                               │
│  ─────────────────                                               │
│                                                                   │
│  ✓ Order Placed              Dec 23, 11:00 AM                   │
│  ✓ Documents Signed          Dec 23, 12:00 PM                   │
│  ✓ Insurance Verified        Dec 23, 2:00 PM                    │
│  ✓ Vehicle Prepared          Dec 27, 4:00 PM                    │
│  ✓ Out for Delivery          Dec 28, 10:30 AM                   │
│  ○ Delivered                 Expected 1:30 PM                   │
│                                                                   │
│  [Contact Driver]    [Get Directions]                           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface DeliveryState {
  method: 'delivery' | 'pickup';
  address: Address | null;
  facilityId: string | null;
  scheduledDate: string | null;
  timeWindow: TimeWindow | null;
  specialInstructions: string;

  // Tracking
  trackingStatus: DeliveryStatus;
  driverLocation: GeoLocation | null;
  estimatedArrival: string | null;
  timeline: TimelineEvent[];

  // Completion
  isCompleted: boolean;
  completedAt: string | null;
  signatureUrl: string | null;
}

type DeliveryStatus =
  | 'scheduled'
  | 'preparing'
  | 'in_transit'
  | 'arriving'
  | 'delivered';
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `DeliveryMethodSelected` | Method chosen | `{ method, address }` |
| `DeliveryScheduled` | Date confirmed | `{ date, timeWindow }` |
| `DeliveryDateConfirmed` | Final confirmation | `{ deliveryId }` |
| `VehiclePreparedForDelivery` | Vehicle ready | `{ vehicleId }` |
| `DeliveryAssigned` | Driver assigned | `{ driverId }` |
| `VehicleInTransit` | Departed facility | `{ estimatedArrival }` |
| `DeliveryCompleted` | Vehicle delivered | `{ deliveryId, signedAt }` |
| `VehicleHandedOver` | Keys transferred | `{ mileage }` |

---

## Mockup

![Delivery Mockup](./mockup-delivery.png)
