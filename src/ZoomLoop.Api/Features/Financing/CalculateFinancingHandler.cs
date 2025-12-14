// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using ZoomLoop.Core.Services.Financing;

namespace ZoomLoop.Api.Features.Financing;

public class CalculateFinancingHandler : IRequestHandler<CalculateFinancingRequest, CalculateFinancingResponse>
{
    private readonly IFinancingCalculator _calculator;

    public CalculateFinancingHandler(IFinancingCalculator calculator)
    {
        _calculator = calculator ?? throw new ArgumentNullException(nameof(calculator));
    }

    public Task<CalculateFinancingResponse> Handle(CalculateFinancingRequest request, CancellationToken cancellationToken)
    {
        var options = new FinancingOptions
        {
            VehiclePrice = request.VehiclePrice,
            DownPayment = request.DownPayment,
            TradeInValue = request.TradeInValue,
            Fees = request.Fees,
            FinanceFees = request.FinanceFees,
            Region = request.Region,
            CustomTaxRate = request.CustomTaxRate
        };

        var result = _calculator.CalculateFinancing(options);

        var response = new CalculateFinancingResponse
        {
            VehiclePrice = result.VehiclePrice,
            DownPayment = result.DownPayment,
            TradeInValue = result.TradeInValue,
            Fees = result.Fees,
            FeesFinanced = result.FeesFinanced,
            TaxableAmount = result.TaxableAmount,
            TaxRate = result.TaxRate,
            TaxAmount = result.TaxAmount,
            FinancedPrincipal = result.FinancedPrincipal,
            Region = result.Region
        };

        return Task.FromResult(response);
    }
}
