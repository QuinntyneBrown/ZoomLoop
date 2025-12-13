// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Api.Features.Vehicles;

public class VehicleDto
{
    public Guid? VehicleId { get; set; }
    public string VIN { get; set; } = string.Empty;
    public string StockNumber { get; set; } = string.Empty;
    public Guid? MakeId { get; set; }
    public Guid? VehicleModelId { get; set; }
    public int Year { get; set; }
    public string Trim { get; set; } = string.Empty;
    public int Mileage { get; set; }
    public string ExteriorColor { get; set; } = string.Empty;
    public string InteriorColor { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public string DriveType { get; set; } = string.Empty;
    public string BodyType { get; set; } = string.Empty;
    public int Doors { get; set; }
    public int Seats { get; set; }
    public decimal? EngineSize { get; set; }
    public int? Cylinders { get; set; }
    public int? Horsepower { get; set; }
    public decimal? CityFuelConsumption { get; set; }
    public decimal? HighwayFuelConsumption { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsNew { get; set; }
    public bool IsCertified { get; set; }
    public DateTime? ManufactureDate { get; set; }
    public List<VehicleImageDto> Images { get; set; } = [];
    public List<VehicleFeatureDto> Features { get; set; } = [];
}
