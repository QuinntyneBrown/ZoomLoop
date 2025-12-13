// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Linq;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Vehicles;

public static class VehicleExtensions
{
    public static VehicleDto ToDto(this Vehicle vehicle)
    {
        return new VehicleDto
        {
            VehicleId = vehicle.VehicleId,
            VIN = vehicle.VIN,
            StockNumber = vehicle.StockNumber,
            MakeId = vehicle.MakeId,
            VehicleModelId = vehicle.VehicleModelId,
            Year = vehicle.Year,
            Trim = vehicle.Trim,
            Mileage = vehicle.Mileage,
            ExteriorColor = vehicle.ExteriorColor,
            InteriorColor = vehicle.InteriorColor,
            Transmission = vehicle.Transmission,
            FuelType = vehicle.FuelType,
            DriveType = vehicle.DriveType,
            BodyType = vehicle.BodyType,
            Doors = vehicle.Doors,
            Seats = vehicle.Seats,
            EngineSize = vehicle.EngineSize,
            Cylinders = vehicle.Cylinders,
            Horsepower = vehicle.Horsepower,
            CityFuelConsumption = vehicle.CityFuelConsumption,
            HighwayFuelConsumption = vehicle.HighwayFuelConsumption,
            Description = vehicle.Description,
            IsNew = vehicle.IsNew,
            IsCertified = vehicle.IsCertified,
            ManufactureDate = vehicle.ManufactureDate,
            Images = vehicle.Images.Select(x => x.ToDto()).ToList(),
            Features = vehicle.Features.Select(x => x.ToDto()).ToList()
        };
    }

    public static VehicleImageDto ToDto(this VehicleImage image)
    {
        return new VehicleImageDto
        {
            VehicleImageId = image.VehicleImageId,
            VehicleId = image.VehicleId,
            ImageUrl = image.ImageUrl,
            ThumbnailUrl = image.ThumbnailUrl,
            Caption = image.Caption,
            DisplayOrder = image.DisplayOrder,
            IsPrimary = image.IsPrimary,
            CreatedDate = image.CreatedDate
        };
    }

    public static VehicleFeatureDto ToDto(this VehicleFeature feature)
    {
        return new VehicleFeatureDto
        {
            VehicleFeatureId = feature.VehicleFeatureId,
            VehicleId = feature.VehicleId,
            Name = feature.Name,
            Category = feature.Category,
            Description = feature.Description,
            IsStandard = feature.IsStandard
        };
    }
}
