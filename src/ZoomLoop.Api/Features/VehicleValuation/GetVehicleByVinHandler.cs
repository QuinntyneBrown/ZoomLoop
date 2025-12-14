// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using ZoomLoop.Core.Services.VehicleValuation;

namespace ZoomLoop.Api.Features.VehicleValuation;

public class GetVehicleByVinHandler : IRequestHandler<GetVehicleByVinRequest, GetVehicleByVinResponse>
{
    private readonly IVehicleValuationService _valuationService;

    public GetVehicleByVinHandler(IVehicleValuationService valuationService)
    {
        _valuationService = valuationService;
    }

    public async Task<GetVehicleByVinResponse> Handle(GetVehicleByVinRequest request, CancellationToken cancellationToken)
    {
        var result = await _valuationService.GetVehicleInfoByVinAsync(request.Vin, cancellationToken);

        return new GetVehicleByVinResponse
        {
            Year = result.Year,
            Make = result.Make,
            Model = result.Model
        };
    }
}
