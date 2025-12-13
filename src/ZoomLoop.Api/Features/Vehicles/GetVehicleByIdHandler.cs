// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Vehicles;

public class GetVehicleByIdHandler : IRequestHandler<GetVehicleByIdRequest, GetVehicleByIdResponse>
{
    private readonly IZoomLoopContext _context;

    public GetVehicleByIdHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehicleByIdResponse> Handle(GetVehicleByIdRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .Include(x => x.Make)
            .Include(x => x.VehicleModel)
            .SingleOrDefaultAsync(x => x.VehicleId == request.VehicleId, cancellationToken);

        return new GetVehicleByIdResponse { Vehicle = vehicle?.ToDto() };
    }
}
