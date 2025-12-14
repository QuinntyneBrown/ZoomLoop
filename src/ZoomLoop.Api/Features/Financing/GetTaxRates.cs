// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Financing;

public record GetTaxRatesRequest() : IRequest<GetTaxRatesResponse>;

public class GetTaxRatesResponse
{
    public Dictionary<string, decimal> TaxRates { get; set; } = new();
}
