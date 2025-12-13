// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Inquiry
{
    public Inquiry()
    {
        Name = string.Empty;
        Email = string.Empty;
        PhoneNumber = string.Empty;
        Message = string.Empty;
        Status = string.Empty;
    }

    public Guid InquiryId { get; set; }
    public Guid ListingId { get; set; }
    public Guid? UserId { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Message { get; set; }
    public string Status { get; set; }
    public bool IsTestDriveRequested { get; set; }
    public bool IsFinancingRequested { get; set; }
    public bool IsTradeInRequested { get; set; }
    public DateTime? PreferredContactDate { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? RespondedDate { get; set; }
    public Listing? Listing { get; set; }
    public User? User { get; set; }
}
