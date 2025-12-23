# Vehicle Reconditioning - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Reconditioning & Production

---

## Overview

The Vehicle Reconditioning backend manages the vehicle production pipeline from arrival through certification, including inspection, repairs, and quality assurance.

---

## Domain Events

### 210-Point Inspection

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleReceivedAtFacility` | Arrived at facility | `{ vehicleId, facilityId, receivedAt, mileageIn }` |
| `ProductionStarted` | Reconditioning begins | `{ productionJobId, vehicleId, startedAt }` |
| `InspectionPointCompleted` | Checkpoint passed | `{ inspectionPointId, pointNumber, status, notes }` |
| `SafetyInspectionPassed` | Safety verified | `{ vehicleId, inspectorId, passedAt }` |
| `QualityCheckCompleted` | Final QC done | `{ vehicleId, qualityScore, inspectorId }` |

### Reconditioning

| Event | Description | Payload |
|-------|-------------|---------|
| `ReconditioningStarted` | Repairs begin | `{ vehicleId, workOrderId, startedAt }` |
| `RepairItemIdentified` | Issue found | `{ repairItemId, category, severity, cost }` |
| `RepairCompleted` | Repair done | `{ repairItemId, completedAt, actualCost, technicianId }` |
| `DetailingCompleted` | Cleaning done | `{ vehicleId, detailedAt, detailLevel }` |
| `VehiclePhotographed` | Photos taken | `{ vehicleId, photoSessionId, photoCount, photoUrls[] }` |

### Certification

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleCertificationStarted` | Cert process | `{ certificationId, vehicleId, startedAt }` |
| `VehicleHistoryReportGenerated` | History pulled | `{ vehicleId, reportId, reportUrl }` |
| `VehicleHistoryVerified` | History clean | `{ vehicleId, historyStatus, accidents, owners }` |
| `VehicleCertified` | Certified | `{ vehicleId, certifiedAt, certificationNumber }` |
| `CertificationFailed` | Failed cert | `{ vehicleId, failureReasons[], failedAt }` |

### Inventory Decision

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleApprovedForRetail` | Retail approved | `{ vehicleId, approvedAt, targetPrice }` |
| `VehicleRejectedForRetail` | Retail rejected | `{ vehicleId, rejectionReasons[] }` |
| `VehicleSentToWholesale` | Sent wholesale | `{ vehicleId, wholesaleChannel, sentAt }` |
| `VehicleListedForSale` | Published | `{ listingId, vehicleId, listedAt, price }` |

---

## API Endpoints

### Production Queue

```
GET /api/v1/internal/production/queue
  Description: Get vehicles in production
  Auth: Required (Internal role)
  Query Parameters:
    - facilityId: uuid
    - stage: received|inspection|repairs|detailing|photos|certification
    - page: number
    - limit: number
  Response: 200 OK
    {
      "vehicles": [
        {
          "vehicleId": "uuid",
          "vin": "string",
          "make": "string",
          "model": "string",
          "year": number,
          "stage": "string",
          "progress": number,
          "timeInStage": number,
          "assignedTo": "string",
          "priority": "normal|high|urgent"
        }
      ],
      "stats": {
        "received": number,
        "inProgress": number,
        "awaitingCertification": number,
        "certified": number
      }
    }

POST /api/v1/internal/production/receive
  Description: Receive vehicle at facility
  Auth: Required (Internal role)
  Request Body:
    {
      "vehicleId": "uuid",
      "facilityId": "uuid",
      "mileageIn": number,
      "receivedBy": "uuid"
    }
  Response: 201 Created
    {
      "productionJobId": "uuid",
      "stage": "received",
      "createdAt": "ISO-8601"
    }
```

### Inspection

```
GET /api/v1/internal/production/:vehicleId/inspection
  Description: Get inspection checklist
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "vehicleId": "uuid",
      "inspectionId": "uuid",
      "totalPoints": 210,
      "completedPoints": number,
      "passedPoints": number,
      "failedPoints": number,
      "categories": [
        {
          "name": "Exterior",
          "totalPoints": 25,
          "completedPoints": number,
          "points": [
            {
              "pointId": "uuid",
              "number": 1,
              "item": "Body panels",
              "description": "Check for dents, scratches, damage",
              "status": "pending|pass|fail|note",
              "notes": "string",
              "photos": ["string"],
              "completedAt": "ISO-8601",
              "inspectorId": "uuid"
            }
          ]
        }
      ]
    }

POST /api/v1/internal/production/:vehicleId/inspection/:pointId
  Description: Complete inspection point
  Auth: Required (Internal role)
  Request Body:
    {
      "status": "pass|fail|note",
      "notes": "string",
      "photos": ["string"],
      "requiresRepair": boolean,
      "repairEstimate": number
    }
  Response: 200 OK
    {
      "pointId": "uuid",
      "status": "string",
      "completedAt": "ISO-8601"
    }

