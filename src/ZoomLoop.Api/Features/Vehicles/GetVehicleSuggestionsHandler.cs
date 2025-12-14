// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Vehicles;

public class GetVehicleSuggestionsHandler : IRequestHandler<GetVehicleSuggestionsRequest, GetVehicleSuggestionsResponse>
{
    private readonly IZoomLoopContext _context;

    public GetVehicleSuggestionsHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehicleSuggestionsResponse> Handle(GetVehicleSuggestionsRequest request, CancellationToken cancellationToken)
    {
        var limit = Math.Clamp(request.Limit, 1, 50);
        var query = request.Query?.Trim() ?? string.Empty;
        var field = request.Field?.ToLowerInvariant() ?? "make";

        var suggestions = new List<string>();

        if (string.IsNullOrWhiteSpace(query))
        {
            return new GetVehicleSuggestionsResponse { Suggestions = suggestions };
        }

        suggestions = field switch
        {
            "make" => await _context.Makes
                .Where(m => EF.Functions.Like(m.Name, $"{query}%"))
                .OrderBy(m => m.Name)
                .Select(m => m.Name)
                .Distinct()
                .Take(limit)
                .ToListAsync(cancellationToken),

            "model" => await _context.VehicleModels
                .Where(m => EF.Functions.Like(m.Name, $"{query}%"))
                .OrderBy(m => m.Name)
                .Select(m => m.Name)
                .Distinct()
                .Take(limit)
                .ToListAsync(cancellationToken),

            "color" => await _context.Vehicles
                .Where(v => EF.Functions.Like(v.ExteriorColor, $"{query}%"))
                .OrderBy(v => v.ExteriorColor)
                .Select(v => v.ExteriorColor)
                .Distinct()
                .Take(limit)
                .ToListAsync(cancellationToken),

            "transmission" => await _context.Vehicles
                .Where(v => EF.Functions.Like(v.Transmission, $"{query}%"))
                .OrderBy(v => v.Transmission)
                .Select(v => v.Transmission)
                .Distinct()
                .Take(limit)
                .ToListAsync(cancellationToken),

            _ => []
        };

        return new GetVehicleSuggestionsResponse
        {
            Suggestions = suggestions
        };
    }
}
