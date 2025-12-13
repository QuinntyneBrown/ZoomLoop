// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Services.VehicleIngestion;

public class VehicleIngestionResult
{
    public string VIN { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public string InteriorCondition { get; set; } = string.Empty;
    public string ExteriorCondition { get; set; } = string.Empty;
    public int NumberOfDoors { get; set; }
    public string Description { get; set; } = string.Empty;
}
