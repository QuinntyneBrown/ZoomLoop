// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;

namespace ZoomLoop.Api.Features.Vehicles;

public record SearchVehiclesRequest : IRequest<SearchVehiclesResponse>
{
    public SearchFilters? Filters { get; set; }
    public List<SortCriteria>? Sort { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

public class SearchFilters
{
    public bool? IsNewest { get; set; }
    public List<string>? Colors { get; set; }
    public string? InteriorCondition { get; set; }
    public string? ExteriorCondition { get; set; }
    public int? Doors { get; set; }
    public List<string>? Transmissions { get; set; }
    public PriceRange? Price { get; set; }
    public IntRange? Age { get; set; }
    public IntRange? Year { get; set; }
    public List<string>? Makes { get; set; }
    public List<string>? Models { get; set; }
    public bool? AccidentFree { get; set; }
    public IntRange? Kilometers { get; set; }
}

public class PriceRange
{
    public decimal? Min { get; set; }
    public decimal? Max { get; set; }
}

public class IntRange
{
    public int? Min { get; set; }
    public int? Max { get; set; }
}

public class SortCriteria
{
    public string Field { get; set; } = string.Empty;
    public string Direction { get; set; } = "asc";
}

public class SearchVehiclesResponse
{
    public List<VehicleSearchResultDto> Items { get; set; } = [];
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public SearchFilters? AppliedFilters { get; set; }
}

public class VehicleSearchResultDto
{
    public Guid VehicleId { get; set; }
    public string VIN { get; set; } = string.Empty;
    public string StockNumber { get; set; } = string.Empty;
    public string Make { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string Trim { get; set; } = string.Empty;
    public int Mileage { get; set; }
    public string ExteriorColor { get; set; } = string.Empty;
    public string InteriorColor { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public int Doors { get; set; }
    public decimal? Price { get; set; }
    public bool IsNew { get; set; }
    public bool IsCertified { get; set; }
    public bool? AccidentFree { get; set; }
    public string? PrimaryImageUrl { get; set; }
    public DateTime? ListedDate { get; set; }
}
