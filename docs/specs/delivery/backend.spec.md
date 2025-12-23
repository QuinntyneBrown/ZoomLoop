# Delivery - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Delivery & Logistics

---

## Overview

The Delivery backend manages vehicle delivery scheduling, driver assignment, real-time tracking, and handover confirmation.

---

## Domain Events

### Scheduling

| Event | Description | Payload |
|-------|-------------|---------|
| `DeliveryMethodSelected` | Method chosen | `{ transactionId, method, selectedAt }` |
| `DeliveryScheduled` | Date/time set | `{ deliveryId, scheduledDate, timeWindow, address }` |
| `DeliveryDateConfirmed` | Confirmed | `{ deliveryId, confirmedDate, confirmedAt }` |
| `DeliveryAddressVerified` | Location validated | `{ deliveryId, address, verifiedAt }` |

### Fulfillment

| Event | Description | Payload |
|-------|-------------|---------|
| `VehiclePreparedForDelivery` | Prep complete | `{ vehicleId, preparedAt, preparedBy }` |
| `DeliveryAssigned` | Driver assigned | `{ deliveryId, driverId, assignedAt }` |
| `VehicleInTransit` | En route | `{ deliveryId, vehicleId, departedAt, eta }` |
| `DeliveryCompleted` | Delivered | `{ deliveryId, deliveredAt, signature }` |
| `VehicleHandedOver` | Keys transferred | `{ deliveryId, vehicleId, handoverAt, mileage }` |
| `CustomerPickupCompleted` | Pickup done | `{ pickupId, pickedUpAt, locationId }` |

### Post-Delivery

| Event | Description | Payload |
|-------|-------------|---------|
| `TransportationArranged` | Seller transport | `{ transportId, customerId, arrangedAt }` |
| `DeliveryFeedbackRequested` | Feedback asked | `{ deliveryId, requestedAt }` |
| `DeliveryConfirmed` | Verified | `{ deliveryId, confirmedAt }` |

---

## API Endpoints

### Delivery Options

```
GET /api/v1/deliveries/:purchaseId/options
  Description: Get delivery/pickup options
  Auth: Required
  Response: 200 OK
    {
      "delivery": {
        "available": boolean,
        "fee": number,
        "freeWithinKm": number,
        "perKmFee": number,
        "estimatedDeliveryWindow": {
          "earliestDate": "ISO-8601",
          "latestDate": "ISO-8601"
        }
      },
      "pickup": {
        "available": boolean,
        "locations": [
          {
            "id": "uuid",
            "name": "string",
            "address": {
              "street": "string",
              "city": "string",
              "province": "string",
              "postalCode": "string",
              "lat": number,
              "lng": number
            },
            "hours": {
              "monday": "9:00 AM - 6:00 PM",
              ...
            },
            "distance": number
          }
        ]
      }
    }

GET /api/v1/deliveries/:purchaseId/availability
  Description: Get available dates and times
  Auth: Required
  Query Parameters:
    - method: delivery|pickup
    - locationId: uuid (for pickup)
    - postalCode: string (for delivery)
    - startDate: ISO-8601
    - endDate: ISO-8601
  Response: 200 OK
    {
      "dates": [
        {
          "date": "ISO-8601",
          "available": boolean,
          "timeWindows": [
            {
              "id": "morning",
              "label": "Morning (9 AM - 12 PM)",
              "available": boolean
            },
            {
              "id": "afternoon",
              "label": "Afternoon (12 PM - 4 PM)",
              "available": boolean
            },
            {
              "id": "evening",
              "label": "Evening (4 PM - 7 PM)",
              "available": boolean
            }
          ]
        }
      ],
      "deliveryFee": number
    }
```

### Scheduling

```
POST /api/v1/deliveries/:purchaseId/schedule
  Description: Schedule delivery or pickup
  Auth: Required
  Request Body:
    {
      "method": "delivery|pickup",
      "date": "ISO-8601",
      "timeWindow": "morning|afternoon|evening",
      "address": {
        "street": "string",
        "unit": "string",
        "city": "string",
        "province": "string",
        "postalCode": "string",
        "lat": number,
        "lng": number,
        "instructions": "string"
      },
      "locationId": "uuid" // for pickup
    }
  Response: 201 Created
    {
      "deliveryId": "uuid",
      "confirmationNumber": "string",
      "method": "delivery|pickup",
      "scheduledDate": "ISO-8601",
      "timeWindow": {
        "id": "string",
        "start": "ISO-8601",
        "end": "ISO-8601"
      },
      "address": { ... },
      "fee": number,
      "estimatedArrival": "ISO-8601"
    }

PUT /api/v1/deliveries/:deliveryId/reschedule
  Description: Reschedule delivery
  Auth: Required
  Request Body:
    {
      "date": "ISO-8601",
      "timeWindow": "morning|afternoon|evening"
    }
  Response: 200 OK
    {
      "deliveryId": "uuid",
      "previousSchedule": { ... },
      "newSchedule": { ... },
      "rescheduledAt": "ISO-8601"
    }

DELETE /api/v1/deliveries/:deliveryId
  Description: Cancel delivery
  Auth: Required
  Response: 200 OK
    {
      "cancelled": true,
      "cancelledAt": "ISO-8601"
    }
```

