// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class DealerLocation
{
    public DealerLocation()
    {
        Name = string.Empty;
        AddressLine1 = string.Empty;
        AddressLine2 = string.Empty;
        City = string.Empty;
        Province = string.Empty;
        PostalCode = string.Empty;
        Country = string.Empty;
        PhoneNumber = string.Empty;
        Email = string.Empty;
    }

    public Guid DealerLocationId { get; set; }
    public Guid DealerId { get; set; }
    public string Name { get; set; }
    public string AddressLine1 { get; set; }
    public string AddressLine2 { get; set; }
    public string City { get; set; }
    public string Province { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public decimal Latitude { get; set; }
    public decimal Longitude { get; set; }
    public bool IsPrimary { get; set; }
    public bool IsActive { get; set; }
    public string? OpeningHours { get; set; }
    public Dealer? Dealer { get; set; }
}
