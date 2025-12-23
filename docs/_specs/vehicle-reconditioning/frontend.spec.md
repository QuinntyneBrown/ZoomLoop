# Vehicle Reconditioning - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Reconditioning & Production (Internal)

---

## Overview

The Vehicle Reconditioning feature is an internal-facing system for managing the 210-point inspection, reconditioning process, and certification workflow. This is primarily used by facility staff and operations teams.

---

## User Stories (Internal)

### US-1: Track Vehicle Progress
**As a** production manager
**I want to** track vehicles through reconditioning
**So that** I can manage throughput

### US-2: Complete Inspection Points
**As an** inspector
**I want to** record inspection results
**So that** the vehicle is properly evaluated

### US-3: Manage Repairs
**As a** technician
**I want to** view and complete repair assignments
**So that** vehicles are properly reconditioned

### US-4: Certify Vehicles
**As a** quality manager
**I want to** approve vehicles for sale
**So that** only quality vehicles are listed

---

## UI Components (Internal Portal)

### Production Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Production Dashboard                                        │
│                                                                │
│  Today's Stats                                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │  12     │ │  8      │ │  5      │ │  3      │           │
│  │ Received│ │ In Prog │ │ Ready   │ │ Shipped │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│                                                                │
│  Vehicle Queue                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ VIN          │ Make/Model     │ Stage      │ Time      ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ...9186      │ Honda Civic    │ Inspection │ 2h 15m    ││
│  │ ...4521      │ Toyota RAV4    │ Repairs    │ 4h 30m    ││
│  │ ...7834      │ Ford Escape    │ Detailing  │ 1h 45m    ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### 210-Point Inspection Checklist

```
┌─────────────────────────────────────────────────────────────┐
│  Vehicle Inspection                                          │
│  VIN: 1HGBH41JXMN109186 • 2021 Honda Civic LX               │
│                                                                │
│  Progress: 45/210 points (21%)                               │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░                             │
│                                                                │
│  Exterior (12/25)                    [Expand ▼]              │
│  ──────────────────                                           │
│  ✓ Body panels - No damage                                   │
│  ✓ Paint condition - Good                                    │
│  ✓ Windshield - No chips                                     │
│  ◐ Side mirrors - [In Progress]                              │
│  ○ Lights and signals                                        │
│  ...                                                          │
│                                                                │
│  Engine & Mechanical (0/45)          [Expand ▼]              │
│  ──────────────────────────                                   │
│                                                                │
│  Interior (8/30)                     [Expand ▼]              │
│  ─────────────                                                │
│                                                                │
│  [Save Progress]  [Flag for Review]  [Complete Section]      │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Inspection Point Detail

```
┌─────────────────────────────────────┐
│  Inspection Point #47               │
│  Category: Engine & Mechanical      │
│                                       │
│  Item: Engine Oil Level             │
│                                       │
│  Status:                             │
│  ○ Pass                              │
│  ○ Fail - Repair Required           │
│  ○ Note - Observation Only          │
│                                       │
│  Notes:                              │
│  [_______________________]           │
│                                       │
│  Photos:                             │
│  [+ Add Photo]                       │
│                                       │
│  [Previous]  [Save & Next]           │
└─────────────────────────────────────┘
```

### Repair Work Order

```
┌─────────────────────────────────────────────────────────────┐
│  Work Order #WO-2025-1234                                    │
│  Vehicle: 2021 Honda Civic LX (VIN: ...9186)                │
│                                                                │
│  Repair Items                                                │
│  ┌─────────────────────────────────────────────────────────┐│
│  │  ☐ Replace brake pads - Front                           ││
│  │    Est: 1.5 hrs • Parts: $85.00 • Labor: $120.00        ││
│  │    Assigned: John T.                                     ││
│  ├─────────────────────────────────────────────────────────┤│
│  │  ☑ Oil change and filter                                ││
│  │    Completed: Dec 21, 2:30 PM by Mike S.                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                                │
│  Total Estimate: $450.00                                     │
│  Actual: $385.00                                             │
│                                                                │
│  [Add Repair Item]  [Complete Work Order]                    │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

### Certification Approval

```
┌─────────────────────────────────────────────────────────────┐
│  Certification Review                                        │
│  2021 Honda Civic LX                                         │
│                                                                │
│  ✓ 210-Point Inspection Complete                            │
│  ✓ All Repairs Completed                                    │
│  ✓ Detailing Complete                                       │
│  ✓ Photos Uploaded (24)                                     │
│  ✓ Vehicle History Clear                                    │
│                                                                │
│  Quality Score: 94/100                                       │
│  Recommended: Approve for Retail                            │
│                                                                │
│  Decision:                                                    │
│  [Approve for Retail]  [Send to Wholesale]  [Return to Prod]│
│                                                                │
│  Notes:                                                       │
│  [_______________________________________]                   │
│                                                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Customer-Facing: Certification Badge

```
On vehicle listings, show certification info:

┌─────────────────────────────────────┐
│  🏆 Certified Quality              │
│  ─────────────────                   │
│  ✓ 210-Point Inspection            │
│  ✓ Clean Vehicle History           │
│  ✓ Professionally Reconditioned    │
│  ✓ Quality Guarantee               │
│                                       │
│  [View Inspection Report]            │
└─────────────────────────────────────┘
```

---

## Page Routes (Internal)

| Route | Component | Description |
|-------|-----------|-------------|
| `/internal/production` | ProductionDashboard | Overview |
| `/internal/production/queue` | VehicleQueuePage | Vehicle list |
| `/internal/production/:vehicleId` | VehicleDetailPage | Vehicle work |
| `/internal/production/:vehicleId/inspection` | InspectionPage | 210-point |
| `/internal/production/:vehicleId/repairs` | RepairsPage | Work orders |
| `/internal/production/:vehicleId/certify` | CertificationPage | Approval |

---

## API Integration

```
GET /api/v1/internal/production/queue
  Response: { vehicles: ProductionVehicle[] }

GET /api/v1/internal/production/:vehicleId/inspection
  Response: { checkpoints: InspectionCheckpoint[] }

POST /api/v1/internal/production/:vehicleId/inspection/:pointId
  Body: { status, notes, photos }

POST /api/v1/internal/production/:vehicleId/repairs
  Body: { items: RepairItem[] }

POST /api/v1/internal/production/:vehicleId/certify
  Body: { decision, notes }
```

---

## Analytics (Internal)

- Average inspection time
- Repairs per vehicle
- Certification approval rate
- Throughput per facility
- Quality scores trend
