// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Vehicles;

public class GetVehiclesPageHandler : IRequestHandler<GetVehiclesPageRequest, GetVehiclesPageResponse>
{
    private readonly IZoomLoopContext _context;

    public GetVehiclesPageHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehiclesPageResponse> Handle(GetVehiclesPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .Include(x => x.Make)
            .Include(x => x.VehicleModel);

        var length = await query.CountAsync(cancellationToken);
        var vehicles = await query
            .OrderByDescending(x => x.Year)
            .ThenBy(x => x.Mileage)
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetVehiclesPageResponse
        {
            Length = length,
            Entities = vehicles.Select(x => x.ToDto()).ToList()
        };
    }
}
