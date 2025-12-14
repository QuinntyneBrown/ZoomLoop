// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.VehicleValuation;
using ZoomLoop.Testing.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Services.VehicleValuation;

[TestFixture]
public class VehicleValuationServiceTests
{
    [Test]
    public void Constructor_ShouldInitializeService()
    {
        // Arrange & Act
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleValuationService(fakeOpenAIService);

        // Assert
        Assert.That(service, Is.Not.Null);
    }

    [Test]
    public void GetVehicleInfoByVinAsync_WithNullVin_ShouldThrowArgumentException()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleValuationService(fakeOpenAIService);

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.GetVehicleInfoByVinAsync(null!));
    }

    [Test]
    public void GetVehicleInfoByVinAsync_WithEmptyVin_ShouldThrowArgumentException()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleValuationService(fakeOpenAIService);

        // Act & Assert
        Assert.ThrowsAsync<ArgumentException>(async () =>
            await service.GetVehicleInfoByVinAsync(string.Empty));
    }

    [Test]
    public async Task GetVehicleInfoByVinAsync_WithValidVin_ShouldReturnVehicleInfo()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService(_ =>
            "{\"year\": 2020, \"make\": \"Honda\", \"model\": \"Civic\"}");
        var service = new VehicleValuationService(fakeOpenAIService);

        // Act
        var result = await service.GetVehicleInfoByVinAsync("1HGBH41JXMN109186");

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Year, Is.EqualTo(2020));
        Assert.That(result.Make, Is.EqualTo("Honda"));
        Assert.That(result.Model, Is.EqualTo("Civic"));
    }

    [Test]
    public void GetVehicleValuationAsync_WithNullRequest_ShouldThrowArgumentNullException()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService();
        var service = new VehicleValuationService(fakeOpenAIService);

        // Act & Assert
        Assert.ThrowsAsync<ArgumentNullException>(async () =>
            await service.GetVehicleValuationAsync(null!));
    }

    [Test]
    public async Task GetVehicleValuationAsync_WithValidRequest_ShouldReturnValuation()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService(_ =>
            "{\"fairValue\": 25000.00, \"explanation\": \"This vehicle is in excellent condition with low mileage.\"}");
        var service = new VehicleValuationService(fakeOpenAIService);

        var request = new Core.Services.VehicleValuation.VehicleValuationRequest
        {
            Vin = "1HGBH41JXMN109186",
            Year = 2020,
            Make = "Honda",
            Model = "Civic",
            PostalCode = "M5H 2N2",
            Kilometers = 50000,
            Accidents = 0,
            InteriorCondition = "Excellent",
            ExteriorCondition = "Excellent"
        };

        // Act
        var result = await service.GetVehicleValuationAsync(request);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.FairValue, Is.EqualTo(25000.00m));
        Assert.That(result.Explanation, Is.Not.Empty);
    }
}
