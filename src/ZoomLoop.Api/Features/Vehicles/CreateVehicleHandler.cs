// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using System.Linq;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Vehicles;

public class CreateVehicleHandler : IRequestHandler<CreateVehicleRequest, CreateVehicleResponse>
{
    private readonly IZoomLoopContext _context;

    public CreateVehicleHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<CreateVehicleResponse> Handle(CreateVehicleRequest request, CancellationToken cancellationToken)
    {
        var vehicle = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            VIN = request.Vehicle.VIN,
            StockNumber = request.Vehicle.StockNumber,
            MakeId = request.Vehicle.MakeId ?? Guid.NewGuid(),
            VehicleModelId = request.Vehicle.VehicleModelId ?? Guid.NewGuid(),
            Year = request.Vehicle.Year,
            Trim = request.Vehicle.Trim,
            Mileage = request.Vehicle.Mileage,
            ExteriorColor = request.Vehicle.ExteriorColor,
            InteriorColor = request.Vehicle.InteriorColor,
            Transmission = request.Vehicle.Transmission,
            FuelType = request.Vehicle.FuelType,
            DriveType = request.Vehicle.DriveType,
            BodyType = request.Vehicle.BodyType,
            Doors = request.Vehicle.Doors,
            Seats = request.Vehicle.Seats,
            EngineSize = request.Vehicle.EngineSize,
            Cylinders = request.Vehicle.Cylinders,
            Horsepower = request.Vehicle.Horsepower,
            CityFuelConsumption = request.Vehicle.CityFuelConsumption,
            HighwayFuelConsumption = request.Vehicle.HighwayFuelConsumption,
            Description = request.Vehicle.Description,
            IsNew = request.Vehicle.IsNew,
            IsCertified = request.Vehicle.IsCertified,
            ManufactureDate = request.Vehicle.ManufactureDate
        };

        if (request.Vehicle.Images?.Any() == true)
        {
            foreach (var imageDto in request.Vehicle.Images)
            {
                var image = new VehicleImage
                {
                    VehicleImageId = Guid.NewGuid(),
                    VehicleId = vehicle.VehicleId,
                    ImageUrl = imageDto.ImageUrl,
                    ThumbnailUrl = imageDto.ThumbnailUrl,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                    IsPrimary = imageDto.IsPrimary,
                    CreatedDate = DateTime.UtcNow
                };
                vehicle.Images.Add(image);
            }
        }

        if (request.Vehicle.Features?.Any() == true)
        {
            foreach (var featureDto in request.Vehicle.Features)
            {
                var feature = new VehicleFeature
                {
                    VehicleFeatureId = Guid.NewGuid(),
                    VehicleId = vehicle.VehicleId,
                    Name = featureDto.Name,
                    Category = featureDto.Category,
                    Description = featureDto.Description,
                    IsStandard = featureDto.IsStandard
                };
                vehicle.Features.Add(feature);
            }
        }

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateVehicleResponse { Vehicle = vehicle.ToDto() };
    }
}
