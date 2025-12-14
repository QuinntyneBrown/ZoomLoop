// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.Financing;

namespace ZoomLoop.UnitTests.Services.Financing;

[TestFixture]
public class TaxConfigurationTests
{
    [Test]
    public void GetTaxRate_Ontario_Returns13Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("ON");

        // Assert
        Assert.That(rate, Is.EqualTo(0.13m));
    }

    [Test]
    public void GetTaxRate_BritishColumbia_Returns12Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("BC");

        // Assert
        Assert.That(rate, Is.EqualTo(0.12m));
    }

    [Test]
    public void GetTaxRate_Alberta_Returns5Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("AB");

        // Assert
        Assert.That(rate, Is.EqualTo(0.05m));
    }

    [Test]
    public void GetTaxRate_Quebec_ReturnsCompoundRate()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("QC");

        // Assert
        Assert.That(rate, Is.EqualTo(0.14975m));
    }

    [Test]
    public void GetTaxRate_NovaScotia_Returns15Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("NS");

        // Assert
        Assert.That(rate, Is.EqualTo(0.15m));
    }

    [Test]
    public void GetTaxRate_NewBrunswick_Returns15Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("NB");

        // Assert
        Assert.That(rate, Is.EqualTo(0.15m));
    }

    [Test]
    public void GetTaxRate_Saskatchewan_Returns11Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("SK");

        // Assert
        Assert.That(rate, Is.EqualTo(0.11m));
    }

    [Test]
    public void GetTaxRate_Manitoba_Returns12Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("MB");

        // Assert
        Assert.That(rate, Is.EqualTo(0.12m));
    }

    [Test]
    public void GetTaxRate_PrinceEdwardIsland_Returns15Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("PE");

        // Assert
        Assert.That(rate, Is.EqualTo(0.15m));
    }

    [Test]
    public void GetTaxRate_Newfoundland_Returns15Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("NL");

        // Assert
        Assert.That(rate, Is.EqualTo(0.15m));
    }

    [Test]
    public void GetTaxRate_NorthwestTerritories_Returns5Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("NT");

        // Assert
        Assert.That(rate, Is.EqualTo(0.05m));
    }

    [Test]
    public void GetTaxRate_Nunavut_Returns5Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("NU");

        // Assert
        Assert.That(rate, Is.EqualTo(0.05m));
    }

    [Test]
    public void GetTaxRate_Yukon_Returns5Percent()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("YT");

        // Assert
        Assert.That(rate, Is.EqualTo(0.05m));
    }

    [Test]
    public void GetTaxRate_CaseInsensitive_ReturnsCorrectRate()
    {
        // Act
        var lowerRate = TaxConfiguration.GetTaxRate("on");
        var upperRate = TaxConfiguration.GetTaxRate("ON");
        var mixedRate = TaxConfiguration.GetTaxRate("On");

        // Assert
        Assert.That(lowerRate, Is.EqualTo(0.13m));
        Assert.That(upperRate, Is.EqualTo(0.13m));
        Assert.That(mixedRate, Is.EqualTo(0.13m));
    }

    [Test]
    public void GetTaxRate_WithWhitespace_ReturnsCorrectRate()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("  ON  ");

        // Assert
        Assert.That(rate, Is.EqualTo(0.13m));
    }

    [Test]
    public void GetTaxRate_UnknownRegion_ReturnsZero()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate("XX");

        // Assert
        Assert.That(rate, Is.EqualTo(0m));
    }

    [Test]
    public void GetTaxRate_NullRegion_ReturnsZero()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate(null);

        // Assert
        Assert.That(rate, Is.EqualTo(0m));
    }

    [Test]
    public void GetTaxRate_EmptyRegion_ReturnsZero()
    {
        // Act
        var rate = TaxConfiguration.GetTaxRate(string.Empty);

        // Assert
        Assert.That(rate, Is.EqualTo(0m));
    }

    [Test]
    public void IsSupportedRegion_ValidRegion_ReturnsTrue()
    {
        // Act
        var isSupported = TaxConfiguration.IsSupportedRegion("ON");

        // Assert
        Assert.That(isSupported, Is.True);
    }

    [Test]
    public void IsSupportedRegion_InvalidRegion_ReturnsFalse()
    {
        // Act
        var isSupported = TaxConfiguration.IsSupportedRegion("XX");

        // Assert
        Assert.That(isSupported, Is.False);
    }

    [Test]
    public void IsSupportedRegion_NullRegion_ReturnsFalse()
    {
        // Act
        var isSupported = TaxConfiguration.IsSupportedRegion(null);

        // Assert
        Assert.That(isSupported, Is.False);
    }

    [Test]
    public void IsSupportedRegion_EmptyRegion_ReturnsFalse()
    {
        // Act
        var isSupported = TaxConfiguration.IsSupportedRegion(string.Empty);

        // Assert
        Assert.That(isSupported, Is.False);
    }

    [Test]
    public void IsSupportedRegion_CaseInsensitive_ReturnsTrue()
    {
        // Act
        var isSupported = TaxConfiguration.IsSupportedRegion("on");

        // Assert
        Assert.That(isSupported, Is.True);
    }

    [Test]
    public void GetAllTaxRates_ReturnsAllProvinces()
    {
        // Act
        var rates = TaxConfiguration.GetAllTaxRates();

        // Assert
        Assert.That(rates.Count, Is.GreaterThanOrEqualTo(13));  // All Canadian provinces and territories
        Assert.That(rates.ContainsKey("ON"), Is.True);
        Assert.That(rates.ContainsKey("BC"), Is.True);
        Assert.That(rates.ContainsKey("AB"), Is.True);
        Assert.That(rates.ContainsKey("QC"), Is.True);
    }

    [Test]
    public void GetAllTaxRates_AllRatesArePositive()
    {
        // Act
        var rates = TaxConfiguration.GetAllTaxRates();

        // Assert
        foreach (var rate in rates.Values)
        {
            Assert.That(rate, Is.GreaterThan(0m));
        }
    }
}
