// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.Financing;

public class FinancingOptions
{
    public decimal VehiclePrice { get; set; }
    public decimal DownPayment { get; set; }
    public decimal TradeInValue { get; set; }
    public decimal Fees { get; set; }
    public bool FinanceFees { get; set; }
    public string? Region { get; set; }
    public decimal? CustomTaxRate { get; set; }
}
