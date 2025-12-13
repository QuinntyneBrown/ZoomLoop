// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class VehicleImage
{
    public VehicleImage()
    {
        ImageUrl = string.Empty;
        ThumbnailUrl = string.Empty;
        Caption = string.Empty;
    }

    public Guid VehicleImageId { get; set; }
    public Guid VehicleId { get; set; }
    public string ImageUrl { get; set; }
    public string ThumbnailUrl { get; set; }
    public string Caption { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedDate { get; set; }
    public Vehicle? Vehicle { get; set; }
}
