// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.Financing;

namespace ZoomLoop.UnitTests.Services.Financing;

[TestFixture]
public class FinancingCalculatorTests
{
    private FinancingCalculator _calculator = default!;

    [SetUp]
    public void Setup()
    {
        _calculator = new FinancingCalculator();
    }

    [Test]
    public void CalculateFinancing_WithNullOptions_ThrowsArgumentNullException()
    {
        // Arrange & Act & Assert
        Assert.Throws<ArgumentNullException>(() => _calculator.CalculateFinancing(null!));
    }

    [Test]
    public void CalculateFinancing_WithNegativeVehiclePrice_ThrowsArgumentException()
    {
        // Arrange
        var options = new FinancingOptions
        {
            VehiclePrice = -1000m
        };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _calculator.CalculateFinancing(options));
        Assert.That(ex!.Message, Does.Contain("Vehicle price cannot be negative"));
    }

    [Test]
    public void CalculateFinancing_WithNegativeDownPayment_ThrowsArgumentException()
    {
        // Arrange
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = -1000m
        };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _calculator.CalculateFinancing(options));
        Assert.That(ex!.Message, Does.Contain("Down payment cannot be negative"));
    }

    [Test]
    public void CalculateFinancing_WithNegativeFees_ThrowsArgumentException()
    {
        // Arrange
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            Fees = -500m
        };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _calculator.CalculateFinancing(options));
        Assert.That(ex!.Message, Does.Contain("Fees cannot be negative"));
    }

    [Test]
    public void CalculateFinancing_OntarioWithFeesFinanced_CalculatesCorrectPrincipal()
    {
        // Arrange - Ontario 13% HST
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 1000m,
            FinanceFees = true,
            Region = "ON"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (30000 - 5000 - 0 + 1000) = 26000
        // Tax = 26000 * 0.13 = 3380
        // Principal = 30000 - 5000 - 0 + 1000 + 3380 = 29380
        Assert.That(result.TaxableAmount, Is.EqualTo(26000m));
        Assert.That(result.TaxRate, Is.EqualTo(0.13m));
        Assert.That(result.TaxAmount, Is.EqualTo(3380m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(29380m));
        Assert.That(result.FeesFinanced, Is.True);
    }

    [Test]
    public void CalculateFinancing_OntarioWithFeesNotFinanced_CalculatesCorrectPrincipal()
    {
        // Arrange - Ontario 13% HST, fees not financed
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 1000m,
            FinanceFees = false,
            Region = "ON"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (30000 - 5000 - 0) = 25000 (fees not included)
        // Tax = 25000 * 0.13 = 3250
        // Principal = 30000 - 5000 - 0 + 0 + 3250 = 28250 (fees not added)
        Assert.That(result.TaxableAmount, Is.EqualTo(25000m));
        Assert.That(result.TaxRate, Is.EqualTo(0.13m));
        Assert.That(result.TaxAmount, Is.EqualTo(3250m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(28250m));
        Assert.That(result.FeesFinanced, Is.False);
    }

    [Test]
    public void CalculateFinancing_BritishColumbia_CalculatesCorrectPrincipal()
    {
        // Arrange - BC 12% (5% GST + 7% PST)
        var options = new FinancingOptions
        {
            VehiclePrice = 40000m,
            DownPayment = 8000m,
            TradeInValue = 5000m,
            Fees = 1500m,
            FinanceFees = true,
            Region = "BC"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (40000 - 8000 - 5000 + 1500) = 28500
        // Tax = 28500 * 0.12 = 3420
        // Principal = 40000 - 8000 - 5000 + 1500 + 3420 = 31920
        Assert.That(result.TaxableAmount, Is.EqualTo(28500m));
        Assert.That(result.TaxRate, Is.EqualTo(0.12m));
        Assert.That(result.TaxAmount, Is.EqualTo(3420m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(31920m));
    }

    [Test]
    public void CalculateFinancing_Alberta_CalculatesCorrectPrincipal()
    {
        // Arrange - Alberta 5% GST only
        var options = new FinancingOptions
        {
            VehiclePrice = 35000m,
            DownPayment = 7000m,
            TradeInValue = 3000m,
            Fees = 800m,
            FinanceFees = true,
            Region = "AB"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (35000 - 7000 - 3000 + 800) = 25800
        // Tax = 25800 * 0.05 = 1290
        // Principal = 35000 - 7000 - 3000 + 800 + 1290 = 27090
        Assert.That(result.TaxableAmount, Is.EqualTo(25800m));
        Assert.That(result.TaxRate, Is.EqualTo(0.05m));
        Assert.That(result.TaxAmount, Is.EqualTo(1290m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(27090m));
    }

    [Test]
    public void CalculateFinancing_Quebec_CalculatesCorrectPrincipal()
    {
        // Arrange - Quebec 14.975% (5% GST + 9.975% QST compound)
        var options = new FinancingOptions
        {
            VehiclePrice = 25000m,
            DownPayment = 5000m,
            TradeInValue = 2000m,
            Fees = 500m,
            FinanceFees = true,
            Region = "QC"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (25000 - 5000 - 2000 + 500) = 18500
        // Tax = 18500 * 0.14975 = 2770.375
        // Principal = 25000 - 5000 - 2000 + 500 + 2770.375 = 21270.375
        Assert.That(result.TaxableAmount, Is.EqualTo(18500m));
        Assert.That(result.TaxRate, Is.EqualTo(0.14975m));
        Assert.That(result.TaxAmount, Is.EqualTo(2770.375m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(21270.375m));
    }

    [Test]
    public void CalculateFinancing_NovaScotia_CalculatesCorrectPrincipal()
    {
        // Arrange - Nova Scotia 15% HST
        var options = new FinancingOptions
        {
            VehiclePrice = 28000m,
            DownPayment = 4000m,
            TradeInValue = 1000m,
            Fees = 600m,
            FinanceFees = true,
            Region = "NS"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (28000 - 4000 - 1000 + 600) = 23600
        // Tax = 23600 * 0.15 = 3540
        // Principal = 28000 - 4000 - 1000 + 600 + 3540 = 27140
        Assert.That(result.TaxableAmount, Is.EqualTo(23600m));
        Assert.That(result.TaxRate, Is.EqualTo(0.15m));
        Assert.That(result.TaxAmount, Is.EqualTo(3540m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(27140m));
    }

    [Test]
    public void CalculateFinancing_Saskatchewan_CalculatesCorrectPrincipal()
    {
        // Arrange - Saskatchewan 11% (5% GST + 6% PST)
        var options = new FinancingOptions
        {
            VehiclePrice = 32000m,
            DownPayment = 6000m,
            TradeInValue = 4000m,
            Fees = 700m,
            FinanceFees = true,
            Region = "SK"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (32000 - 6000 - 4000 + 700) = 22700
        // Tax = 22700 * 0.11 = 2497
        // Principal = 32000 - 6000 - 4000 + 700 + 2497 = 25197
        Assert.That(result.TaxableAmount, Is.EqualTo(22700m));
        Assert.That(result.TaxRate, Is.EqualTo(0.11m));
        Assert.That(result.TaxAmount, Is.EqualTo(2497m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(25197m));
    }

    [Test]
    public void CalculateFinancing_Manitoba_CalculatesCorrectPrincipal()
    {
        // Arrange - Manitoba 12% (5% GST + 7% RST)
        var options = new FinancingOptions
        {
            VehiclePrice = 27000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 900m,
            FinanceFees = true,
            Region = "MB"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (27000 - 5000 - 0 + 900) = 22900
        // Tax = 22900 * 0.12 = 2748
        // Principal = 27000 - 5000 - 0 + 900 + 2748 = 25648
        Assert.That(result.TaxableAmount, Is.EqualTo(22900m));
        Assert.That(result.TaxRate, Is.EqualTo(0.12m));
        Assert.That(result.TaxAmount, Is.EqualTo(2748m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(25648m));
    }

    [Test]
    public void CalculateFinancing_WithNegativeTradeIn_ReducesPrincipal()
    {
        // Arrange - Trade-in is represented as positive value, reducing principal
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 8000m,  // Positive trade-in reduces amount to finance
            Fees = 500m,
            FinanceFees = true,
            Region = "ON"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (30000 - 5000 - 8000 + 500) = 17500
        // Tax = 17500 * 0.13 = 2275
        // Principal = 30000 - 5000 - 8000 + 500 + 2275 = 19775
        Assert.That(result.TaxableAmount, Is.EqualTo(17500m));
        Assert.That(result.TaxAmount, Is.EqualTo(2275m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(19775m));
    }

    [Test]
    public void CalculateFinancing_WithCustomTaxRate_UsesCustomRate()
    {
        // Arrange - Use custom tax rate instead of region
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 1000m,
            FinanceFees = true,
            Region = "ON",  // ON would be 13%, but custom rate overrides
            CustomTaxRate = 0.08m  // 8% custom rate
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (30000 - 5000 - 0 + 1000) = 26000
        // Tax = 26000 * 0.08 = 2080 (using custom rate)
        // Principal = 30000 - 5000 - 0 + 1000 + 2080 = 28080
        Assert.That(result.TaxableAmount, Is.EqualTo(26000m));
        Assert.That(result.TaxRate, Is.EqualTo(0.08m));
        Assert.That(result.TaxAmount, Is.EqualTo(2080m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(28080m));
    }

    [Test]
    public void CalculateFinancing_WithNoRegion_UsesZeroTax()
    {
        // Arrange - No region specified
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 1000m,
            FinanceFees = true
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount = (30000 - 5000 - 0 + 1000) = 26000
        // Tax = 26000 * 0 = 0
        // Principal = 30000 - 5000 - 0 + 1000 + 0 = 26000
        Assert.That(result.TaxableAmount, Is.EqualTo(26000m));
        Assert.That(result.TaxRate, Is.EqualTo(0m));
        Assert.That(result.TaxAmount, Is.EqualTo(0m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(26000m));
    }

    [Test]
    public void CalculateFinancing_WithUnknownRegion_UsesZeroTax()
    {
        // Arrange - Unknown region
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 1000m,
            FinanceFees = true,
            Region = "XX"  // Unknown region
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        Assert.That(result.TaxRate, Is.EqualTo(0m));
        Assert.That(result.TaxAmount, Is.EqualTo(0m));
    }

    [Test]
    public void CalculateFinancing_CaseInsensitiveRegion_CalculatesCorrectly()
    {
        // Arrange - Test case-insensitive region matching
        var options = new FinancingOptions
        {
            VehiclePrice = 30000m,
            DownPayment = 5000m,
            TradeInValue = 0m,
            Fees = 1000m,
            FinanceFees = true,
            Region = "on"  // lowercase
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        Assert.That(result.TaxRate, Is.EqualTo(0.13m));  // Should match ON (Ontario)
    }

    [Test]
    public void CalculateFinancing_WithTradeInExceedingPrice_ReturnsZeroPrincipal()
    {
        // Arrange - Trade-in value exceeds remaining amount
        var options = new FinancingOptions
        {
            VehiclePrice = 20000m,
            DownPayment = 5000m,
            TradeInValue = 20000m,  // Trade-in exceeds (price - down)
            Fees = 500m,
            FinanceFees = true,
            Region = "ON"
        };

        // Act
        var result = _calculator.CalculateFinancing(options);

        // Assert
        // Taxable amount would be negative, so clamped to 0
        // Tax = 0
        // Principal clamped to 0
        Assert.That(result.TaxableAmount, Is.EqualTo(0m));
        Assert.That(result.TaxAmount, Is.EqualTo(0m));
        Assert.That(result.FinancedPrincipal, Is.EqualTo(0m));
    }
}
