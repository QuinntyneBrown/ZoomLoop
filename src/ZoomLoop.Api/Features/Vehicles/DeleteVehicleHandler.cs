// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Vehicles;

public class DeleteVehicleHandler : IRequestHandler<DeleteVehicleRequest, DeleteVehicleResponse>
{
    private readonly IZoomLoopContext _context;

    public DeleteVehicleHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<DeleteVehicleResponse> Handle(DeleteVehicleRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .SingleAsync(x => x.VehicleId == request.VehicleId, cancellationToken);

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return new DeleteVehicleResponse { Vehicle = vehicle.ToDto() };
    }
}
