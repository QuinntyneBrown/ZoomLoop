# ZoomLoop.Testing

This project provides test fakes and utilities for testing ZoomLoop components without requiring external dependencies or services.

## Purpose

The ZoomLoop.Testing library contains fake implementations of external service interfaces, allowing unit and integration tests to run without:
- Azure service credentials
- Network connectivity
- External API calls
- Real service costs

## Test Fakes

### Vehicle Ingestion Fakes

Located in `Services/VehicleIngestion/`:

#### FakeAzureVisionService

Fake implementation of `IAzureVisionService` for testing Azure AI Vision interactions without real Azure calls.

**Features:**
- Configurable via constructor function
- Default implementation that returns empty results
- Supports custom responses for different test scenarios

**Usage:**
```csharp
// Use default behavior
var fakeVision = new FakeAzureVisionService();

// Use custom behavior
var fakeVision = new FakeAzureVisionService((imageData, features) =>
{
    // Return custom test data
    return CreateTestImageAnalysisResult();
});
```

#### FakeAzureOpenAIService

Fake implementation of `IAzureOpenAIService` for testing Azure OpenAI interactions without real Azure calls.

**Features:**
- Configurable via constructor function
- Smart default responses based on message content
- Automatically returns appropriate JSON for VIN decode, condition analysis, and description requests

**Usage:**
```csharp
// Use default behavior (smart responses)
var fakeOpenAI = new FakeAzureOpenAIService();

// Use custom behavior
var fakeOpenAI = new FakeAzureOpenAIService(messages =>
{
    // Return custom JSON response
    return "{\"year\": 2024, \"make\": \"Honda\", \"model\": \"Accord\"}";
});
```

## Using in Tests

### Add Project Reference

In your test project's `.csproj` file:

```xml
<ItemGroup>
  <ProjectReference Include="..\ZoomLoop.Testing\ZoomLoop.Testing.csproj" />
</ItemGroup>
```

### Example Test

```csharp
using ZoomLoop.Testing.Services.VehicleIngestion;
using ZoomLoop.Core.Services.VehicleIngestion;

[Test]
public async Task IngestVehicleAsync_WithFakes_ShouldWork()
{
    // Arrange
    var fakeVision = new FakeAzureVisionService();
    var fakeOpenAI = new FakeAzureOpenAIService();
    var service = new VehicleIngestionService(fakeVision, fakeOpenAI);
    
    // Act
    var result = await service.IngestVehicleAsync(request);
    
    // Assert
    Assert.That(result, Is.Not.Null);
}
```

## Benefits

- ✅ **Fast**: No network calls, tests run in milliseconds
- ✅ **Reliable**: No external dependencies, tests always work
- ✅ **Cost-free**: No Azure service charges for testing
- ✅ **Isolated**: Tests focus on your code, not external services
- ✅ **Configurable**: Customize behavior for different test scenarios

## Adding New Fakes

When adding new fake implementations:

1. Create the fake in the appropriate namespace under `Services/`
2. Implement the interface from `ZoomLoop.Core`
3. Provide a default implementation and optional configuration
4. Document the fake in this README

## Dependencies

This project only depends on:
- Azure SDK packages (for interface definitions)
- ZoomLoop.Core (for interface definitions)

It does **not** include:
- Test frameworks (NUnit, xUnit, etc.) - consumers add these
- Mocking frameworks - we provide real fakes, not mocks
- Other testing utilities - keeps the library focused
