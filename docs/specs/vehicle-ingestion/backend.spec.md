# Vehicle Ingestion - Backend Specification

**Version:** 1.0
**Date:** December 23, 2025
**Feature:** Vehicle Ingestion
**Platform:** Online Used Car Marketplace
**Phase:** A

---

## Overview

Backend services for vehicle ingestion handle automated vehicle data extraction from uploaded images using AI/ML services (Azure Computer Vision and Azure OpenAI). The system extracts VIN via OCR, decodes vehicle information, assesses condition, and generates marketing descriptions.

---

## Architecture

### Technology Stack
- **Framework:** ASP.NET Core with MediatR CQRS pattern
- **AI Services:** Azure Computer Vision (OCR, Image Analysis), Azure OpenAI (GPT-4)
- **Database:** Entity Framework Core with SQL Server
- **Pattern:** Request/Handler pattern with pipeline behaviors

### Service Dependencies
- `IAzureVisionService` - Image analysis and OCR
- `IAzureOpenAIService` - Natural language processing
- `IVehicleIngestionService` - Orchestration service
- `IZoomLoopContext` - Database context

---

## API Endpoints

### POST /api/vehicle/ingest

Ingest vehicle from uploaded images. Extracts VIN, decodes vehicle info, assesses condition, and generates description.

**Authentication:** Required (Bearer Token)

**Request:**
- Content-Type: `multipart/form-data`
- Field: `images` (List of IFormFile)

```
POST /api/vehicle/ingest
Content-Type: multipart/form-data

images: [file1.jpg, file2.jpg, file3.jpg, ...]
```

**Response (200 OK):**
```json
{
  "vehicle": {
    "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
    "vin": "1HGCV1F19MA123456",
    "makeId": "550e8400-e29b-41d4-a716-446655440001",
    "vehicleModelId": "550e8400-e29b-41d4-a716-446655440002",
    "year": 2021,
    "doors": 4,
    "mileage": null,
    "seats": null,
    "exteriorColor": null,
    "interiorColor": null,
    "trim": null,
    "transmission": null,
    "fuelType": null,
    "driveType": null,
    "bodyType": null,
    "engineSize": null,
    "cylinders": null,
    "horsepower": null,
    "cityFuelConsumption": null,
    "highwayFuelConsumption": null,
    "description": "This stunning 2021 Honda Civic LX presents itself in excellent condition...",
    "isNew": false,
    "isCertified": false,
    "manufactureDate": null,
    "images": [
      {
        "vehicleImageId": "550e8400-e29b-41d4-a716-446655440003",
        "vehicleId": "550e8400-e29b-41d4-a716-446655440000",
        "imageUrl": "/assets/vehicles/550e8400-e29b-41d4-a716-446655440000/image1.jpg",
        "thumbnailUrl": null,
        "caption": null,
        "displayOrder": 1,
        "isPrimary": true,
        "createdDate": "2025-12-23T10:00:00Z"
      }
    ],
    "features": []
  }
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | No images provided |
| 401 | Unauthorized - missing or invalid token |
| 422 | VIN not found in any uploaded image |
| 500 | Internal server error (AI service failure) |

---

## Data Models

### Vehicle Entity

```csharp
public class Vehicle
{
    public Guid VehicleId { get; set; }
    public string VIN { get; set; }           // Primary lookup key
    public Guid? MakeId { get; set; }
    public Guid? VehicleModelId { get; set; }
    public int? Year { get; set; }
    public int? Doors { get; set; }
    public int? Mileage { get; set; }
    public int? Seats { get; set; }
    public string? ExteriorColor { get; set; }
    public string? InteriorColor { get; set; }
    public string? Trim { get; set; }
    public string? Transmission { get; set; }
    public string? FuelType { get; set; }
    public string? DriveType { get; set; }
    public string? BodyType { get; set; }
    public string? EngineSize { get; set; }
    public int? Cylinders { get; set; }
    public int? Horsepower { get; set; }
    public decimal? CityFuelConsumption { get; set; }
    public decimal? HighwayFuelConsumption { get; set; }
    public string? Description { get; set; }
    public bool IsNew { get; set; }
    public bool IsCertified { get; set; }
    public DateTime? ManufactureDate { get; set; }

