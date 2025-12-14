// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Finance;

/// <summary>
/// Implements monthly payment calculations using standard amortization formulas.
/// </summary>
public class PaymentCalculator : IPaymentCalculator
{
    private const decimal NearZeroThreshold = 0.000001m;

    /// <summary>
    /// Calculates the monthly payment for a loan using standard amortization.
    /// Formula: P = r × PV / (1 - (1+r)^-n)
    /// where r = APR/12 (monthly rate), n = term in months, PV = principal
    /// For zero/near-zero APR: P = PV / n
    /// </summary>
    /// <param name="principal">The financed principal amount (PV)</param>
    /// <param name="annualPercentageRate">The annual percentage rate (APR) as a decimal (e.g., 0.05 for 5%)</param>
    /// <param name="termInMonths">The loan term in months (n)</param>
    /// <returns>The monthly payment amount rounded to cents using standard rounding</returns>
    /// <exception cref="ArgumentException">Thrown when principal is negative, APR is negative, or term is less than or equal to zero</exception>
    public decimal CalculateMonthlyPayment(decimal principal, decimal annualPercentageRate, int termInMonths)
    {
        // Validate inputs
        if (principal < 0)
        {
            throw new ArgumentException("Principal must be non-negative", nameof(principal));
        }

        if (annualPercentageRate < 0)
        {
            throw new ArgumentException("Annual percentage rate must be non-negative", nameof(annualPercentageRate));
        }

        if (termInMonths <= 0)
        {
            throw new ArgumentException("Term in months must be greater than zero", nameof(termInMonths));
        }

        // Handle edge case: zero principal
        if (principal == 0)
        {
            return 0m;
        }

        // Calculate monthly rate
        decimal monthlyRate = annualPercentageRate / 12m;

        // Handle zero or near-zero APR case
        if (monthlyRate < NearZeroThreshold)
        {
            // Simple division for zero interest
            decimal simplePayment = principal / termInMonths;
            return Math.Round(simplePayment, 2, MidpointRounding.AwayFromZero);
        }

        // Standard amortization formula: P = r × PV / (1 - (1+r)^-n)
        // Using decimal for high precision
        decimal onePlusRate = 1m + monthlyRate;
        decimal powerTerm = DecimalPower(onePlusRate, -termInMonths);
        decimal denominator = 1m - powerTerm;
        decimal payment = (monthlyRate * principal) / denominator;

        // Round to cents using standard rounding (away from zero at midpoint)
        return Math.Round(payment, 2, MidpointRounding.AwayFromZero);
    }

    /// <summary>
    /// Calculates the power of a decimal number with high precision.
    /// Used for amortization calculations.
    /// Uses Math.Pow for conversion as decimal doesn't have native power function.
    /// </summary>
    /// <param name="baseValue">The base value</param>
    /// <param name="exponent">The exponent (can be negative)</param>
    /// <returns>The result of baseValue raised to the exponent</returns>
    private static decimal DecimalPower(decimal baseValue, int exponent)
    {
        // Convert to double for Math.Pow, then back to decimal
        // This maintains sufficient precision for financial calculations
        double doubleBase = (double)baseValue;
        double result = Math.Pow(doubleBase, exponent);
        return (decimal)result;
    }
}
