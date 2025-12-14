// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.Api.Features.Vehicles;

public class VehicleIngestHandler : IRequestHandler<VehicleIngestRequest, VehicleIngestResponse>
{
    private readonly IZoomLoopContext _context;
    private readonly IVehicleIngestionService _vehicleIngestionService;

    public VehicleIngestHandler(
        IZoomLoopContext context,
        IVehicleIngestionService vehicleIngestionService)
    {
        _context = context;
        _vehicleIngestionService = vehicleIngestionService;
    }

    public async Task<VehicleIngestResponse> Handle(VehicleIngestRequest request, CancellationToken cancellationToken)
    {
        // Convert uploaded images to byte arrays
        var imageBytes = await ConvertImagesToByteArraysAsync(request.Images, cancellationToken);

        // Call the ingestion service with the images
        var ingestionRequest = new VehicleIngestionRequest
        {
            Images = imageBytes.ToArray()
        };

        var ingestionResult = await _vehicleIngestionService.IngestVehicleAsync(ingestionRequest, cancellationToken);

        // Find or create Make
        var make = await _context.Makes
            .FirstOrDefaultAsync(m => m.Name == ingestionResult.Make, cancellationToken);

        if (make == null)
        {
            make = new Make
            {
                MakeId = Guid.NewGuid(),
                Name = ingestionResult.Make,
                LogoUrl = string.Empty,
                IsActive = true,
                DisplayOrder = 0
            };
            _context.Makes.Add(make);
        }

        // Find or create VehicleModel
        var vehicleModel = await _context.VehicleModels
            .FirstOrDefaultAsync(vm => vm.MakeId == make.MakeId && vm.Name == ingestionResult.Model, cancellationToken);

        if (vehicleModel == null)
        {
            vehicleModel = new VehicleModel
            {
                VehicleModelId = Guid.NewGuid(),
                MakeId = make.MakeId,
                Name = ingestionResult.Model,
                Description = string.Empty,
                IsActive = true
            };
            _context.VehicleModels.Add(vehicleModel);
        }

        // Find or create Vehicle by VIN
        var vehicle = await _context.Vehicles
            .FirstOrDefaultAsync(v => v.VIN == ingestionResult.VIN, cancellationToken);

        if (vehicle == null)
        {
            // Create new Vehicle entity
            vehicle = new Vehicle
            {
                VehicleId = Guid.NewGuid(),
                VIN = ingestionResult.VIN,
                StockNumber = string.Empty,
                MakeId = make.MakeId,
                VehicleModelId = vehicleModel.VehicleModelId,
                Year = ingestionResult.Year,
                Trim = string.Empty,
                Mileage = 0,
                ExteriorColor = string.Empty,
                InteriorColor = string.Empty,
                Transmission = string.Empty,
                FuelType = string.Empty,
                DriveType = string.Empty,
                BodyType = string.Empty,
                Doors = ingestionResult.NumberOfDoors,
                Seats = 0,
                Description = ingestionResult.Description,
                IsNew = false,
                IsCertified = false
            };
            _context.Vehicles.Add(vehicle);
        }
        else
        {
            // Update existing Vehicle entity
            vehicle.MakeId = make.MakeId;
            vehicle.VehicleModelId = vehicleModel.VehicleModelId;
            vehicle.Year = ingestionResult.Year;
            vehicle.Doors = ingestionResult.NumberOfDoors;
            vehicle.Description = ingestionResult.Description;
        }

        // Create VehicleImage entities and DigitalAssets for uploaded images
        CreateVehicleImagesAndAssets(request.Images, vehicle);

        // Save all changes in a single transaction
        await _context.SaveChangesAsync(cancellationToken);

        // Reload the vehicle with images for the response DTO
        var vehicleWithImages = await _context.Vehicles
            .Include(v => v.Images)
            .Include(v => v.Features)
            .FirstAsync(v => v.VehicleId == vehicle.VehicleId, cancellationToken);

        return new VehicleIngestResponse { Vehicle = vehicleWithImages.ToDto() };
    }

    private static async Task<List<byte[]>> ConvertImagesToByteArraysAsync(List<IFormFile> images, CancellationToken cancellationToken)
    {
        var imageBytes = new List<byte[]>();
        foreach (var file in images)
        {
            if (file.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream, cancellationToken);
                imageBytes.Add(memoryStream.ToArray());
            }
        }
        return imageBytes;
    }

    private void CreateVehicleImagesAndAssets(List<IFormFile> images, Vehicle vehicle)
    {
        var displayOrder = 0;
        foreach (var file in images)
        {
            if (file.Length > 0)
            {
                var digitalAsset = new DigitalAsset
                {
                    DigitalAssetId = Guid.NewGuid(),
                    Name = file.FileName,
                    ContentType = file.ContentType,
                    Size = file.Length,
                    Url = $"/assets/vehicles/{vehicle.VehicleId}/{file.FileName}",
                    CreatedDate = DateTime.UtcNow
                };

                _context.DigitalAssets.Add(digitalAsset);

                var vehicleImage = new VehicleImage
                {
                    VehicleImageId = Guid.NewGuid(),
                    VehicleId = vehicle.VehicleId,
                    ImageUrl = digitalAsset.Url,
                    ThumbnailUrl = digitalAsset.Url,
                    Caption = string.Empty,
                    DisplayOrder = ++displayOrder,
                    IsPrimary = displayOrder == 1,
                    CreatedDate = DateTime.UtcNow
                };

                _context.VehicleImages.Add(vehicleImage);
            }
        }
    }
}
