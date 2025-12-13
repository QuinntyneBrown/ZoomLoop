// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Listing
{
    public Listing()
    {
        Title = string.Empty;
        Description = string.Empty;
        Status = string.Empty;
        ListingType = string.Empty;
        Province = string.Empty;
        City = string.Empty;
        PostalCode = string.Empty;
            Inquiries = [];
            Favorites = [];
    }

    public Guid ListingId { get; set; }
    public Guid VehicleId { get; set; }
    public Guid? DealerId { get; set; }
    public Guid? PrivateSellerId { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public string Status { get; set; }
    public string ListingType { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsNegotiable { get; set; }
    public DateTime ListedDate { get; set; }
    public DateTime? ExpiryDate { get; set; }
    public DateTime? SoldDate { get; set; }
    public int ViewCount { get; set; }
    public int InquiryCount { get; set; }
    public int FavoriteCount { get; set; }
    public string Province { get; set; }
    public string City { get; set; }
    public string PostalCode { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public Vehicle? Vehicle { get; set; }
    public Dealer? Dealer { get; set; }
    public PrivateSeller? PrivateSeller { get; set; }
    public List<Inquiry> Inquiries { get; set; }
    public List<Favorite> Favorites { get; set; }
}
