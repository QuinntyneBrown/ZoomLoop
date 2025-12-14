// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Api.Features.Financing;
using ZoomLoop.Core.Services.Financing;

namespace ZoomLoop.UnitTests.Features.Financing;

[TestFixture]
public class CalculateFinancingHandlerTests
{
    private CalculateFinancingHandler _handler = default!;
    private FinancingCalculator _calculator = default!;

    [SetUp]
    public void Setup()
    {
        _calculator = new FinancingCalculator();
        _handler = new CalculateFinancingHandler(_calculator);
    }

    [Test]
    public async Task Handle_ValidRequest_ReturnsCorrectCalculation()
    {
        // Arrange
        var request = new CalculateFinancingRequest(
            VehiclePrice: 30000m,
            DownPayment: 5000m,
            TradeInValue: 0m,
            Fees: 1000m,
            FinanceFees: true,
            Region: "ON",
            CustomTaxRate: null
        );

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.VehiclePrice, Is.EqualTo(30000m));
        Assert.That(response.DownPayment, Is.EqualTo(5000m));
        Assert.That(response.TradeInValue, Is.EqualTo(0m));
        Assert.That(response.Fees, Is.EqualTo(1000m));
        Assert.That(response.FeesFinanced, Is.True);
        Assert.That(response.TaxRate, Is.EqualTo(0.13m));
        Assert.That(response.TaxableAmount, Is.EqualTo(26000m));
        Assert.That(response.TaxAmount, Is.EqualTo(3380m));
        Assert.That(response.FinancedPrincipal, Is.EqualTo(29380m));
        Assert.That(response.Region, Is.EqualTo("ON"));
    }

    [Test]
    public async Task Handle_WithCustomTaxRate_UsesCustomRate()
    {
        // Arrange
        var request = new CalculateFinancingRequest(
            VehiclePrice: 25000m,
            DownPayment: 5000m,
            TradeInValue: 0m,
            Fees: 500m,
            FinanceFees: true,
            Region: "ON",
            CustomTaxRate: 0.10m
        );

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.TaxRate, Is.EqualTo(0.10m));  // Custom rate, not ON's 13%
        Assert.That(response.TaxAmount, Is.EqualTo(2050m));  // (25000 - 5000 + 500) * 0.10
    }

    [Test]
    public async Task Handle_WithFeesNotFinanced_ExcludesFeesFromTaxableAmount()
    {
        // Arrange
        var request = new CalculateFinancingRequest(
            VehiclePrice: 30000m,
            DownPayment: 5000m,
            TradeInValue: 0m,
            Fees: 1000m,
            FinanceFees: false,
            Region: "ON",
            CustomTaxRate: null
        );

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.FeesFinanced, Is.False);
        Assert.That(response.TaxableAmount, Is.EqualTo(25000m));  // Fees not included
        Assert.That(response.TaxAmount, Is.EqualTo(3250m));
        Assert.That(response.FinancedPrincipal, Is.EqualTo(28250m));
    }

    [Test]
    public void Handle_NullCalculator_ThrowsArgumentNullException()
    {
        // Arrange & Act & Assert
        Assert.Throws<ArgumentNullException>(() => new CalculateFinancingHandler(null!));
    }
}
