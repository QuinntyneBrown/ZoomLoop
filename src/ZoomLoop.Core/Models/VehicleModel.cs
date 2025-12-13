// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class VehicleModel
{
    public VehicleModel()
    {
        Name = string.Empty;
        Description = string.Empty;
    }

    public Guid VehicleModelId { get; set; }
    public Guid MakeId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsActive { get; set; }
    public Make? Make { get; set; }
}
