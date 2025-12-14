// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class PrivateSeller
{
    public PrivateSeller()
    {
        FirstName = string.Empty;
        LastName = string.Empty;
        Email = string.Empty;
        PhoneNumber = string.Empty;
        AddressLine1 = string.Empty;
        AddressLine2 = null;
        City = string.Empty;
        Province = string.Empty;
        PostalCode = string.Empty;
        Country = string.Empty;
        Listings = [];
    }

    public Guid PrivateSellerId { get; set; }
    public Guid UserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string AddressLine1 { get; set; }
    public string? AddressLine2 { get; set; }
    public string City { get; set; }
    public string Province { get; set; }
    public string PostalCode { get; set; }
    public string Country { get; set; }
    public bool IsVerified { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public User? User { get; set; }
    public List<Listing> Listings { get; set; }
}