### Tracking

```
GET /api/v1/deliveries/:deliveryId
  Description: Get delivery details
  Auth: Required
  Response: 200 OK
    {
      "deliveryId": "uuid",
      "purchaseId": "uuid",
      "vehicleId": "uuid",
      "vehicle": {
        "make": "string",
        "model": "string",
        "year": number,
        "color": "string"
      },
      "method": "delivery|pickup",
      "status": "scheduled|preparing|in_transit|arriving|delivered",
      "scheduledDate": "ISO-8601",
      "timeWindow": { ... },
      "address": { ... },
      "driver": {
        "id": "uuid",
        "name": "string",
        "phone": "string",
        "photo": "string",
        "vehicleInfo": {
          "make": "string",
          "model": "string",
          "color": "string",
          "licensePlate": "string"
        }
      },
      "tracking": {
        "available": boolean,
        "url": "string"
      },
      "timeline": [
        {
          "event": "string",
          "timestamp": "ISO-8601",
          "description": "string"
        }
      ]
    }

GET /api/v1/deliveries/:deliveryId/tracking
  Description: Get real-time tracking data
  Auth: Required
  Response: 200 OK
    {
      "deliveryId": "uuid",
      "status": "in_transit|arriving",
      "driverLocation": {
        "lat": number,
        "lng": number,
        "heading": number,
        "speed": number,
        "updatedAt": "ISO-8601"
      },
      "eta": {
        "time": "ISO-8601",
        "minutes": number
      },
      "route": {
        "polyline": "string (encoded)",
        "distanceRemaining": number,
        "durationRemaining": number
      }
    }

WebSocket /api/v1/deliveries/:deliveryId/live
  Description: Real-time tracking updates
  Auth: Required (token in query or header)
  Messages:
    Client -> Server:
      { "type": "subscribe" }
      { "type": "ping" }

    Server -> Client:
      {
        "type": "location_update",
        "data": {
          "lat": number,
          "lng": number,
          "eta": "ISO-8601",
          "etaMinutes": number
        }
      }
      {
        "type": "status_change",
        "data": {
          "status": "arriving",
          "message": "Your driver is 5 minutes away"
        }
      }
      {
        "type": "arrived",
        "data": {
          "message": "Your vehicle has arrived!"
        }
      }
```

### Handover

```
GET /api/v1/deliveries/:deliveryId/handover
  Description: Get handover requirements
  Auth: Required
  Response: 200 OK
    {
      "deliveryId": "uuid",
      "vehicle": { ... },
      "requiredSteps": [
        {
          "step": "condition_check",
          "label": "Vehicle Condition",
          "required": true
        },
        {
          "step": "documents",
          "label": "Documents Received",
          "required": true,
          "items": ["registration", "insurance_card", "manual", "spare_keys"]
        },
        {
          "step": "keys",
          "label": "Keys Received",
          "required": true
        },
        {
          "step": "signature",
          "label": "Sign to Confirm",
          "required": true
        }
      ]
    }

POST /api/v1/deliveries/:deliveryId/handover
  Description: Complete handover confirmation
  Auth: Required
  Content-Type: multipart/form-data
  Request Body:
    - photos: File[] (vehicle photos at delivery)
    - conditionAccepted: boolean
    - conditionNotes: string
    - documentsReceived: string[] (list of received documents)
    - keysReceived: boolean
    - keyCount: number
    - signature: string (base64 image)
    - signedAt: ISO-8601
  Response: 200 OK
    {
      "deliveryId": "uuid",
      "handoverCompleted": true,
      "completedAt": "ISO-8601",
      "confirmationNumber": "string",
      "trialPeriod": {
        "startDate": "ISO-8601",
        "endDate": "ISO-8601",
        "maxMileage": 750
      },
      "receiptUrl": "string"
    }
```

### Driver App Endpoints

```
POST /api/v1/driver/deliveries/:deliveryId/start
  Description: Driver starts delivery route
  Auth: Required (Driver role)
  Request Body:
    {
      "mileageStart": number,
      "vehicleCondition": "good"
    }
  Response: 200 OK

POST /api/v1/driver/deliveries/:deliveryId/location
  Description: Update driver location
  Auth: Required (Driver role)
  Request Body:
    {
      "lat": number,
      "lng": number,
      "heading": number,
      "speed": number,
      "accuracy": number
    }
  Response: 204 No Content

POST /api/v1/driver/deliveries/:deliveryId/arrived
  Description: Driver arrived at destination
  Auth: Required (Driver role)
  Response: 200 OK

POST /api/v1/driver/deliveries/:deliveryId/complete
  Description: Driver completes delivery
  Auth: Required (Driver role)
  Request Body:
    {
      "photos": ["string"],
      "customerSignature": "string",
      "mileageEnd": number
    }
  Response: 200 OK
```

