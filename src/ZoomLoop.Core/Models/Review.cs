// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class Review
{
    public Review()
    {
        Title = string.Empty;
        Comment = string.Empty;
        ReviewerName = string.Empty;
    }

    public Guid ReviewId { get; set; }
    public Guid DealerId { get; set; }
    public Guid? UserId { get; set; }
    public string Title { get; set; }
    public string Comment { get; set; }
    public int Rating { get; set; }
    public string ReviewerName { get; set; }
    public bool IsVerifiedPurchase { get; set; }
    public bool IsRecommended { get; set; }
    public int HelpfulCount { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public Dealer? Dealer { get; set; }
    public User? User { get; set; }
}
