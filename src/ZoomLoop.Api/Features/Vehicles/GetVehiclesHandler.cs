// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Vehicles;

public class GetVehiclesHandler : IRequestHandler<GetVehiclesRequest, GetVehiclesResponse>
{
    private readonly IZoomLoopContext _context;

    public GetVehiclesHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehiclesResponse> Handle(GetVehiclesRequest request, CancellationToken cancellationToken)
    {
        var vehicles = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .Include(x => x.Make)
            .Include(x => x.VehicleModel)
            .ToListAsync(cancellationToken);

        return new GetVehiclesResponse { Vehicles = vehicles.Select(x => x.ToDto()).ToList() };
    }
}
