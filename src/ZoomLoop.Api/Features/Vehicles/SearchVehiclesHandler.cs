// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Vehicles;

public class SearchVehiclesHandler : IRequestHandler<SearchVehiclesRequest, SearchVehiclesResponse>
{
    private readonly IZoomLoopContext _context;
    private static readonly string[] AllowedSortFields = 
    { 
        "year", "mileage", "price", "make", "model", "color", "doors", 
        "transmission", "age", "listeddate" 
    };

    public SearchVehiclesHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<SearchVehiclesResponse> Handle(SearchVehiclesRequest request, CancellationToken cancellationToken)
    {
        // Validate and clamp pagination
        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        // Build query with proper includes to avoid N+1
        var query = BuildQuery(request.Filters);

        // Get total count
        var total = await query.CountAsync(cancellationToken);

        // Apply sorting
        query = ApplySorting(query, request.Sort);

        // Apply pagination and get results with related data
        var skip = (page - 1) * pageSize;
        var vehicles = await query
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        // Get vehicle IDs for efficient querying of related data
        var vehicleIds = vehicles.Select(v => v.VehicleId).ToList();

        // Fetch listings in a single query
        var listings = await _context.Listings
            .Where(l => vehicleIds.Contains(l.VehicleId))
            .ToListAsync(cancellationToken);

        var listingsByVehicle = listings
            .GroupBy(l => l.VehicleId)
            .ToDictionary(g => g.Key, g => g.OrderByDescending(l => l.ListedDate).First());

        // Fetch histories in a single query
        var histories = await _context.VehicleHistories
            .Where(h => vehicleIds.Contains(h.VehicleId))
            .ToListAsync(cancellationToken);

        var historyByVehicle = histories
            .GroupBy(h => h.VehicleId)
            .ToDictionary(g => g.Key, g => g.OrderByDescending(h => h.ReportDate).First());

        // Map to DTOs
        var results = vehicles.Select(v =>
        {
            listingsByVehicle.TryGetValue(v.VehicleId, out var listing);
            historyByVehicle.TryGetValue(v.VehicleId, out var history);
            var primaryImage = v.Images.FirstOrDefault(i => i.IsPrimary)?.ImageUrl
                ?? v.Images.OrderBy(i => i.DisplayOrder).FirstOrDefault()?.ImageUrl;

            return new VehicleSearchResultDto
            {
                VehicleId = v.VehicleId,
                VIN = v.VIN,
                StockNumber = v.StockNumber,
                Make = v.Make?.Name ?? string.Empty,
                Model = v.VehicleModel?.Name ?? string.Empty,
                Year = v.Year,
                Trim = v.Trim,
                Mileage = v.Mileage,
                ExteriorColor = v.ExteriorColor,
                InteriorColor = v.InteriorColor,
                Transmission = v.Transmission,
                Doors = v.Doors,
                Price = listing?.Price,
                IsNew = v.IsNew,
                IsCertified = v.IsCertified,
                AccidentFree = history != null ? !history.HasAccidents : null,
                PrimaryImageUrl = primaryImage,
                ListedDate = listing?.ListedDate
            };
        }).ToList();

        return new SearchVehiclesResponse
        {
            Items = results,
            Total = total,
            Page = page,
            PageSize = pageSize,
            AppliedFilters = request.Filters
        };
    }

