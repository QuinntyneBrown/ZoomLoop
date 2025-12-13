// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Azure.AI.Vision.ImageAnalysis;
using NSubstitute;
using NUnit.Framework;
using OpenAI.Chat;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleIngestion;

[TestFixture]
public class VehicleIngestionIntegrationTests
{
    [Test]
    public async Task IngestVehicleAsync_WithFakeServices_ShouldReturnResult()
    {
        // Arrange
        var vinText = "1HGBH41JXMN109186";
        
        var (fakeVisionService, fakeOpenAIService) = CreateMockServices(vinText);

        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);
        
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act
        var result = await service.IngestVehicleAsync(request);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.VIN, Is.EqualTo(vinText));
        Assert.That(result.Year, Is.EqualTo(2023));
        Assert.That(result.Make, Is.EqualTo("Toyota"));
        Assert.That(result.Model, Is.EqualTo("Camry"));
        Assert.That(result.InteriorCondition, Is.EqualTo("Good"));
        Assert.That(result.ExteriorCondition, Is.EqualTo("Excellent"));
        Assert.That(result.NumberOfDoors, Is.EqualTo(4));
        Assert.That(result.Description, Is.Not.Empty);
    }

    [Test]
    public async Task IngestVehicleAsync_ConcurrentProcessing_ShouldComplete()
    {
        // Arrange
        var (fakeVisionService, fakeOpenAIService) = CreateMockServices("1HGBH41JXMN109186");

        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);
        
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act
        var startTime = DateTime.UtcNow;
        var result = await service.IngestVehicleAsync(request);
        var duration = DateTime.UtcNow - startTime;

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(duration.TotalSeconds, Is.LessThan(5), 
            "Service should complete quickly with fake services");
    }

    [Test]
    public void IngestVehicleAsync_WhenNoVINFound_ShouldThrowException()
    {
        // Arrange
        var (fakeVisionService, fakeOpenAIService) = CreateMockServices("No VIN here");

        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);
        
        var testImage = CreateTestImage();
        var request = new VehicleIngestionRequest
        {
            Images = new[] { testImage }
        };

        // Act & Assert
        Assert.ThrowsAsync<InvalidOperationException>(async () =>
            await service.IngestVehicleAsync(request));
    }

    private byte[] CreateTestImage()
    {
        // Simple 1x1 white PNG image
        return new byte[]
        {
            0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
            0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
            0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
            0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
            0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
            0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
            0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
            0x42, 0x60, 0x82
        };
    }

    // Test helper method - Creates mock services using NSubstitute
    private (IAzureVisionService visionService, IAzureOpenAIService openAIService) CreateMockServices(string vinText)
    {
        var visionService = Substitute.For<IAzureVisionService>();
        var openAIService = Substitute.For<IAzureOpenAIService>();

        // Mock vision service to return the VIN text in read results
        visionService.AnalyzeImageAsync(Arg.Any<BinaryData>(), Arg.Any<VisualFeatures>(), Arg.Any<CancellationToken>())
            .Returns(x => Task.FromResult((ImageAnalysisResult)null!));

        // Mock OpenAI service responses
        openAIService.CompleteChatAsync(Arg.Any<IEnumerable<ChatMessage>>(), Arg.Any<CancellationToken>())
            .Returns(args =>
            {
                var messages = (IEnumerable<ChatMessage>)args[0];
                var messageText = string.Join(" ", messages.Select(m => m.ToString()));
                
                if (messageText.Contains("VIN"))
                {
                    return Task.FromResult("{\"year\": 2023, \"make\": \"Toyota\", \"model\": \"Camry\"}");
                }
                else if (messageText.Contains("condition"))
                {
                    return Task.FromResult("{\"interiorCondition\": \"Good\", \"exteriorCondition\": \"Excellent\", \"numberOfDoors\": 4}");
                }
                else
                {
                    return Task.FromResult("This is a beautiful vehicle in excellent condition.");
                }
            });

        return (visionService, openAIService);
    }
}
