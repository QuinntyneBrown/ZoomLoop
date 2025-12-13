// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Make
{
    public Make()
    {
        Name = string.Empty;
        LogoUrl = string.Empty;
        VehicleModels = [];
    }

    public Guid MakeId { get; set; }
    public string Name { get; set; }
    public string LogoUrl { get; set; }
    public bool IsActive { get; set; }
    public int DisplayOrder { get; set; }
    public List<VehicleModel> VehicleModels { get; set; }
}
