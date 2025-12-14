// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using ZoomLoop.Core.Services.Financing;

namespace ZoomLoop.Api.Features.Financing;

public class GetTaxRatesHandler : IRequestHandler<GetTaxRatesRequest, GetTaxRatesResponse>
{
    public Task<GetTaxRatesResponse> Handle(GetTaxRatesRequest request, CancellationToken cancellationToken)
    {
        var taxRates = TaxConfiguration.GetAllTaxRates();

        var response = new GetTaxRatesResponse
        {
            TaxRates = new Dictionary<string, decimal>(taxRates)
        };

        return Task.FromResult(response);
    }
}
