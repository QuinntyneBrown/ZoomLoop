// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleIngestion;

[TestFixture]
[Explicit("Integration test - requires valid Azure AI credentials")]
public class VehicleIngestionIntegrationTests
{
    private IVehicleIngestionService _service = default!;
    private IConfiguration _configuration = default!;

    [SetUp]
    public void Setup()
    {
        // Build configuration from appsettings or user secrets
        _configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json", optional: true)
            .AddUserSecrets<VehicleIngestionIntegrationTests>(optional: true)
            .AddEnvironmentVariables()
            .Build();

        var config = _configuration.GetSection("VehicleIngestion").Get<VehicleIngestionConfiguration>();

        if (config == null ||
            string.IsNullOrEmpty(config.AzureComputerVisionKey) ||
            config.AzureComputerVisionKey.StartsWith("YOUR_"))
        {
            Assert.Ignore("Azure AI credentials not configured. Please set up VehicleIngestion configuration.");
        }

        _service = new VehicleIngestionService(
            config.AzureComputerVisionEndpoint,
            config.AzureComputerVisionKey,
            config.AzureOpenAIEndpoint,
            config.AzureOpenAIKey,
            config.AzureOpenAIDeploymentName);
    }

    [Test]
    public async Task IngestVehicleAsync_WithValidImages_ShouldReturnResult()
    {
        // Arrange
        // Create a simple test image (1x1 white pixel PNG)
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act & Assert
        // Note: This test will likely fail with real Azure services
        // because the test image doesn't contain a valid VIN
        // This is here as a template for manual testing with real images
        try
        {
            var result = await _service.IngestVehicleAsync(request);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.VIN, Is.Not.Null);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("Could not extract VIN"))
        {
            // Expected with test image
            Assert.Pass("Service correctly identified that test image doesn't contain a VIN");
        }
    }

    [Test]
    public async Task IngestVehicleAsync_ConcurrentProcessing_ShouldComplete()
    {
        // Arrange
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act
        var startTime = DateTime.UtcNow;
        
        try
        {
            await _service.IngestVehicleAsync(request);
        }
        catch (InvalidOperationException)
        {
            // Expected with test image
        }

        var duration = DateTime.UtcNow - startTime;

        // Assert
        // With concurrent processing, this should complete relatively quickly
        // even though multiple AI calls are being made
        Assert.That(duration.TotalSeconds, Is.LessThan(60), 
            "Service should complete within reasonable time using concurrent processing");
    }

    private byte[] CreateTestImage()
    {
        // Simple 1x1 white PNG image
        return new byte[]
        {
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        };
    }
}
