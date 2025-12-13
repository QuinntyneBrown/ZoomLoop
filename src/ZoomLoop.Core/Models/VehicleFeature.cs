// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class VehicleFeature
{
    public VehicleFeature()
    {
        Name = string.Empty;
        Category = string.Empty;
        Description = string.Empty;
    }

    public Guid VehicleFeatureId { get; set; }
    public Guid VehicleId { get; set; }
    public string Name { get; set; }
    public string Category { get; set; }
    public string Description { get; set; }
    public bool IsStandard { get; set; }
    public Vehicle? Vehicle { get; set; }
}