---

## Data Models

### Delivery

```typescript
interface Delivery {
  id: string;
  purchaseId: string;
  vehicleId: string;
  customerId: string;
  confirmationNumber: string;
  method: 'delivery' | 'pickup';
  status: DeliveryStatus;

  // Scheduling
  scheduledDate: Date;
  timeWindow: TimeWindow;
  address?: DeliveryAddress;
  pickupLocationId?: string;

  // Assignment
  driverId?: string;
  assignedAt?: Date;

  // Tracking
  departedAt?: Date;
  arrivedAt?: Date;
  deliveredAt?: Date;

  // Handover
  handoverCompleted: boolean;
  handoverData?: HandoverData;

  // Fees
  fee: number;
  feeWaived: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

enum DeliveryStatus {
  SCHEDULED = 'scheduled',
  ASSIGNED = 'assigned',
  PREPARING = 'preparing',
  IN_TRANSIT = 'in_transit',
  ARRIVING = 'arriving',
  ARRIVED = 'arrived',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

interface TimeWindow {
  id: 'morning' | 'afternoon' | 'evening';
  start: Date;
  end: Date;
}

interface DeliveryAddress {
  street: string;
  unit?: string;
  city: string;
  province: string;
  postalCode: string;
  lat: number;
  lng: number;
  instructions?: string;
  verified: boolean;
}

interface HandoverData {
  photos: string[];
  conditionAccepted: boolean;
  conditionNotes?: string;
  documentsReceived: string[];
  keysReceived: boolean;
  keyCount: number;
  signature: string;
  signedAt: Date;
  mileageAtDelivery: number;
}
```

### Driver

```typescript
interface Driver {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  photo: string;
  vehicle: DriverVehicle;
  status: 'available' | 'on_delivery' | 'offline';
  currentLocation?: GeoPoint;
  homeBase: string; // Location ID
  rating: number;
  deliveriesCompleted: number;
}

interface DriverVehicle {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin: string;
}
```

### DeliveryTracking

```typescript
interface DeliveryTracking {
  deliveryId: string;
  driverId: string;
  status: DeliveryStatus;

  route: {
    origin: GeoPoint;
    destination: GeoPoint;
    polyline: string;
    distanceMeters: number;
    durationSeconds: number;
  };

  currentLocation: {
    lat: number;
    lng: number;
    heading: number;
    speed: number;
    accuracy: number;
    timestamp: Date;
  };

  eta: {
    time: Date;
    distanceRemaining: number;
    durationRemaining: number;
  };

  history: LocationPoint[];
}

interface LocationPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}
```

---

## Business Rules

### Scheduling

1. Delivery available within service area (radius varies by location)
2. Minimum 2 business days lead time
3. Maximum 14 days advance booking
4. Same-day changes require 4-hour notice
5. Free delivery within specified radius
6. Per-km fee beyond free radius

### Driver Assignment

1. Assign driver 24 hours before delivery
2. Match driver base location to route
3. Consider driver workload and availability
4. Backup driver assigned for contingency

### Tracking

1. GPS updates every 30 seconds during transit
2. ETA recalculated with each update
3. Customer notified at 15-minute, 5-minute marks
4. Notify if significantly delayed (>15 min from window)

### Handover

1. Photo documentation required
2. Customer signature required
3. Key count confirmed
4. Condition noted before departure
5. Trial period starts upon confirmed handover

---

## Service Dependencies

### External Services

- **Google Maps API**: Routing, ETA, geocoding
- **Twilio**: SMS notifications
- **Push Service**: Mobile notifications

### Internal Services

- **User Service**: Customer data
- **Vehicle Service**: Vehicle preparation status
- **Notification Service**: Multi-channel notifications
- **Analytics Service**: Delivery metrics

---

## Real-time Infrastructure

### WebSocket Server

- Redis PubSub for location broadcasts
- Room-based subscriptions per delivery
- Heartbeat every 30 seconds
- Auto-reconnect handling

### Location Processing

- Batch location updates every 5 seconds
- Smooth interpolation for display
- ETA calculation via routing service
- Geofence triggers for status changes

---

## Monitoring

### Key Metrics

- On-time delivery rate
- Average delivery time
- Customer satisfaction score
- Driver utilization rate
- Reschedule rate

### Alerts

- Driver not moving for 15+ minutes
- ETA exceeded by 30+ minutes
- High cancellation rate
- Tracking data gap > 2 minutes
