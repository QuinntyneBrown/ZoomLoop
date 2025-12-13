// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Vehicle
{
    public Vehicle()
    {
        VIN = string.Empty;
        StockNumber = string.Empty;
        Trim = string.Empty;
        ExteriorColor = string.Empty;
        InteriorColor = string.Empty;
        Transmission = string.Empty;
        FuelType = string.Empty;
        DriveType = string.Empty;
        BodyType = string.Empty;
        Description = string.Empty;
        Images = [];
        Features = [];
    }

    public Guid VehicleId { get; set; }
    public string VIN { get; set; }
    public string StockNumber { get; set; }
    public Guid MakeId { get; set; }
    public Guid VehicleModelId { get; set; }
    public int Year { get; set; }
    public string Trim { get; set; }
    public int Mileage { get; set; }
    public string ExteriorColor { get; set; }
    public string InteriorColor { get; set; }
    public string Transmission { get; set; }
    public string FuelType { get; set; }
    public string DriveType { get; set; }
    public string BodyType { get; set; }
    public int Doors { get; set; }
    public int Seats { get; set; }
    public decimal? EngineSize { get; set; }
    public int? Cylinders { get; set; }
    public int? Horsepower { get; set; }
    public decimal? CityFuelConsumption { get; set; }
    public decimal? HighwayFuelConsumption { get; set; }
    public string Description { get; set; }
    public bool IsNew { get; set; }
    public bool IsCertified { get; set; }
    public DateTime? ManufactureDate { get; set; }
    public Make? Make { get; set; }
    public VehicleModel? VehicleModel { get; set; }
    public List<VehicleImage> Images { get; set; }
    public List<VehicleFeature> Features { get; set; }
}
