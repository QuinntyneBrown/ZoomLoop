# New Ingestion - Frontend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Ingestion
**Platform:** Clutch Clone - Online Used Car Marketplace
**Phase:** A

---

## Overview

The Vehicle Ingestion feature allows authorized users (dealers, administrators) to add new vehicles to the inventory by uploading images. The system uses AI to automatically extract the VIN, decode vehicle information, assess condition, and generate marketing descriptions.

---

## Requirements

### REQ-NI-F-001: Image Upload Interface
**Description:** Multi-image upload for vehicle ingestion
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Drag-and-drop image upload zone
- [ ] Click to select files option
- [ ] Support multiple file selection
- [ ] Preview uploaded images before submission
- [ ] Remove individual images before submission
- [ ] Reorder images (first image becomes primary)
- [ ] Minimum 1 image required
- [ ] Maximum 20 images allowed
- [ ] Supported formats: JPEG, PNG, WebP
- [ ] Maximum file size: 10MB per image

### REQ-NI-F-002: VIN Visibility Guidance
**Description:** Guide users to capture VIN in images
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Display guidance about VIN location (dashboard, door jamb)
- [ ] Show example images of proper VIN capture
- [ ] Visual indicator when VIN is likely visible
- [ ] Tips for clear VIN photography

### REQ-NI-F-003: Upload Progress Indicator
**Description:** Show upload and processing status
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Upload progress bar for each image
- [ ] Overall processing status indicator
- [ ] Step indicators: Uploading → Extracting VIN → Analyzing → Generating Description
- [ ] Estimated time remaining
- [ ] Cancel option during upload

### REQ-NI-F-004: Result Display
**Description:** Show extracted vehicle information
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Display extracted VIN prominently
- [ ] Show decoded vehicle info (Year, Make, Model)
- [ ] Display assessed condition (Interior, Exterior)
- [ ] Show generated description
- [ ] Display all uploaded images with primary indicator
- [ ] Edit option for any extracted field
- [ ] Save/Confirm button to finalize ingestion

### REQ-NI-F-005: Error Handling
**Description:** Handle ingestion failures gracefully
**Priority:** High
**Phase:** A

**Acceptance Criteria:**
- [ ] Clear error message when VIN not found
- [ ] Retry option with guidance
- [ ] Manual VIN entry fallback
- [ ] Individual image upload error handling
- [ ] Network error recovery

---

## UI Components

