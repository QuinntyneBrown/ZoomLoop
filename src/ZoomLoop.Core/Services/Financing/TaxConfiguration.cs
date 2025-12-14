// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Financing;

public static class TaxConfiguration
{
    private static readonly Dictionary<string, decimal> ProvinceTaxRates = new()
    {
        // Canadian Provinces - HST (Harmonized Sales Tax)
        { "ON", 0.13m },  // Ontario - 13% HST
        { "NB", 0.15m },  // New Brunswick - 15% HST
        { "NS", 0.15m },  // Nova Scotia - 15% HST
        { "NL", 0.15m },  // Newfoundland and Labrador - 15% HST
        { "PE", 0.15m },  // Prince Edward Island - 15% HST
        
        // Canadian Provinces - GST + PST
        { "BC", 0.12m },  // British Columbia - 5% GST + 7% PST
        { "SK", 0.11m },  // Saskatchewan - 5% GST + 6% PST
        { "MB", 0.12m },  // Manitoba - 5% GST + 7% PST (RST)
        
        // Canadian Provinces - GST only
        { "AB", 0.05m },  // Alberta - 5% GST
        { "NT", 0.05m },  // Northwest Territories - 5% GST
        { "NU", 0.05m },  // Nunavut - 5% GST
        { "YT", 0.05m },  // Yukon - 5% GST
        
        // Quebec - GST + QST
        { "QC", 0.14975m }, // Quebec - 5% GST + 9.975% QST (compound)
    };

    public static decimal GetTaxRate(string? region)
    {
        if (string.IsNullOrWhiteSpace(region))
        {
            return 0m;
        }

        var normalizedRegion = region.ToUpperInvariant().Trim();
        
        if (ProvinceTaxRates.TryGetValue(normalizedRegion, out var rate))
        {
            return rate;
        }

        return 0m;
    }

    public static bool IsSupportedRegion(string? region)
    {
        if (string.IsNullOrWhiteSpace(region))
        {
            return false;
        }

        return ProvinceTaxRates.ContainsKey(region.ToUpperInvariant().Trim());
    }

    public static IReadOnlyDictionary<string, decimal> GetAllTaxRates()
    {
        return ProvinceTaxRates;
    }
}
