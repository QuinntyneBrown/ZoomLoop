// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Favorite
{
    public Favorite()
    {
        Notes = string.Empty;
    }

    public Guid FavoriteId { get; set; }
    public Guid UserId { get; set; }
    public Guid ListingId { get; set; }
    public string Notes { get; set; }
    public DateTime CreatedDate { get; set; }
    public User? User { get; set; }
    public Listing? Listing { get; set; }
}
