// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleIngestion;
using ZoomLoop.Testing.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleIngestion;

[TestFixture]
public class VehicleIngestionServiceTests
{
    [Test]
    public void Constructor_ShouldInitializeService()
    {
        // Arrange & Act
        var fakeVisionService = new FakeAzureVisionService();
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);

        // Assert
        Assert.That(service, Is.Not.Null);
    }

    [Test]
    public void IngestVehicleAsync_WithNullImages_ShouldThrowArgumentException()
    {
        // Arrange
        var fakeVisionService = new FakeAzureVisionService();
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);

        var request = new VehicleIngestionRequest { Images = null! };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.IngestVehicleAsync(request));
    }

    [Test]
    public void IngestVehicleAsync_WithEmptyImages_ShouldThrowArgumentException()
    {
        // Arrange
        var fakeVisionService = new FakeAzureVisionService();
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleIngestionService(fakeVisionService, fakeOpenAIService);

        var request = new VehicleIngestionRequest { Images = Array.Empty<byte[]>() };

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.IngestVehicleAsync(request));
    }
}
