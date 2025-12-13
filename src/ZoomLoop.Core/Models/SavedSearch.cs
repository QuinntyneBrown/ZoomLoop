// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace ZoomLoop.Core.Models;

public class SavedSearch
{
    public SavedSearch()
    {
        Name = string.Empty;
        SearchCriteria = string.Empty;
    }

    public Guid SavedSearchId { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; }
    public string SearchCriteria { get; set; }
    public Guid? MakeId { get; set; }
    public Guid? VehicleModelId { get; set; }
    public int? MinYear { get; set; }
    public int? MaxYear { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public int? MaxMileage { get; set; }
    public string? BodyType { get; set; }
    public string? Transmission { get; set; }
    public string? FuelType { get; set; }
    public string? Province { get; set; }
    public string? City { get; set; }
    public int? SearchRadius { get; set; }
    public bool EmailNotifications { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? LastModifiedDate { get; set; }
    public User? User { get; set; }
}