### Image Upload Zone

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                     Vehicle Ingestion                             │
│                     ─────────────────                             │
│                                                                   │
│  Upload vehicle images to automatically extract information       │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                            │  │
│  │         ┌─────┐                                            │  │
│  │         │  📷  │                                           │  │
│  │         └─────┘                                            │  │
│  │                                                            │  │
│  │      Drag and drop images here                             │  │
│  │              or                                            │  │
│  │      [Browse Files]                                        │  │
│  │                                                            │  │
│  │      JPEG, PNG, WebP • Max 10MB each • Up to 20 images    │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  💡 Tip: Include an image with the VIN visible (dashboard or    │
│     door jamb) for automatic vehicle identification              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Image Preview Grid

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  Uploaded Images (5)                              [+ Add More]   │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │            │  │            │  │            │  │            │ │
│  │  [Image]   │  │  [Image]   │  │  [Image]   │  │  [Image]   │ │
│  │            │  │            │  │            │  │            │ │
│  │ ★ Primary  │  │            │  │            │  │            │ │
│  │    [×]     │  │    [×]     │  │    [×]     │  │    [×]     │ │
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘ │
│                                                                   │
│  Drag images to reorder. First image will be the primary image.  │
│                                                                   │
│                              [Start Ingestion →]                  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Processing Status

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                    Processing Vehicle...                          │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ████████████████████░░░░░░░░░░░░░░  65%                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ✓ Uploading images                                              │
│  ✓ Extracting VIN from images                                    │
│  ● Analyzing vehicle condition                                    │
│  ○ Generating description                                         │
│  ○ Saving vehicle                                                 │
│                                                                   │
│  Estimated time remaining: ~10 seconds                            │
│                                                                   │
│                              [Cancel]                             │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Ingestion Result

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ✓ Vehicle Ingested Successfully                                 │
│  ─────────────────────────────────                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                                                             │ │
│  │   [Primary Image]        VIN: 1HGCV1F19MA123456            │ │
│  │                          ────────────────────               │ │
│  │                                                             │ │
│  │                          2021 Honda Civic LX                │ │
│  │                                                             │ │
│  │                          Doors: 4                           │ │
│  │                          Interior: Good                     │ │
│  │                          Exterior: Excellent                │ │
│  │                                                             │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  Description                                             [Edit]  │
│  ─────────────                                                   │
│  This stunning 2021 Honda Civic LX presents itself in excellent  │
│  condition, featuring a sleek exterior design and well-maintained│
│  interior. The vehicle offers exceptional fuel efficiency and    │
│  reliability that Honda is known for...                          │
│                                                                   │
│  Images (5)                                                       │
│  ──────────                                                       │
│  [img1★] [img2] [img3] [img4] [img5]                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │               Save & View Vehicle Listing                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
│  [Edit Details]              [Ingest Another Vehicle]            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Error State - VIN Not Found

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│  ⚠ Unable to Extract VIN                                        │
│  ─────────────────────────                                       │
│                                                                   │
│  We couldn't find a VIN in your uploaded images.                 │
│                                                                   │
│  Try these tips:                                                  │
│  • Include a clear photo of the VIN on the dashboard             │
│  • Ensure the VIN plate on the door jamb is visible              │
│  • Avoid glare and shadows on the VIN                            │
│  • VIN should be 17 characters and clearly readable              │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [Dashboard VIN Example]  │  [Door Jamb VIN Example]       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ─────────── OR ───────────                                      │
│                                                                   │
│  Enter VIN manually:                                              │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  [1HGCV1F19MA123456                               ]       │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
│  [Try Again with New Images]        [Continue with Manual VIN]   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## State Management

```typescript
interface VehicleIngestionState {
  // Upload state
  uploadedImages: UploadedImage[];
  isUploading: boolean;
  uploadProgress: number;

  // Processing state
  processingStep: ProcessingStep;
  isProcessing: boolean;
  processingProgress: number;
  estimatedTimeRemaining: number | null;

  // Result state
  result: IngestionResult | null;
  error: IngestionError | null;

  // Manual entry (fallback)
  manualVIN: string;
  isManualEntry: boolean;
}

type ProcessingStep =
  | 'idle'
  | 'uploading'
  | 'extracting_vin'
  | 'analyzing_condition'
  | 'generating_description'
  | 'saving'
  | 'completed'
  | 'failed';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
  isUploaded: boolean;
  order: number;
}

interface IngestionResult {
  vehicleId: string;
  vin: string;
  year: number;
  make: string;
  model: string;
  doors: number;
  interiorCondition: ConditionRating;
  exteriorCondition: ConditionRating;
  description: string;
  images: VehicleImage[];
}

interface IngestionError {
  code: 'VIN_NOT_FOUND' | 'UPLOAD_FAILED' | 'PROCESSING_FAILED' | 'NETWORK_ERROR';
  message: string;
  retryable: boolean;
}

type ConditionRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';

interface VehicleImage {
  id: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}
```

---

## API Integration

### Ingest Vehicle

```typescript
async function ingestVehicle(images: File[]): Promise<IngestionResult> {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('images', image);
  });

  const response = await fetch('/api/vehicle/ingest', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new IngestionError(error);
  }

  return response.json();
}
```

### Error Handling

