# Delivery - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Delivery & Logistics
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

Backend services for delivery manage scheduling, driver assignment, real-time tracking, and delivery completion workflows.

---

## API Endpoints

### POST /api/v1/orders/:orderId/delivery

Schedule delivery.

**Request:**
```json
{
  "method": "delivery",
  "address": {
    "street": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postalCode": "M5V 2T6"
  },
  "preferredDate": "2025-12-28",
  "preferredTimeWindow": "12:00-15:00",
  "specialInstructions": "Gate code: 1234"
}
```

**Response:**
```json
{
  "deliveryId": "del_abc123",
  "status": "scheduled",
  "scheduledDate": "2025-12-28",
  "timeWindow": {
    "start": "12:00",
    "end": "15:00"
  },
  "address": { ... },
  "estimatedCost": 0,
  "confirmationNumber": "DEL-2025-12345"
}
```

---

### GET /api/v1/deliveries/:deliveryId/track

Get real-time tracking.

**Response:**
```json
{
  "deliveryId": "del_abc123",
  "status": "in_transit",
  "driver": {
    "name": "Mike T.",
    "phone": "416-555-9999",
    "vehicleInfo": "White Ford Transit - ABC 123"
  },
  "currentLocation": {
    "lat": 43.6532,
    "lng": -79.3832
  },
  "estimatedArrival": "2025-12-28T13:30:00Z",
  "timeline": [
    { "status": "scheduled", "timestamp": "2025-12-23T11:00:00Z" },
    { "status": "preparing", "timestamp": "2025-12-27T16:00:00Z" },
    { "status": "in_transit", "timestamp": "2025-12-28T10:30:00Z" }
  ]
}
```

---

### POST /api/v1/deliveries/:deliveryId/complete

Complete delivery handover.

**Request:**
```json
{
  "signature": "data:image/png;base64,...",
  "mileageAtDelivery": 35425,
  "conditionAcknowledged": true,
  "documentsReceived": [
    "registration",
    "ownership",
    "warranty_card"
  ],
  "photos": ["url1", "url2"]
}
```

**Response:**
```json
{
  "deliveryId": "del_abc123",
  "status": "completed",
  "completedAt": "2025-12-28T13:45:00Z",
  "trialPeriod": {
    "startDate": "2025-12-28",
    "endDate": "2026-01-07",
    "maxMileage": 750
  }
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `DeliveryMethodSelected` | Method chosen | `{ orderId, method }` |
| `DeliveryScheduled` | Date set | `{ deliveryId, date, timeWindow }` |
| `DeliveryAddressVerified` | Address validated | `{ deliveryId, address }` |
| `VehiclePreparedForDelivery` | Vehicle ready | `{ vehicleId, preparedBy }` |
| `DeliveryAssigned` | Driver assigned | `{ deliveryId, driverId }` |
| `VehicleInTransit` | En route | `{ deliveryId, estimatedArrival }` |
| `DeliveryCompleted` | Delivered | `{ deliveryId, signature }` |
| `VehicleHandedOver` | Keys transferred | `{ deliveryId, mileage }` |
| `CustomerPickupCompleted` | Pickup done | `{ orderId, pickupLocation }` |

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
