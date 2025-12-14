// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Finance;

/// <summary>
/// Provides methods for calculating monthly payments using standard amortization formulas.
/// </summary>
public interface IPaymentCalculator
{
    /// <summary>
    /// Calculates the monthly payment for a loan using standard amortization.
    /// </summary>
    /// <param name="principal">The financed principal amount (PV)</param>
    /// <param name="annualPercentageRate">The annual percentage rate (APR) as a decimal (e.g., 0.05 for 5%)</param>
    /// <param name="termInMonths">The loan term in months (n)</param>
    /// <returns>The monthly payment amount rounded to cents</returns>
    decimal CalculateMonthlyPayment(decimal principal, decimal annualPercentageRate, int termInMonths);
}
