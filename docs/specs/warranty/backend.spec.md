# Warranty & Protection - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Warranty & Protection Plans
**Platform:** Clutch Clone - Online Used Car Marketplace

---

## Overview

Backend services for warranty handle coverage management, claim processing, service center coordination, and extended warranty sales.

---

## API Endpoints

### GET /api/v1/vehicles/:vehicleId/warranty

Get warranty coverage for vehicle.

**Response:**
```json
{
  "vehicleId": "veh_abc123",
  "warranties": [
    {
      "id": "war_std123",
      "type": "standard",
      "name": "90-Day Limited Warranty",
      "startDate": "2025-12-28",
      "endDate": "2026-03-28",
      "status": "active",
      "deductible": 10000,
      "coverage": [
        { "category": "Engine", "covered": true },
        { "category": "Transmission", "covered": true },
        { "category": "Drive Axle", "covered": true },
        { "category": "Electrical", "covered": true },
        { "category": "Air Conditioning", "covered": true },
        { "category": "Suspension", "covered": true }
      ],
      "exclusions": [
        "Normal wear and tear",
        "Cosmetic damage",
        "Pre-existing conditions"
      ]
    },
    {
      "id": "war_ext456",
      "type": "extended",
      "name": "Premium 3-Year Protection",
      "startDate": "2026-03-29",
      "endDate": "2029-03-28",
      "status": "pending",
      "deductible": 0,
      "coverage": [...]
    }
  ]
}
```

---

### GET /api/v1/warranty/plans

Get available extended warranty plans.

**Response:**
```json
{
  "plans": [
    {
      "id": "plan_basic",
      "name": "Basic",
      "duration": 12,
      "price": 59900,
      "deductible": 0,
      "coverage": ["Engine", "Transmission", "Drivetrain"],
      "features": [],
      "isRecommended": false
    },
    {
      "id": "plan_premium",
      "name": "Premium",
      "duration": 36,
      "price": 129900,
      "deductible": 0,
      "coverage": ["Engine", "Transmission", "Drivetrain", "Electrical", "A/C", "Seals/Gaskets"],
      "features": ["Transferable", "No claim limit"],
      "isRecommended": true
    },
    {
      "id": "plan_platinum",
      "name": "Platinum",
      "duration": 60,
      "price": 199900,
      "deductible": 0,
      "coverage": ["All Premium", "Brakes", "Steering", "Exhaust", "Fuel System"],
      "features": ["Roadside Assistance", "Rental Car Coverage", "Trip Interruption"],
      "isRecommended": false
    }
  ]
}
```

---

### POST /api/v1/warranty/claims

Submit warranty claim.

**Request:**
```json
{
  "warrantyId": "war_std123",
  "vehicleId": "veh_abc123",
  "category": "engine",
  "description": "Engine making unusual knocking sound when cold",
  "currentMileage": 38500,
  "issueStartDate": "2025-12-30",
  "photos": ["url1", "url2"],
  "preferredServiceCenter": "svc_tor01"
}
```

**Response:**
```json
{
  "claimId": "clm_xyz789",
  "warrantyId": "war_std123",
  "status": "submitted",
  "estimatedReviewTime": "1-2 business days",
  "confirmationNumber": "CLM-2025-12345",
  "nextSteps": [
    "Our team will review your claim",
    "We'll contact you within 24-48 hours",
    "If approved, schedule service at your preferred location"
  ],
  "createdAt": "2025-12-31T10:00:00Z"
}
```

---

### GET /api/v1/warranty/claims/:claimId

Get claim status.

**Response:**
```json
{
  "claimId": "clm_xyz789",
  "warrantyId": "war_std123",
  "vehicleId": "veh_abc123",
  "status": "approved",
  "category": "engine",
  "description": "Engine making unusual knocking sound when cold",
  "mileage": 38500,
  "resolution": {
    "approvedAt": "2026-01-02T14:00:00Z",
    "coverageAmount": 85000,
    "deductible": 10000,
    "customerPays": 10000,
    "authorizedRepairs": "Engine diagnostic and timing chain inspection"
  },
  "service": {
    "serviceCenterId": "svc_tor01",
    "name": "Clutch Service Center Toronto",
    "address": "456 Auto Lane, Toronto ON",
    "phone": "416-555-7890",
    "scheduledDate": "2026-01-05",
    "scheduledTime": "10:00 AM"
  },
  "timeline": [
    { "status": "submitted", "timestamp": "2025-12-31T10:00:00Z" },
    { "status": "under_review", "timestamp": "2025-12-31T10:30:00Z" },
    { "status": "approved", "timestamp": "2026-01-02T14:00:00Z" }
  ]
}
```

---

### POST /api/v1/warranty/extended

Purchase extended warranty.

**Request:**
```json
{
  "vehicleId": "veh_abc123",
  "planId": "plan_premium",
  "paymentMethod": "add_to_financing"
}
```

**Response:**
```json
{
  "warrantyId": "war_ext789",
  "planName": "Premium 3-Year Protection",
  "price": 129900,
  "startDate": "2026-03-29",
  "endDate": "2029-03-28",
  "paymentMethod": "add_to_financing",
  "monthlyIncrease": 3608,
  "confirmationNumber": "EXT-2025-12345"
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `WarrantyIncluded` | Standard warranty activated | `{ warrantyId, vehicleId, coverage }` |
| `ExtendedWarrantyOffered` | Plans presented | `{ vehicleId, plans }` |
| `ExtendedWarrantyPurchased` | Extended plan bought | `{ warrantyId, planId, cost }` |
| `WarrantyClaimSubmitted` | Claim filed | `{ claimId, category, description }` |
| `WarrantyClaimApproved` | Claim accepted | `{ claimId, coverageAmount }` |
| `WarrantyClaimDenied` | Claim rejected | `{ claimId, reason }` |
| `WarrantyServiceScheduled` | Repair appointment | `{ claimId, serviceCenterId, date }` |
| `WarrantyServiceCompleted` | Repair finished | `{ claimId, repairCost }` |

---

## Class Diagram

See [class-diagram.puml](./class-diagram.puml)
