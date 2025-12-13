# Vehicle Ingestion Service

## Overview

The Vehicle Ingestion Service is a comprehensive solution for automatically extracting vehicle information from images using Azure AI services. It processes vehicle images to extract VIN numbers, determine vehicle details, and generate descriptions.

## Azure AI Services Required

### 1. Azure AI Vision (Computer Vision)

Used for:
- Optical character recognition (OCR) to extract VIN numbers from vehicle images
- Image captioning and tagging to analyze vehicle features
- Dense captions for detailed vehicle descriptions
- Object detection for identifying vehicle components

**Setup:**
- Create an Azure AI Vision resource in the Azure Portal
- Copy the endpoint and key to your configuration

**Documentation:**
- [Azure AI Vision Overview](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview)
- [OCR in Computer Vision](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview-ocr)
- [Quickstart: Image Analysis](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/quickstarts-sdk/image-analysis-client-library)
- [Image Captioning](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/concept-describe-images-40)

**Video Tutorials:**
- [Azure Computer Vision Tutorial](https://www.youtube.com/watch?v=xD6z0_PQSRY)
- [OCR with Azure Computer Vision](https://www.youtube.com/watch?v=zxUqaXOWDdY)

### 2. Azure OpenAI Service

Used for:
- Decoding VIN numbers to determine Year, Make, and Model
- Interpreting image analysis results to assess vehicle condition
- Generating compelling 200-word vehicle descriptions based on image analysis

**Note:** The service uses Azure AI Vision for image analysis (captioning, tagging, object detection) and then uses Azure OpenAI GPT-4o to interpret those results and generate structured outputs and descriptions.

**Setup:**
- Create an Azure OpenAI resource in the Azure Portal
- Deploy a GPT-4o model (recommended) or GPT-4 model
- Copy the endpoint, key, and deployment name to your configuration

**Documentation:**
- [Azure OpenAI Service Overview](https://learn.microsoft.com/en-us/azure/ai-services/openai/overview)
- [GPT-4 Turbo with Vision](https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/models#gpt-4-and-gpt-4-turbo-models)
- [Quickstart: Get started using GPT-4o](https://learn.microsoft.com/en-us/azure/ai-services/openai/gpt-4o-quickstart)

**Video Tutorials:**
- [Azure OpenAI Service Introduction](https://www.youtube.com/watch?v=J8ZkXr5kAYs)
- [Getting Started with Azure OpenAI](https://www.youtube.com/watch?v=Xvwx4p7jUWM)
- [GPT-4 Vision API Tutorial](https://www.youtube.com/watch?v=UppPR5r1QHs)

## Configuration

### Application Settings

Add the following configuration to your `appsettings.json`:

```json
{
  "VehicleIngestion": {
    "AzureComputerVisionEndpoint": "https://YOUR_VISION_RESOURCE.cognitiveservices.azure.com/",
    "AzureComputerVisionKey": "YOUR_VISION_KEY",
    "AzureOpenAIEndpoint": "https://YOUR_OPENAI_RESOURCE.openai.azure.com/",
    "AzureOpenAIKey": "YOUR_OPENAI_KEY",
    "AzureOpenAIDeploymentName": "gpt-4o"
  }
}
```

### Secure Storage (Production)

For production environments, **never store API keys in appsettings.json**. Use one of the following secure storage options:

#### Option 1: Azure Key Vault (Recommended)

```bash
# Store keys in Azure Key Vault
az keyvault secret set --vault-name "your-keyvault" --name "VehicleIngestion--AzureComputerVisionKey" --value "YOUR_KEY"
az keyvault secret set --vault-name "your-keyvault" --name "VehicleIngestion--AzureOpenAIKey" --value "YOUR_KEY"
```

Then configure your application to use Azure Key Vault:

```csharp
builder.Configuration.AddAzureKeyVault(
    new Uri($"https://your-keyvault.vault.azure.net/"),
    new DefaultAzureCredential());
```

**Documentation:**
- [Use Azure Key Vault in ASP.NET Core](https://learn.microsoft.com/en-us/aspnet/core/security/key-vault-configuration)

#### Option 2: User Secrets (Development)

For local development:

```bash
cd src/ZoomLoop.Api
dotnet user-secrets set "VehicleIngestion:AzureComputerVisionKey" "YOUR_KEY"
dotnet user-secrets set "VehicleIngestion:AzureOpenAIKey" "YOUR_KEY"
```

**Documentation:**
- [Safe storage of app secrets in development](https://learn.microsoft.com/en-us/aspnet/core/security/app-secrets)

#### Option 3: Environment Variables

```bash
export VehicleIngestion__AzureComputerVisionKey="YOUR_KEY"
export VehicleIngestion__AzureOpenAIKey="YOUR_KEY"
```

## Usage

### Basic Usage

```csharp
public class MyController : ControllerBase
{
    private readonly IVehicleIngestionService _vehicleIngestionService;

    public MyController(IVehicleIngestionService vehicleIngestionService)
    {
        _vehicleIngestionService = vehicleIngestionService;
    }

    [HttpPost("ingest")]
    public async Task<IActionResult> IngestVehicle([FromForm] IFormFileCollection files)
    {
        var images = new List<byte[]>();
        
        foreach (var file in files)
        {
            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            images.Add(memoryStream.ToArray());
        }

        var request = new VehicleIngestionRequest
        {
            Images = images.ToArray()
        };

        var result = await _vehicleIngestionService.IngestVehicleAsync(request);
        
        return Ok(result);
    }
}
```

## How It Works

The Vehicle Ingestion Service processes vehicle images through a multi-stage pipeline:

### Stage 1: VIN Extraction
1. Iterates through all provided images
2. Uses Azure AI Vision OCR to extract text from each image
3. Searches for a 17-character alphanumeric string (VIN format)
4. Returns the first valid VIN found

### Stage 2: Concurrent Processing
Once the VIN is extracted, the service performs three operations in parallel:

**A. VIN Decoding**
- Sends the VIN to Azure OpenAI GPT-4o
- Requests structured JSON output with Year, Make, and Model
- Parses the response to extract vehicle information

**B. Vehicle Details Analysis**
- Analyzes up to 3 images using Azure AI Vision
- Extracts captions, tags, and object detection results
- Sends analysis results to Azure OpenAI for interpretation
- Returns structured assessment of interior/exterior condition and door count

**C. Description Generation**
- Analyzes up to 5 images using Azure AI Vision
- Extracts detailed captions and feature tags
- Sends comprehensive image analysis to Azure OpenAI
- Generates a compelling 200-word marketing description

### Stage 3: Result Aggregation
All concurrent operations complete and results are combined into a single `VehicleIngestionResult` object.

### Result Structure

The service returns a `VehicleIngestionResult` containing:

```csharp
public class VehicleIngestionResult
{
    public string VIN { get; set; }                    // Extracted VIN number
    public int Year { get; set; }                      // Vehicle year
    public string Make { get; set; }                   // Vehicle manufacturer
    public string Model { get; set; }                  // Vehicle model
    public string InteriorCondition { get; set; }      // Interior condition assessment
    public string ExteriorCondition { get; set; }      // Exterior condition assessment
    public int NumberOfDoors { get; set; }             // Number of doors
    public string Description { get; set; }            // 200-word vehicle description
}
```

## Features

### Concurrent Processing

The service processes multiple AI operations concurrently for optimal performance:
- VIN decoding (Year/Make/Model extraction)
- Image analysis (condition and features)
- Description generation

All operations run in parallel after VIN extraction is complete.

### Error Handling

- **No VIN Found**: Throws `InvalidOperationException` if VIN cannot be extracted from any image
- **Invalid Images**: Continues processing remaining images if one fails
- **API Failures**: Propagates exceptions from Azure AI services for proper error handling

## Testing

Unit tests and integration tests are located in:
- `tests/ZoomLoop.UnitTests/Services/VehicleIngestion/`

Run tests with:
```bash
dotnet test
```

## Cost Considerations

- **Azure AI Vision**: Charged per 1,000 transactions
- **Azure OpenAI**: Charged per token (input and output)
- See [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/) for estimates

## Additional Resources

### General Azure AI Documentation
- [Azure AI Services Documentation](https://learn.microsoft.com/en-us/azure/ai-services/)
- [Azure AI Services Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/)

### Video Tutorials
- [Azure AI Services Overview](https://www.youtube.com/watch?v=M4DHcL7LBnU)
- [Building Intelligent Apps with Azure AI](https://www.youtube.com/watch?v=WNPE0VEkOlw)

### Best Practices
- [Azure AI Responsible AI](https://learn.microsoft.com/en-us/azure/ai-services/responsible-use-of-ai-overview)
- [Security best practices for Azure AI](https://learn.microsoft.com/en-us/azure/ai-services/security-features)