```typescript
function handleIngestionError(error: IngestionError): void {
  switch (error.code) {
    case 'VIN_NOT_FOUND':
      // Show VIN not found UI with manual entry option
      showVINNotFoundDialog();
      break;
    case 'UPLOAD_FAILED':
      // Show upload retry option
      showUploadError(error.message);
      break;
    case 'NETWORK_ERROR':
      // Show network error with retry
      showNetworkError();
      break;
    default:
      // Show generic error
      showGenericError(error.message);
  }
}
```

---

## Events Emitted

| Event | Trigger | Data |
|-------|---------|------|
| `IngestionStarted` | User clicks Start Ingestion | `{ imageCount }` |
| `ImagesUploaded` | All images uploaded | `{ imageCount, totalSize }` |
| `VINExtracted` | VIN found in images | `{ vin }` |
| `VINExtractionFailed` | VIN not found | `{ imageCount }` |
| `ManualVINEntered` | User enters VIN manually | `{ vin }` |
| `ConditionAssessed` | AI assesses condition | `{ interior, exterior }` |
| `DescriptionGenerated` | AI generates description | `{ wordCount }` |
| `IngestionCompleted` | Full process complete | `{ vehicleId, vin, processingTimeMs }` |
| `IngestionFailed` | Process failed | `{ errorCode, errorMessage }` |
| `IngestionCancelled` | User cancels | `{ step }` |

---

## Component Structure

```
VehicleIngestionPage/
├── VehicleIngestionPage.tsx           # Main page component
├── components/
│   ├── ImageUploadZone.tsx            # Drag-and-drop upload area
│   ├── ImagePreviewGrid.tsx           # Grid of uploaded images
│   ├── ImagePreviewCard.tsx           # Individual image preview
│   ├── ProcessingStatus.tsx           # Step-by-step progress
│   ├── IngestionResult.tsx            # Success result display
│   ├── IngestionError.tsx             # Error state display
│   ├── VINGuidance.tsx                # Tips for VIN capture
│   ├── ManualVINEntry.tsx             # Manual VIN input form
│   └── ConditionBadge.tsx             # Condition rating display
├── hooks/
│   ├── useVehicleIngestion.ts         # Main ingestion logic
│   ├── useImageUpload.ts              # Image upload handling
│   └── useProcessingStatus.ts         # Processing step tracking
├── services/
│   └── vehicleIngestionService.ts     # API calls
└── types/
    └── vehicleIngestion.types.ts      # TypeScript interfaces
```

---

## Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Images | At least 1 required | "Please upload at least one image" |
| Images | Maximum 20 | "Maximum 20 images allowed" |
| Image Size | Max 10MB each | "Image exceeds 10MB limit" |
| Image Format | JPEG, PNG, WebP | "Unsupported image format" |
| Manual VIN | 17 alphanumeric chars | "VIN must be exactly 17 characters" |
| Manual VIN | Valid format | "Invalid VIN format" |

---

## Accessibility Requirements

- [ ] Drag-and-drop zone accessible via keyboard
- [ ] Screen reader announcements for upload progress
- [ ] Screen reader announcements for processing steps
- [ ] Error messages associated with form fields
- [ ] Focus management after error/success
- [ ] High contrast mode support
- [ ] Reduced motion option for progress animations

---

## Responsive Behavior

### Desktop (>1024px)
- Full drag-and-drop zone
- 4-column image preview grid
- Side-by-side layout for result

### Tablet (768px-1024px)
- Full drag-and-drop zone
- 3-column image preview grid
- Stacked layout for result

### Mobile (<768px)
- Compact upload button (no drag-and-drop)
- 2-column image preview grid
- Stacked layout for result
- Full-width action buttons

---

## User Permissions

| Role | Permissions |
|------|-------------|
| Admin | Full access to vehicle ingestion |
| Dealer | Can ingest vehicles for their dealership |
| Customer | No access to vehicle ingestion |
| Guest | No access to vehicle ingestion |

---

## Mockup

![Vehicle Ingestion Mockup](./mockup-ingestion.png)
