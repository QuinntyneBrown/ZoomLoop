// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Dealer
{
    public Dealer()
    {
        DealerName = string.Empty;
        Email = string.Empty;
        PhoneNumber = string.Empty;
        WebsiteUrl = string.Empty;
        LogoUrl = string.Empty;
        Description = string.Empty;
        Locations = [];
        Listings = [];
        Reviews = [];
    }

    public Guid DealerId { get; set; }
    public string DealerName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string WebsiteUrl { get; set; }
    public string LogoUrl { get; set; }
    public string Description { get; set; }
    public bool IsVerified { get; set; }
    public bool IsActive { get; set; }
    public decimal AverageRating { get; set; }
    public int TotalReviews { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public List<DealerLocation> Locations { get; set; }
    public List<Listing> Listings { get; set; }
    public List<Review> Reviews { get; set; }
}
