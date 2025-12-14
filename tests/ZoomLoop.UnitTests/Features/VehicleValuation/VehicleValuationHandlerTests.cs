// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Api.Features.VehicleValuation;
using ZoomLoop.Core.Services.VehicleValuation;
using ZoomLoop.Testing.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Features.VehicleValuation;

[TestFixture]
public class GetVehicleByVinHandlerTests
{
    [Test]
    public async Task Handle_ShouldReturnVehicleInfo()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService(_ =>
            "{\"year\": 2021, \"make\": \"Ford\", \"model\": \"F-150\"}");
        var valuationService = new VehicleValuationService(fakeOpenAIService);
        var handler = new GetVehicleByVinHandler(valuationService);
        var request = new GetVehicleByVinRequest("1FTFW1E80MFC12345");

        // Act
        var response = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response, Is.Not.Null);
        Assert.That(response.Year, Is.EqualTo(2021));
        Assert.That(response.Make, Is.EqualTo("Ford"));
        Assert.That(response.Model, Is.EqualTo("F-150"));
    }
}

[TestFixture]
public class GetVehicleValuationHandlerTests
{
    [Test]
    public async Task Handle_ShouldReturnValuation()
    {
        // Arrange
        var fakeOpenAIService = new FakeAzureOpenAIService(_ =>
            "{\"fairValue\": 35000.50, \"explanation\": \"This F-150 is in excellent condition with low kilometers and no accidents. Market value is strong in the given postal code.\"}");
        var valuationService = new VehicleValuationService(fakeOpenAIService);
        var handler = new GetVehicleValuationHandler(valuationService);
        var request = new GetVehicleValuationRequest(
            Vin: "1FTFW1E80MFC12345",
            Year: 2021,
            Make: "Ford",
            Model: "F-150",
            PostalCode: "M5H 2N2",
            Kilometers: 45000,
            Accidents: 0,
            InteriorCondition: "Excellent",
            ExteriorCondition: "Excellent"
        );

        // Act
        var response = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response, Is.Not.Null);
        Assert.That(response.FairValue, Is.EqualTo(35000.50m));
        Assert.That(response.Explanation, Is.Not.Empty);
        Assert.That(response.Explanation, Does.Contain("F-150"));
    }
}