    private IQueryable<Vehicle> BuildQuery(SearchFilters? filters)
    {
        var query = _context.Vehicles
            .Include(v => v.Make)
            .Include(v => v.VehicleModel)
            .Include(v => v.Images)
            .AsQueryable();

        if (filters == null)
            return query;

        // Filter by newest (most recently added)
        if (filters.IsNewest.HasValue && filters.IsNewest.Value)
        {
            var cutoffDate = DateTime.UtcNow.AddDays(-7);
            var newestListings = _context.Listings
                .Where(l => l.ListedDate >= cutoffDate)
                .Select(l => l.VehicleId);
            query = query.Where(v => newestListings.Contains(v.VehicleId));
        }

        // Filter by exterior color
        if (filters.Colors != null && filters.Colors.Any())
        {
            query = query.Where(v => filters.Colors.Contains(v.ExteriorColor));
        }

        // Filter by doors
        if (filters.Doors.HasValue)
        {
            query = query.Where(v => v.Doors == filters.Doors.Value);
        }

        // Filter by transmission
        if (filters.Transmissions != null && filters.Transmissions.Any())
        {
            query = query.Where(v => filters.Transmissions.Contains(v.Transmission));
        }

        // Filter by year
        if (filters.Year != null)
        {
            if (filters.Year.Min.HasValue)
                query = query.Where(v => v.Year >= filters.Year.Min.Value);
            if (filters.Year.Max.HasValue)
                query = query.Where(v => v.Year <= filters.Year.Max.Value);
        }

        // Filter by age (calculated from year)
        if (filters.Age != null)
        {
            var currentYear = DateTime.UtcNow.Year;
            if (filters.Age.Min.HasValue)
            {
                var maxYear = currentYear - filters.Age.Min.Value;
                query = query.Where(v => v.Year <= maxYear);
            }
            if (filters.Age.Max.HasValue)
            {
                var minYear = currentYear - filters.Age.Max.Value;
                query = query.Where(v => v.Year >= minYear);
            }
        }

        // Filter by make
        if (filters.Makes != null && filters.Makes.Any())
        {
            query = query.Where(v => v.Make != null && filters.Makes.Contains(v.Make.Name));
        }

        // Filter by model
        if (filters.Models != null && filters.Models.Any())
        {
            query = query.Where(v => v.VehicleModel != null && filters.Models.Contains(v.VehicleModel.Name));
        }

        // Filter by mileage/kilometers
        if (filters.Kilometers != null)
        {
            if (filters.Kilometers.Min.HasValue)
                query = query.Where(v => v.Mileage >= filters.Kilometers.Min.Value);
            if (filters.Kilometers.Max.HasValue)
                query = query.Where(v => v.Mileage <= filters.Kilometers.Max.Value);
        }

        // Filter by price (requires joining with Listings)
        if (filters.Price != null)
        {
            query = from v in query
                    join l in _context.Listings on v.VehicleId equals l.VehicleId
                    where (!filters.Price.Min.HasValue || l.Price >= filters.Price.Min.Value) &&
                          (!filters.Price.Max.HasValue || l.Price <= filters.Price.Max.Value)
                    select v;
        }

        // Filter by accident-free (requires joining with VehicleHistory)
        if (filters.AccidentFree.HasValue)
        {
            if (filters.AccidentFree.Value)
            {
                query = from v in query
                        join h in _context.VehicleHistories on v.VehicleId equals h.VehicleId
                        where !h.HasAccidents
                        select v;
            }
            else
            {
                query = from v in query
                        join h in _context.VehicleHistories on v.VehicleId equals h.VehicleId
                        where h.HasAccidents
                        select v;
            }
        }

        return query;
    }

    private IQueryable<Vehicle> ApplySorting(IQueryable<Vehicle> query, List<SortCriteria>? sortCriteria)
    {
        if (sortCriteria == null || !sortCriteria.Any())
        {
            // Default sorting: newest first, then by lowest mileage
            return query.OrderByDescending(v => v.Year).ThenBy(v => v.Mileage);
        }

        IOrderedQueryable<Vehicle>? orderedQuery = null;

        foreach (var sort in sortCriteria)
        {
            var field = sort.Field.ToLowerInvariant();
            var isAscending = sort.Direction.ToLowerInvariant() != "desc";

            // Validate sort field
            if (!AllowedSortFields.Contains(field))
                continue;

            if (orderedQuery == null)
            {
                orderedQuery = ApplyFirstSort(query, field, isAscending);
            }
            else
            {
                orderedQuery = ApplyThenSort(orderedQuery, field, isAscending);
            }
        }

        return orderedQuery ?? query.OrderByDescending(v => v.Year);
    }

    private IOrderedQueryable<Vehicle> ApplyFirstSort(IQueryable<Vehicle> query, string field, bool isAscending)
    {
        return field switch
        {
            "year" => isAscending ? query.OrderBy(v => v.Year) : query.OrderByDescending(v => v.Year),
            "mileage" => isAscending ? query.OrderBy(v => v.Mileage) : query.OrderByDescending(v => v.Mileage),
            "make" => isAscending ? query.OrderBy(v => v.Make!.Name) : query.OrderByDescending(v => v.Make!.Name),
            "model" => isAscending ? query.OrderBy(v => v.VehicleModel!.Name) : query.OrderByDescending(v => v.VehicleModel!.Name),
            "color" => isAscending ? query.OrderBy(v => v.ExteriorColor) : query.OrderByDescending(v => v.ExteriorColor),
            "doors" => isAscending ? query.OrderBy(v => v.Doors) : query.OrderByDescending(v => v.Doors),
            "transmission" => isAscending ? query.OrderBy(v => v.Transmission) : query.OrderByDescending(v => v.Transmission),
            _ => query.OrderByDescending(v => v.Year)
        };
    }

    private IOrderedQueryable<Vehicle> ApplyThenSort(IOrderedQueryable<Vehicle> query, string field, bool isAscending)
    {
        return field switch
        {
            "year" => isAscending ? query.ThenBy(v => v.Year) : query.ThenByDescending(v => v.Year),
            "mileage" => isAscending ? query.ThenBy(v => v.Mileage) : query.ThenByDescending(v => v.Mileage),
            "make" => isAscending ? query.ThenBy(v => v.Make!.Name) : query.ThenByDescending(v => v.Make!.Name),
            "model" => isAscending ? query.ThenBy(v => v.VehicleModel!.Name) : query.ThenByDescending(v => v.VehicleModel!.Name),
            "color" => isAscending ? query.ThenBy(v => v.ExteriorColor) : query.ThenByDescending(v => v.ExteriorColor),
            "doors" => isAscending ? query.ThenBy(v => v.Doors) : query.ThenByDescending(v => v.Doors),
            "transmission" => isAscending ? query.ThenBy(v => v.Transmission) : query.ThenByDescending(v => v.Transmission),
            _ => query
        };
    }
}