    // Navigation properties
    public Make? Make { get; set; }
    public VehicleModel? VehicleModel { get; set; }
    public ICollection<VehicleImage> Images { get; set; }
    public ICollection<VehicleFeature> Features { get; set; }
}
```

### Make Entity

```csharp
public class Make
{
    public Guid MakeId { get; set; }
    public string Name { get; set; }          // Lookup key
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }

    public ICollection<VehicleModel> VehicleModels { get; set; }
}
```

### VehicleModel Entity

```csharp
public class VehicleModel
{
    public Guid VehicleModelId { get; set; }
    public Guid MakeId { get; set; }
    public string Name { get; set; }          // Lookup key (with MakeId)
    public string? Description { get; set; }
    public bool IsActive { get; set; }

    public Make Make { get; set; }
}
```

### VehicleImage Entity

```csharp
public class VehicleImage
{
    public Guid VehicleImageId { get; set; }
    public Guid VehicleId { get; set; }
    public string ImageUrl { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? Caption { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedDate { get; set; }

    public Vehicle Vehicle { get; set; }
}
```

### DigitalAsset Entity

```csharp
public class DigitalAsset
{
    public Guid DigitalAssetId { get; set; }
    public string Name { get; set; }
    public string ContentType { get; set; }
    public long Size { get; set; }
    public string Url { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
}
```

---

## Service Contracts

### VehicleIngestionRequest

```csharp
public class VehicleIngestionRequest
{
    public byte[][] Images { get; set; } = Array.Empty<byte[]>();
}
```

### VehicleIngestionResult

```csharp
public class VehicleIngestionResult
{
    public string VIN { get; set; }
    public int Year { get; set; }
    public string Make { get; set; }
    public string Model { get; set; }
    public string InteriorCondition { get; set; }  // Excellent/Good/Fair/Poor
    public string ExteriorCondition { get; set; }  // Excellent/Good/Fair/Poor
    public int NumberOfDoors { get; set; }
    public string Description { get; set; }
}
```

---

## Processing Pipeline

### Step 1: VIN Extraction (Azure Computer Vision OCR)
- Process each uploaded image through OCR
- Extract all text blocks from images
- Search for 17-character alphanumeric patterns (standard VIN format)
- Return first valid VIN found
- Throw `InvalidOperationException` if no VIN found

### Step 2: Vehicle Information Lookup (Azure OpenAI)
- Send VIN to GPT-4 with system prompt
- Extract: Year, Make, Model
- Response format: `{"year": 2021, "make": "Honda", "model": "Civic"}`

### Step 3: Condition Assessment (Azure Computer Vision + OpenAI)
- Analyze up to 3 images with Computer Vision
- Features: Caption, Tags, Objects
- Send analysis to OpenAI for condition assessment
- Extract: Interior Condition, Exterior Condition, Number of Doors
- Conditions rated: Excellent, Good, Fair, Poor

### Step 4: Description Generation (Azure Computer Vision + OpenAI)
- Analyze up to 5 images with Computer Vision
- Features: Caption, Tags, DenseCaptions
- Generate 200-word marketing description via OpenAI

### Concurrent Execution
Steps 2, 3, and 4 execute concurrently using `Task.WhenAll()` for optimal performance.

---

## Business Logic

### Idempotent Vehicle Creation
- Vehicles are uniquely identified by VIN
- If VIN exists: Update vehicle with new information
- If VIN does not exist: Create new vehicle
- Prevents duplicate vehicle records

### Make Lookup/Creation
- Lookup Make by name (case-sensitive)
- If not found: Create new Make with defaults
  - IsActive = true
  - DisplayOrder = 0
  - LogoUrl = empty string

### VehicleModel Lookup/Creation
- Lookup VehicleModel by MakeId and name
- If not found: Create new VehicleModel
  - IsActive = true
  - Description = empty string

### Image Processing
- Create DigitalAsset for each uploaded image
- Generate URL: `/assets/vehicles/{vehicleId}/{filename}`
- Create VehicleImage with:
  - DisplayOrder starting at 1 (sequential)
  - IsPrimary = true only for first image
  - CreatedDate = UTC now

---

## Validation Rules

| Rule | Description | Error |
|------|-------------|-------|
| REQ-NI-B-001 | At least one image required | 400 Bad Request |
| REQ-NI-B-002 | VIN must be extractable from images | 422 Unprocessable Entity |
| REQ-NI-B-003 | VIN must be 17 alphanumeric characters | 422 Unprocessable Entity |
| REQ-NI-B-004 | Images must be valid image formats | 400 Bad Request |

---

## Configuration

```json
{
  "VehicleIngestion": {
    "AzureComputerVisionEndpoint": "https://<region>.api.cognitive.microsoft.com/",
    "AzureComputerVisionKey": "<key>",
    "AzureOpenAIEndpoint": "https://<resource>.openai.azure.com/",
    "AzureOpenAIKey": "<key>",
    "AzureOpenAIDeploymentName": "gpt-4"
  }
}
```

---

## Domain Events

| Event | Description | Payload |
|-------|-------------|---------|
| `VehicleIngestionStarted` | Ingestion process initiated | `{ userId, imageCount }` |
| `VINExtracted` | VIN successfully read from image | `{ vin }` |
| `VehicleInfoDecoded` | Vehicle info decoded from VIN | `{ vin, year, make, model }` |
| `ConditionAssessed` | Vehicle condition determined | `{ vin, interiorCondition, exteriorCondition }` |
| `DescriptionGenerated` | Marketing description created | `{ vin, descriptionLength }` |
| `VehicleCreated` | New vehicle record created | `{ vehicleId, vin }` |
| `VehicleUpdated` | Existing vehicle record updated | `{ vehicleId, vin }` |
| `ImagesProcessed` | Vehicle images saved | `{ vehicleId, imageCount }` |
| `VehicleIngestionCompleted` | Full ingestion completed | `{ vehicleId, vin, processingTimeMs }` |
| `VehicleIngestionFailed` | Ingestion process failed | `{ errorMessage, errorCode }` |

---

## Error Handling

### VIN Extraction Failure
- Log all text extracted from images
- Return 422 with message: "Unable to extract VIN from provided images"
- Include suggestion to ensure VIN is visible and clear

### AI Service Timeout
- Default timeout: 30 seconds per operation
- Retry policy: 3 attempts with exponential backoff
- Return 500 with service-specific error message

### Database Transaction
- All operations (Vehicle, Make, VehicleModel, Images) wrapped in single transaction
- Rollback on any failure
- No partial state persisted

---

## Class Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     VehicleController                            │
│  POST /api/vehicle/ingest                                        │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VehicleIngestHandler                           │
│  - Orchestrates ingestion flow                                   │
│  - Manages entity creation/updates                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  VehicleIngestionService                         │
│  - VIN extraction (OCR)                                          │
│  - Vehicle info lookup                                           │
│  - Condition assessment                                          │
│  - Description generation                                        │
└─────────────────────────────────────────────────────────────────┘
            │                               │
            ▼                               ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│   AzureVisionService    │   │   AzureOpenAIService    │
│  - OCR                  │   │  - Chat completion      │
│  - Image analysis       │   │  - JSON parsing         │
└─────────────────────────┘   └─────────────────────────┘
```

---

## Test Requirements

### Unit Tests
- [ ] VehicleIngestHandler creates new vehicle when VIN not found
- [ ] VehicleIngestHandler updates existing vehicle when VIN exists
- [ ] VehicleIngestHandler creates Make when not found
- [ ] VehicleIngestHandler creates VehicleModel when not found
- [ ] VehicleIngestHandler marks first image as primary
- [ ] VehicleIngestHandler creates DigitalAsset for each image
- [ ] VehicleIngestionService validates image input
- [ ] VehicleIngestionService extracts VIN from images

### Integration Tests
- [ ] Full ingestion flow with fake AI services
- [ ] Concurrent processing timing validation
- [ ] VIN not found error handling
- [ ] Database transaction rollback on failure

---

## File Locations

| Component | Path |
|-----------|------|
| Controller | `src/ZoomLoop.Api/Controllers/VehicleController.cs` |
| Handler | `src/ZoomLoop.Api/Features/Vehicles/VehicleIngestHandler.cs` |
| Request/Response | `src/ZoomLoop.Api/Features/Vehicles/VehicleIngest.cs` |
| Service Interface | `src/ZoomLoop.Core/Services/VehicleIngestion/IVehicleIngestionService.cs` |
| Service Implementation | `src/ZoomLoop.Core/Services/VehicleIngestion/VehicleIngestionService.cs` |
| Configuration | `src/ZoomLoop.Api/ConfigureServices.cs` |
| Database Context | `src/ZoomLoop.Infrastructure/ZoomLoopDbContext.cs` |
| Entities | `src/ZoomLoop.Core/Models/Vehicle.cs`, `Make.cs`, `VehicleModel.cs`, `VehicleImage.cs` |
| DTOs | `src/ZoomLoop.Api/Features/Vehicles/VehicleDto.cs` |
| Unit Tests | `tests/ZoomLoop.UnitTests/Features/Vehicles/VehicleIngestTests.cs` |
