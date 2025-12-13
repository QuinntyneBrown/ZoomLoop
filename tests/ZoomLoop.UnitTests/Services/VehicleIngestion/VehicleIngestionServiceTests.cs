// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleIngestion;

[TestFixture]
public class VehicleIngestionServiceTests
{
    [Test]
    public void Constructor_ShouldInitializeService()
    {
        // Arrange & Act
        var service = new VehicleIngestionService(
            "https://test.cognitiveservices.azure.com/",
            "test-vision-key",
            "https://test.openai.azure.com/",
            "test-openai-key",
            "gpt-4o");

        // Assert
        Assert.That(service, Is.Not.Null);
    }

    [Test]
    public void IngestVehicleAsync_WithNullImages_ShouldThrowArgumentException()
    {
        // Arrange
        var service = new VehicleIngestionService(
            "https://test.cognitiveservices.azure.com/",
            "test-vision-key",
            "https://test.openai.azure.com/",
            "test-openai-key",
            "gpt-4o");

        var request = new VehicleIngestionRequest { Images = null! };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.IngestVehicleAsync(request));
    }

    [Test]
    public void IngestVehicleAsync_WithEmptyImages_ShouldThrowArgumentException()
    {
        // Arrange
        var service = new VehicleIngestionService(
            "https://test.cognitiveservices.azure.com/",
            "test-vision-key",
            "https://test.openai.azure.com/",
            "test-openai-key",
            "gpt-4o");

        var request = new VehicleIngestionRequest { Images = Array.Empty<byte[]>() };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.IngestVehicleAsync(request));
    }
}
