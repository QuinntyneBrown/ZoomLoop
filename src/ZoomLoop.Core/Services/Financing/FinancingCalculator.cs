// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Financing;

public interface IFinancingCalculator
{
    FinancingCalculationResult CalculateFinancing(FinancingOptions options);
}

public class FinancingCalculator : IFinancingCalculator
{
    public FinancingCalculationResult CalculateFinancing(FinancingOptions options)
    {
        if (options == null)
        {
            throw new ArgumentNullException(nameof(options));
        }

        if (options.VehiclePrice < 0)
        {
            throw new ArgumentException("Vehicle price cannot be negative", nameof(options));
        }

        if (options.DownPayment < 0)
        {
            throw new ArgumentException("Down payment cannot be negative", nameof(options));
        }

        if (options.Fees < 0)
        {
            throw new ArgumentException("Fees cannot be negative", nameof(options));
        }

        // Determine tax rate
        var taxRate = options.CustomTaxRate ?? TaxConfiguration.GetTaxRate(options.Region);

        // Calculate taxable amount
        // Taxable amount = price - down payment - trade-in
        // If fees are to be financed, they are added to the taxable base
        var taxableAmount = options.VehiclePrice - options.DownPayment - options.TradeInValue;
        
        if (options.FinanceFees)
        {
            taxableAmount += options.Fees;
        }

        // Ensure taxable amount is not negative
        if (taxableAmount < 0)
        {
            taxableAmount = 0;
        }

        // Calculate tax amount
        var taxAmount = taxableAmount * taxRate;

        // Calculate financed principal
        // Principal = price - down - trade + financed fees + taxes
        var financedPrincipal = options.VehiclePrice - options.DownPayment - options.TradeInValue;
        
        if (options.FinanceFees)
        {
            financedPrincipal += options.Fees;
        }
        
        financedPrincipal += taxAmount;

        // Ensure financed principal is not negative
        if (financedPrincipal < 0)
        {
            financedPrincipal = 0;
        }

        return new FinancingCalculationResult
        {
            VehiclePrice = options.VehiclePrice,
            DownPayment = options.DownPayment,
            TradeInValue = options.TradeInValue,
            Fees = options.Fees,
            FeesFinanced = options.FinanceFees,
            TaxableAmount = taxableAmount,
            TaxRate = taxRate,
            TaxAmount = taxAmount,
            FinancedPrincipal = financedPrincipal,
            Region = options.Region
        };
    }
}
