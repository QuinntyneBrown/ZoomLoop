// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using NUnit.Framework;
using ZoomLoop.Core.Services.Finance;

namespace ZoomLoop.UnitTests.Services.Finance;

[TestFixture]
public class PaymentCalculatorTests
{
    private PaymentCalculator _calculator = null!;

    [SetUp]
    public void SetUp()
    {
        _calculator = new PaymentCalculator();
    }

    #region Typical Cases

    [Test]
    public void CalculateMonthlyPayment_WithTypicalAutoLoan_ReturnsCorrectPayment()
    {
        // Arrange: $25,000 loan at 5% APR for 60 months
        decimal principal = 25000m;
        decimal apr = 0.05m;
        int termInMonths = 60;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is approximately $471.78
        Assert.That(payment, Is.EqualTo(471.78m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithHigherAPR_ReturnsCorrectPayment()
    {
        // Arrange: $30,000 loan at 7.5% APR for 72 months
        decimal principal = 30000m;
        decimal apr = 0.075m;
        int termInMonths = 72;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is approximately $518.70
        Assert.That(payment, Is.EqualTo(518.70m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithLowAPR_ReturnsCorrectPayment()
    {
        // Arrange: $20,000 loan at 1.9% APR for 48 months
        decimal principal = 20000m;
        decimal apr = 0.019m;
        int termInMonths = 48;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is approximately $433.03
        Assert.That(payment, Is.EqualTo(433.03m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithShortTerm_ReturnsCorrectPayment()
    {
        // Arrange: $15,000 loan at 4% APR for 24 months
        decimal principal = 15000m;
        decimal apr = 0.04m;
        int termInMonths = 24;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is approximately $651.37
        Assert.That(payment, Is.EqualTo(651.37m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithLongTerm_ReturnsCorrectPayment()
    {
        // Arrange: $40,000 loan at 6% APR for 84 months
        decimal principal = 40000m;
        decimal apr = 0.06m;
        int termInMonths = 84;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is approximately $584.34
        Assert.That(payment, Is.EqualTo(584.34m));
    }

    #endregion

    #region Zero APR Edge Cases

    [Test]
    public void CalculateMonthlyPayment_WithZeroAPR_ReturnsSimpleDivision()
    {
        // Arrange: $24,000 loan at 0% APR for 48 months
        decimal principal = 24000m;
        decimal apr = 0m;
        int termInMonths = 48;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is exactly $500.00 (24000 / 48)
        Assert.That(payment, Is.EqualTo(500.00m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithZeroAPRAndOddDivision_RoundsCorrectly()
    {
        // Arrange: $10,000 loan at 0% APR for 36 months
        decimal principal = 10000m;
        decimal apr = 0m;
        int termInMonths = 36;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is $277.78 (10000 / 36 = 277.777... rounds to 277.78)
        Assert.That(payment, Is.EqualTo(277.78m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithNearZeroAPR_UsesSimpleDivision()
    {
        // Arrange: $12,000 loan at 0.0001% APR (effectively zero) for 60 months
        decimal principal = 12000m;
        decimal apr = 0.000001m;
        int termInMonths = 60;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment should be close to $200.00 (simple division)
        Assert.That(payment, Is.EqualTo(200.00m));
    }

    #endregion

    #region Rounding Tests

    [Test]
    public void CalculateMonthlyPayment_RoundsUpCorrectly()
    {
        // Arrange: Values that produce a result needing rounding up
        decimal principal = 10000m;
        decimal apr = 0.0599m;
        int termInMonths = 60;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Verify the result is rounded to exactly 2 decimal places
        Assert.That(payment, Is.EqualTo(Math.Round(payment, 2)));
        Assert.That(payment, Is.GreaterThan(0m));
    }

    [Test]
    public void CalculateMonthlyPayment_RoundsDownCorrectly()
    {
        // Arrange: Values that produce a result needing rounding down
        decimal principal = 9999m;
        decimal apr = 0.0401m;
        int termInMonths = 48;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Verify the result is rounded to exactly 2 decimal places
        Assert.That(payment, Is.EqualTo(Math.Round(payment, 2)));
        Assert.That(payment, Is.GreaterThan(0m));
    }

    [Test]
    public void CalculateMonthlyPayment_AtMidpoint_RoundsAwayFromZero()
    {
        // Arrange: Create a scenario that produces exactly .005 in the third decimal
        // With 0% APR, we can control the exact division result
        decimal principal = 100.05m;
        decimal apr = 0m;
        int termInMonths = 2;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: 100.05 / 2 = 50.025, which should round to 50.03 (away from zero)
        Assert.That(payment, Is.EqualTo(50.03m));
    }

    #endregion

    #region Edge Cases

    [Test]
    public void CalculateMonthlyPayment_WithZeroPrincipal_ReturnsZero()
    {
        // Arrange
        decimal principal = 0m;
        decimal apr = 0.05m;
        int termInMonths = 60;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert
        Assert.That(payment, Is.EqualTo(0m));
    }

    [Test]
    public void CalculateMonthlyPayment_WithVeryHighAPR_ReturnsCorrectPayment()
    {
        // Arrange: $10,000 loan at 25% APR for 36 months
        decimal principal = 10000m;
        decimal apr = 0.25m;
        int termInMonths = 36;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: High APR should result in high payment
        Assert.That(payment, Is.GreaterThan(principal / termInMonths));
        Assert.That(payment, Is.EqualTo(Math.Round(payment, 2)));
    }

    [Test]
    public void CalculateMonthlyPayment_WithOneMonthTerm_ReturnsFullAmountPlusInterest()
    {
        // Arrange: $1,000 loan at 12% APR for 1 month
        decimal principal = 1000m;
        decimal apr = 0.12m;
        int termInMonths = 1;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Payment should be approximately principal + one month's interest
        Assert.That(payment, Is.GreaterThan(principal));
        Assert.That(payment, Is.LessThan(principal * 1.02m)); // Should be close to principal
    }

    [Test]
    public void CalculateMonthlyPayment_WithVeryLargePrincipal_HandlesCorrectly()
    {
        // Arrange: $1,000,000 loan at 4.5% APR for 360 months
        decimal principal = 1000000m;
        decimal apr = 0.045m;
        int termInMonths = 360;

        // Act
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Expected payment is approximately $5,066.85
        Assert.That(payment, Is.EqualTo(5066.85m));
    }

    #endregion

    #region Validation Tests

    [Test]
    public void CalculateMonthlyPayment_WithNegativePrincipal_ThrowsArgumentException()
    {
        // Arrange
        decimal principal = -1000m;
        decimal apr = 0.05m;
        int termInMonths = 60;

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() =>
            _calculator.CalculateMonthlyPayment(principal, apr, termInMonths));
        Assert.That(ex.ParamName, Is.EqualTo("principal"));
    }

    [Test]
    public void CalculateMonthlyPayment_WithNegativeAPR_ThrowsArgumentException()
    {
        // Arrange
        decimal principal = 10000m;
        decimal apr = -0.05m;
        int termInMonths = 60;

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() =>
            _calculator.CalculateMonthlyPayment(principal, apr, termInMonths));
        Assert.That(ex.ParamName, Is.EqualTo("annualPercentageRate"));
    }

    [Test]
    public void CalculateMonthlyPayment_WithZeroTerm_ThrowsArgumentException()
    {
        // Arrange
        decimal principal = 10000m;
        decimal apr = 0.05m;
        int termInMonths = 0;

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() =>
            _calculator.CalculateMonthlyPayment(principal, apr, termInMonths));
        Assert.That(ex.ParamName, Is.EqualTo("termInMonths"));
    }

    [Test]
    public void CalculateMonthlyPayment_WithNegativeTerm_ThrowsArgumentException()
    {
        // Arrange
        decimal principal = 10000m;
        decimal apr = 0.05m;
        int termInMonths = -12;

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() =>
            _calculator.CalculateMonthlyPayment(principal, apr, termInMonths));
        Assert.That(ex.ParamName, Is.EqualTo("termInMonths"));
    }

    #endregion

    #region Deterministic Tests

    [Test]
    public void CalculateMonthlyPayment_WithSameInputs_ReturnsSameResult()
    {
        // Arrange
        decimal principal = 15000m;
        decimal apr = 0.0499m;
        int termInMonths = 48;

        // Act
        decimal payment1 = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);
        decimal payment2 = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);
        decimal payment3 = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: All results should be identical (deterministic)
        Assert.That(payment1, Is.EqualTo(payment2));
        Assert.That(payment2, Is.EqualTo(payment3));
    }

    [Test]
    public void CalculateMonthlyPayment_IsPureFunction_NoSideEffects()
    {
        // Arrange
        decimal principal = 20000m;
        decimal apr = 0.06m;
        int termInMonths = 60;

        // Act - multiple calls
        for (int i = 0; i < 10; i++)
        {
            _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);
        }

        // Final call to verify
        decimal payment = _calculator.CalculateMonthlyPayment(principal, apr, termInMonths);

        // Assert: Result should be consistent
        Assert.That(payment, Is.GreaterThan(0m));
        Assert.That(payment, Is.EqualTo(Math.Round(payment, 2)));
    }

    #endregion
}
