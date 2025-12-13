// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;

namespace ZoomLoop.Api.Features.Vehicles;

public class UpdateVehicleHandler : IRequestHandler<UpdateVehicleRequest, UpdateVehicleResponse>
{
    private readonly IZoomLoopContext _context;

    public UpdateVehicleHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UpdateVehicleResponse> Handle(UpdateVehicleRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .SingleAsync(x => x.VehicleId == request.Vehicle.VehicleId, cancellationToken);

        vehicle.VIN = request.Vehicle.VIN;
        vehicle.StockNumber = request.Vehicle.StockNumber;
        vehicle.MakeId = request.Vehicle.MakeId ?? vehicle.MakeId;
        vehicle.VehicleModelId = request.Vehicle.VehicleModelId ?? vehicle.VehicleModelId;
        vehicle.Year = request.Vehicle.Year;
        vehicle.Trim = request.Vehicle.Trim;
        vehicle.Mileage = request.Vehicle.Mileage;
        vehicle.ExteriorColor = request.Vehicle.ExteriorColor;
        vehicle.InteriorColor = request.Vehicle.InteriorColor;
        vehicle.Transmission = request.Vehicle.Transmission;
        vehicle.FuelType = request.Vehicle.FuelType;
        vehicle.DriveType = request.Vehicle.DriveType;
        vehicle.BodyType = request.Vehicle.BodyType;
        vehicle.Doors = request.Vehicle.Doors;
        vehicle.Seats = request.Vehicle.Seats;
        vehicle.EngineSize = request.Vehicle.EngineSize;
        vehicle.Cylinders = request.Vehicle.Cylinders;
        vehicle.Horsepower = request.Vehicle.Horsepower;
        vehicle.CityFuelConsumption = request.Vehicle.CityFuelConsumption;
        vehicle.HighwayFuelConsumption = request.Vehicle.HighwayFuelConsumption;
        vehicle.Description = request.Vehicle.Description;
        vehicle.IsNew = request.Vehicle.IsNew;
        vehicle.IsCertified = request.Vehicle.IsCertified;
        vehicle.ManufactureDate = request.Vehicle.ManufactureDate;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateVehicleResponse { Vehicle = vehicle.ToDto() };
    }
}