POST /api/v1/internal/production/:vehicleId/inspection/complete
  Description: Complete all inspection
  Auth: Required (Internal role)
  Request Body:
    {
      "inspectorId": "uuid",
      "overallNotes": "string"
    }
  Response: 200 OK
    {
      "inspectionId": "uuid",
      "completedAt": "ISO-8601",
      "repairItemsGenerated": number,
      "nextStage": "repairs|detailing"
    }
```

### Repairs

```
GET /api/v1/internal/production/:vehicleId/repairs
  Description: Get repair work order
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "workOrderId": "uuid",
      "vehicleId": "uuid",
      "status": "pending|in_progress|completed",
      "items": [
        {
          "itemId": "uuid",
          "category": "string",
          "description": "string",
          "severity": "minor|moderate|major",
          "estimatedHours": number,
          "estimatedParts": number,
          "actualHours": number,
          "actualParts": number,
          "status": "pending|in_progress|completed",
          "assignedTo": "uuid",
          "completedAt": "ISO-8601"
        }
      ],
      "totalEstimate": number,
      "totalActual": number
    }

POST /api/v1/internal/production/:vehicleId/repairs/:itemId/complete
  Description: Complete repair item
  Auth: Required (Internal role)
  Request Body:
    {
      "technicianId": "uuid",
      "actualHours": number,
      "actualParts": number,
      "notes": "string",
      "photos": ["string"]
    }
  Response: 200 OK
```

### Certification

```
POST /api/v1/internal/production/:vehicleId/certify
  Description: Submit for certification
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "certificationId": "uuid",
      "status": "pending_review"
    }

GET /api/v1/internal/production/:vehicleId/certification
  Description: Get certification status
  Auth: Required (Internal role)
  Response: 200 OK
    {
      "certificationId": "uuid",
      "vehicleId": "uuid",
      "status": "pending|approved|rejected",
      "checks": {
        "inspectionComplete": boolean,
        "repairsComplete": boolean,
        "detailingComplete": boolean,
        "photosComplete": boolean,
        "historyClean": boolean
      },
      "qualityScore": number,
      "recommendation": "retail|wholesale|return_to_production",
      "certifiedAt": "ISO-8601",
      "certificationNumber": "string"
    }

POST /api/v1/internal/production/:vehicleId/certification/approve
  Description: Approve for retail
  Auth: Required (Manager role)
  Request Body:
    {
      "decision": "retail|wholesale",
      "targetPrice": number,
      "notes": "string"
    }
  Response: 200 OK
    {
      "approved": true,
      "certificationNumber": "string",
      "nextStep": "listing"
    }
```

---

## Data Models

```typescript
interface ProductionJob {
  id: string;
  vehicleId: string;
  facilityId: string;
  purchaseId: string;
  stage: ProductionStage;
  priority: 'normal' | 'high' | 'urgent';
  mileageIn: number;
  receivedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  assignedTeam?: string;
  createdAt: Date;
  updatedAt: Date;
}

enum ProductionStage {
  RECEIVED = 'received',
  INSPECTION = 'inspection',
  REPAIRS = 'repairs',
  DETAILING = 'detailing',
  PHOTOS = 'photos',
  CERTIFICATION = 'certification',
  APPROVED = 'approved',
  LISTED = 'listed'
}

interface Inspection {
  id: string;
  vehicleId: string;
  productionJobId: string;
  totalPoints: number;
  completedPoints: number;
  passedPoints: number;
  failedPoints: number;
  status: 'in_progress' | 'completed';
  startedAt: Date;
  completedAt?: Date;
  completedBy?: string;
}

interface InspectionPoint {
  id: string;
  inspectionId: string;
  number: number;
  category: string;
  item: string;
  description: string;
  status: 'pending' | 'pass' | 'fail' | 'note';
  notes?: string;
  photos: string[];
  requiresRepair: boolean;
  repairEstimate?: number;
  completedAt?: Date;
  inspectorId?: string;
}

interface RepairWorkOrder {
  id: string;
  vehicleId: string;
  productionJobId: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: RepairItem[];
  totalEstimate: number;
  totalActual: number;
  createdAt: Date;
  completedAt?: Date;
}

interface Certification {
  id: string;
  vehicleId: string;
  productionJobId: string;
  status: 'pending' | 'approved' | 'rejected';
  qualityScore: number;
  checks: CertificationChecks;
  recommendation: 'retail' | 'wholesale' | 'return';
  decision?: 'retail' | 'wholesale';
  certificationNumber?: string;
  approvedBy?: string;
  certifiedAt?: Date;
  notes?: string;
}
```

---

## Business Rules

1. All 210 points must be completed before certification
2. Failed points require repair items
3. Safety-critical failures block certification
4. Quality score > 85 for retail
5. Vehicle history must be clean (no salvage, theft)
6. Photos required: min 20, including all angles
7. Detailing required before photos

---

## Monitoring

### Key Metrics

- Average time per stage
- Inspection pass rate
- Repair cost per vehicle
- Certification approval rate
- Daily/weekly throughput
- Quality score distribution
