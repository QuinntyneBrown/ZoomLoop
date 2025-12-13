// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Vehicles;

public class UploadVehicleImagesHandler : IRequestHandler<UploadVehicleImagesRequest, UploadVehicleImagesResponse>
{
    private readonly IZoomLoopContext _context;

    public UploadVehicleImagesHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UploadVehicleImagesResponse> Handle(UploadVehicleImagesRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .SingleAsync(x => x.VehicleId == request.VehicleId, cancellationToken);

        var images = new List<VehicleImage>();
        var currentMaxOrder = vehicle.Images.Any() ? vehicle.Images.Max(x => x.DisplayOrder) : 0;

        foreach (var file in request.Files)
        {
            if (file.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream, cancellationToken);

                var digitalAsset = new DigitalAsset
                {
                    DigitalAssetId = Guid.NewGuid(),
                    Name = file.FileName,
                    ContentType = file.ContentType,
                    Size = file.Length,
                    Url = $"/assets/vehicles/{request.VehicleId}/{file.FileName}",
                    CreatedDate = DateTime.UtcNow
                };

                _context.DigitalAssets.Add(digitalAsset);

                var image = new VehicleImage
                {
                    VehicleImageId = Guid.NewGuid(),
                    VehicleId = request.VehicleId,
                    ImageUrl = digitalAsset.Url,
                    ThumbnailUrl = digitalAsset.Url,
                    Caption = string.Empty,
                    DisplayOrder = ++currentMaxOrder,
                    IsPrimary = !vehicle.Images.Any(),
                    CreatedDate = DateTime.UtcNow
                };

                vehicle.Images.Add(image);
                images.Add(image);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UploadVehicleImagesResponse { Images = images.Select(x => x.ToDto()).ToList() };
    }
}
