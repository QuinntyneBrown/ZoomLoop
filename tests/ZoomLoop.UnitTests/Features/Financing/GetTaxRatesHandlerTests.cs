// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Api.Features.Financing;

namespace ZoomLoop.UnitTests.Features.Financing;

[TestFixture]
public class GetTaxRatesHandlerTests
{
    private GetTaxRatesHandler _handler = default!;

    [SetUp]
    public void Setup()
    {
        _handler = new GetTaxRatesHandler();
    }

    [Test]
    public async Task Handle_ReturnsAllTaxRates()
    {
        // Arrange
        var request = new GetTaxRatesRequest();

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.TaxRates, Is.Not.Null);
        Assert.That(response.TaxRates.Count, Is.GreaterThanOrEqualTo(13));
    }

    [Test]
    public async Task Handle_ContainsCommonProvinces()
    {
        // Arrange
        var request = new GetTaxRatesRequest();

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.TaxRates.ContainsKey("ON"), Is.True);
        Assert.That(response.TaxRates.ContainsKey("BC"), Is.True);
        Assert.That(response.TaxRates.ContainsKey("AB"), Is.True);
        Assert.That(response.TaxRates.ContainsKey("QC"), Is.True);
    }

    [Test]
    public async Task Handle_AllRatesAreValid()
    {
        // Arrange
        var request = new GetTaxRatesRequest();

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        foreach (var rate in response.TaxRates.Values)
        {
            Assert.That(rate, Is.GreaterThan(0m));
            Assert.That(rate, Is.LessThanOrEqualTo(1m));  // Tax rates should be 0-100% (0-1)
        }
    }
}
