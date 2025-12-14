// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using ZoomLoop.Core.Services.VehicleValuation;

namespace ZoomLoop.Api.Features.VehicleValuation;

public class GetVehicleValuationHandler : IRequestHandler<GetVehicleValuationRequest, GetVehicleValuationResponse>
{
    private readonly IVehicleValuationService _valuationService;

    public GetVehicleValuationHandler(IVehicleValuationService valuationService)
    {
        _valuationService = valuationService;
    }

    public async Task<GetVehicleValuationResponse> Handle(GetVehicleValuationRequest request, CancellationToken cancellationToken)
    {
        var valuationRequest = new Core.Services.VehicleValuation.VehicleValuationRequest
        {
            Vin = request.Vin,
            Year = request.Year,
            Make = request.Make,
            Model = request.Model,
            PostalCode = request.PostalCode,
            Kilometers = request.Kilometers,
            Accidents = request.Accidents,
            InteriorCondition = request.InteriorCondition,
            ExteriorCondition = request.ExteriorCondition
        };

        var result = await _valuationService.GetVehicleValuationAsync(valuationRequest, cancellationToken);

        return new GetVehicleValuationResponse
        {
            FairValue = result.FairValue,
            Explanation = result.Explanation
        };
    }
}
