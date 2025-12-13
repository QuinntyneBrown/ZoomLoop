// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Api.Features.Vehicles;

public class VehicleFeatureDto
{
    public Guid? VehicleFeatureId { get; set; }
    public Guid? VehicleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsStandard { get; set; }
}
