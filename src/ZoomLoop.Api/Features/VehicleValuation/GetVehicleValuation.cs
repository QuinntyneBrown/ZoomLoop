// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.VehicleValuation;

public record GetVehicleValuationRequest(
    string Vin,
    int Year,
    string Make,
    string Model,
    string PostalCode,
    int Kilometers,
    int Accidents,
    string InteriorCondition,
    string ExteriorCondition) : IRequest<GetVehicleValuationResponse>;

public class GetVehicleValuationResponse
{
    public decimal FairValue { get; set; }
    public string Explanation { get; set; } = string.Empty;
}
