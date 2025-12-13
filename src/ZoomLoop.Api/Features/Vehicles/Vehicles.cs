// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Api.Features.Vehicles;

public static class VehicleExtensions
{
    public static VehicleDto ToDto(this Vehicle vehicle)
    {
        return new VehicleDto
        {
            VehicleId = vehicle.VehicleId,
            VIN = vehicle.VIN,
            StockNumber = vehicle.StockNumber,
            MakeId = vehicle.MakeId,
            VehicleModelId = vehicle.VehicleModelId,
            Year = vehicle.Year,
            Trim = vehicle.Trim,
            Mileage = vehicle.Mileage,
            ExteriorColor = vehicle.ExteriorColor,
            InteriorColor = vehicle.InteriorColor,
            Transmission = vehicle.Transmission,
            FuelType = vehicle.FuelType,
            DriveType = vehicle.DriveType,
            BodyType = vehicle.BodyType,
            Doors = vehicle.Doors,
            Seats = vehicle.Seats,
            EngineSize = vehicle.EngineSize,
            Cylinders = vehicle.Cylinders,
            Horsepower = vehicle.Horsepower,
            CityFuelConsumption = vehicle.CityFuelConsumption,
            HighwayFuelConsumption = vehicle.HighwayFuelConsumption,
            Description = vehicle.Description,
            IsNew = vehicle.IsNew,
            IsCertified = vehicle.IsCertified,
            ManufactureDate = vehicle.ManufactureDate,
            Images = vehicle.Images.Select(x => x.ToDto()).ToList(),
            Features = vehicle.Features.Select(x => x.ToDto()).ToList()
        };
    }

    public static VehicleImageDto ToDto(this VehicleImage image)
    {
        return new VehicleImageDto
        {
            VehicleImageId = image.VehicleImageId,
            VehicleId = image.VehicleId,
            ImageUrl = image.ImageUrl,
            ThumbnailUrl = image.ThumbnailUrl,
            Caption = image.Caption,
            DisplayOrder = image.DisplayOrder,
            IsPrimary = image.IsPrimary,
            CreatedDate = image.CreatedDate
        };
    }

    public static VehicleFeatureDto ToDto(this VehicleFeature feature)
    {
        return new VehicleFeatureDto
        {
            VehicleFeatureId = feature.VehicleFeatureId,
            VehicleId = feature.VehicleId,
            Name = feature.Name,
            Category = feature.Category,
            Description = feature.Description,
            IsStandard = feature.IsStandard
        };
    }
}

// DTOs
public class VehicleDto
{
    public Guid? VehicleId { get; set; }
    public string VIN { get; set; } = string.Empty;
    public string StockNumber { get; set; } = string.Empty;
    public Guid? MakeId { get; set; }
    public Guid? VehicleModelId { get; set; }
    public int Year { get; set; }
    public string Trim { get; set; } = string.Empty;
    public int Mileage { get; set; }
    public string ExteriorColor { get; set; } = string.Empty;
    public string InteriorColor { get; set; } = string.Empty;
    public string Transmission { get; set; } = string.Empty;
    public string FuelType { get; set; } = string.Empty;
    public string DriveType { get; set; } = string.Empty;
    public string BodyType { get; set; } = string.Empty;
    public int Doors { get; set; }
    public int Seats { get; set; }
    public decimal? EngineSize { get; set; }
    public int? Cylinders { get; set; }
    public int? Horsepower { get; set; }
    public decimal? CityFuelConsumption { get; set; }
    public decimal? HighwayFuelConsumption { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsNew { get; set; }
    public bool IsCertified { get; set; }
    public DateTime? ManufactureDate { get; set; }
    public List<VehicleImageDto> Images { get; set; } = [];
    public List<VehicleFeatureDto> Features { get; set; } = [];
}

public class VehicleImageDto
{
    public Guid? VehicleImageId { get; set; }
    public Guid? VehicleId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string Caption { get; set; } = string.Empty;
    public int DisplayOrder { get; set; }
    public bool IsPrimary { get; set; }
    public DateTime CreatedDate { get; set; }
}

public class VehicleFeatureDto
{
    public Guid? VehicleFeatureId { get; set; }
    public Guid? VehicleId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsStandard { get; set; }
}

public class DigitalAssetDto
{
    public Guid? DigitalAssetId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long Size { get; set; }
    public string Url { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

// Queries
public record GetVehicleByIdRequest(Guid VehicleId) : IRequest<GetVehicleByIdResponse>;
public class GetVehicleByIdResponse
{
    public VehicleDto? Vehicle { get; set; }
}

public record GetVehiclesRequest() : IRequest<GetVehiclesResponse>;
public class GetVehiclesResponse
{
    public List<VehicleDto> Vehicles { get; set; } = [];
}

public record GetVehiclesPageRequest(int PageSize, int Index) : IRequest<GetVehiclesPageResponse>;
public class GetVehiclesPageResponse
{
    public int Length { get; set; }
    public List<VehicleDto> Entities { get; set; } = [];
}

// Commands
public record CreateVehicleRequest(VehicleDto Vehicle) : IRequest<CreateVehicleResponse>;
public class CreateVehicleResponse
{
    public VehicleDto Vehicle { get; set; } = default!;
}

public record UpdateVehicleRequest(VehicleDto Vehicle) : IRequest<UpdateVehicleResponse>;
public class UpdateVehicleResponse
{
    public VehicleDto Vehicle { get; set; } = default!;
}

public record DeleteVehicleRequest(Guid VehicleId) : IRequest<DeleteVehicleResponse>;
public class DeleteVehicleResponse
{
    public VehicleDto Vehicle { get; set; } = default!;
}

public record UploadVehicleImagesRequest(Guid VehicleId, List<IFormFile> Files) : IRequest<UploadVehicleImagesResponse>;
public class UploadVehicleImagesResponse
{
    public List<VehicleImageDto> Images { get; set; } = [];
}

// Handlers
public class GetVehicleByIdHandler : IRequestHandler<GetVehicleByIdRequest, GetVehicleByIdResponse>
{
    private readonly IZoomLoopContext _context;
    public GetVehicleByIdHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehicleByIdResponse> Handle(GetVehicleByIdRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .Include(x => x.Make)
            .Include(x => x.VehicleModel)
            .SingleOrDefaultAsync(x => x.VehicleId == request.VehicleId, cancellationToken);

        return new GetVehicleByIdResponse { Vehicle = vehicle?.ToDto() };
    }
}

public class GetVehiclesHandler : IRequestHandler<GetVehiclesRequest, GetVehiclesResponse>
{
    private readonly IZoomLoopContext _context;
    public GetVehiclesHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehiclesResponse> Handle(GetVehiclesRequest request, CancellationToken cancellationToken)
    {
        var vehicles = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .Include(x => x.Make)
            .Include(x => x.VehicleModel)
            .ToListAsync(cancellationToken);

        return new GetVehiclesResponse { Vehicles = vehicles.Select(x => x.ToDto()).ToList() };
    }
}

public class GetVehiclesPageHandler : IRequestHandler<GetVehiclesPageRequest, GetVehiclesPageResponse>
{
    private readonly IZoomLoopContext _context;
    public GetVehiclesPageHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<GetVehiclesPageResponse> Handle(GetVehiclesPageRequest request, CancellationToken cancellationToken)
    {
        var query = _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .Include(x => x.Make)
            .Include(x => x.VehicleModel);

        var length = await query.CountAsync(cancellationToken);
        var vehicles = await query
            .OrderByDescending(x => x.Year)
            .ThenBy(x => x.Mileage)
            .Skip(request.Index * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new GetVehiclesPageResponse
        {
            Length = length,
            Entities = vehicles.Select(x => x.ToDto()).ToList()
        };
    }
}

public class CreateVehicleHandler : IRequestHandler<CreateVehicleRequest, CreateVehicleResponse>
{
    private readonly IZoomLoopContext _context;
    public CreateVehicleHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<CreateVehicleResponse> Handle(CreateVehicleRequest request, CancellationToken cancellationToken)
    {
        var vehicle = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            VIN = request.Vehicle.VIN,
            StockNumber = request.Vehicle.StockNumber,
            MakeId = request.Vehicle.MakeId ?? Guid.Empty,
            VehicleModelId = request.Vehicle.VehicleModelId ?? Guid.Empty,
            Year = request.Vehicle.Year,
            Trim = request.Vehicle.Trim,
            Mileage = request.Vehicle.Mileage,
            ExteriorColor = request.Vehicle.ExteriorColor,
            InteriorColor = request.Vehicle.InteriorColor,
            Transmission = request.Vehicle.Transmission,
            FuelType = request.Vehicle.FuelType,
            DriveType = request.Vehicle.DriveType,
            BodyType = request.Vehicle.BodyType,
            Doors = request.Vehicle.Doors,
            Seats = request.Vehicle.Seats,
            EngineSize = request.Vehicle.EngineSize,
            Cylinders = request.Vehicle.Cylinders,
            Horsepower = request.Vehicle.Horsepower,
            CityFuelConsumption = request.Vehicle.CityFuelConsumption,
            HighwayFuelConsumption = request.Vehicle.HighwayFuelConsumption,
            Description = request.Vehicle.Description,
            IsNew = request.Vehicle.IsNew,
            IsCertified = request.Vehicle.IsCertified,
            ManufactureDate = request.Vehicle.ManufactureDate
        };

        // Add images if provided
        if (request.Vehicle.Images?.Any() == true)
        {
            foreach (var imageDto in request.Vehicle.Images)
            {
                var image = new VehicleImage
                {
                    VehicleImageId = Guid.NewGuid(),
                    VehicleId = vehicle.VehicleId,
                    ImageUrl = imageDto.ImageUrl,
                    ThumbnailUrl = imageDto.ThumbnailUrl,
                    Caption = imageDto.Caption,
                    DisplayOrder = imageDto.DisplayOrder,
                    IsPrimary = imageDto.IsPrimary,
                    CreatedDate = DateTime.UtcNow
                };
                vehicle.Images.Add(image);
            }
        }

        // Add features if provided
        if (request.Vehicle.Features?.Any() == true)
        {
            foreach (var featureDto in request.Vehicle.Features)
            {
                var feature = new VehicleFeature
                {
                    VehicleFeatureId = Guid.NewGuid(),
                    VehicleId = vehicle.VehicleId,
                    Name = featureDto.Name,
                    Category = featureDto.Category,
                    Description = featureDto.Description,
                    IsStandard = featureDto.IsStandard
                };
                vehicle.Features.Add(feature);
            }
        }

        _context.Vehicles.Add(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return new CreateVehicleResponse { Vehicle = vehicle.ToDto() };
    }
}

public class UpdateVehicleHandler : IRequestHandler<UpdateVehicleRequest, UpdateVehicleResponse>
{
    private readonly IZoomLoopContext _context;
    public UpdateVehicleHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UpdateVehicleResponse> Handle(UpdateVehicleRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .SingleAsync(x => x.VehicleId == request.Vehicle.VehicleId, cancellationToken);

        vehicle.VIN = request.Vehicle.VIN;
        vehicle.StockNumber = request.Vehicle.StockNumber;
        vehicle.MakeId = request.Vehicle.MakeId ?? vehicle.MakeId;
        vehicle.VehicleModelId = request.Vehicle.VehicleModelId ?? vehicle.VehicleModelId;
        vehicle.Year = request.Vehicle.Year;
        vehicle.Trim = request.Vehicle.Trim;
        vehicle.Mileage = request.Vehicle.Mileage;
        vehicle.ExteriorColor = request.Vehicle.ExteriorColor;
        vehicle.InteriorColor = request.Vehicle.InteriorColor;
        vehicle.Transmission = request.Vehicle.Transmission;
        vehicle.FuelType = request.Vehicle.FuelType;
        vehicle.DriveType = request.Vehicle.DriveType;
        vehicle.BodyType = request.Vehicle.BodyType;
        vehicle.Doors = request.Vehicle.Doors;
        vehicle.Seats = request.Vehicle.Seats;
        vehicle.EngineSize = request.Vehicle.EngineSize;
        vehicle.Cylinders = request.Vehicle.Cylinders;
        vehicle.Horsepower = request.Vehicle.Horsepower;
        vehicle.CityFuelConsumption = request.Vehicle.CityFuelConsumption;
        vehicle.HighwayFuelConsumption = request.Vehicle.HighwayFuelConsumption;
        vehicle.Description = request.Vehicle.Description;
        vehicle.IsNew = request.Vehicle.IsNew;
        vehicle.IsCertified = request.Vehicle.IsCertified;
        vehicle.ManufactureDate = request.Vehicle.ManufactureDate;

        await _context.SaveChangesAsync(cancellationToken);

        return new UpdateVehicleResponse { Vehicle = vehicle.ToDto() };
    }
}

public class DeleteVehicleHandler : IRequestHandler<DeleteVehicleRequest, DeleteVehicleResponse>
{
    private readonly IZoomLoopContext _context;
    public DeleteVehicleHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<DeleteVehicleResponse> Handle(DeleteVehicleRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .Include(x => x.Features)
            .SingleAsync(x => x.VehicleId == request.VehicleId, cancellationToken);

        _context.Vehicles.Remove(vehicle);
        await _context.SaveChangesAsync(cancellationToken);

        return new DeleteVehicleResponse { Vehicle = vehicle.ToDto() };
    }
}

public class UploadVehicleImagesHandler : IRequestHandler<UploadVehicleImagesRequest, UploadVehicleImagesResponse>
{
    private readonly IZoomLoopContext _context;
    public UploadVehicleImagesHandler(IZoomLoopContext context)
        => _context = context;

    public async Task<UploadVehicleImagesResponse> Handle(UploadVehicleImagesRequest request, CancellationToken cancellationToken)
    {
        var vehicle = await _context.Vehicles
            .Include(x => x.Images)
            .SingleAsync(x => x.VehicleId == request.VehicleId, cancellationToken);

        var images = new List<VehicleImage>();
        var currentMaxOrder = vehicle.Images.Any() ? vehicle.Images.Max(x => x.DisplayOrder) : 0;

        foreach (var file in request.Files)
        {
            if (file.Length > 0)
            {
                using var memoryStream = new MemoryStream();
                await file.CopyToAsync(memoryStream, cancellationToken);

                var digitalAsset = new DigitalAsset
                {
                    DigitalAssetId = Guid.NewGuid(),
                    Name = file.FileName,
                    ContentType = file.ContentType,
                    Size = file.Length,
                    Url = $"/assets/vehicles/{request.VehicleId}/{file.FileName}",
                    CreatedDate = DateTime.UtcNow
                };

                _context.DigitalAssets.Add(digitalAsset);

                var image = new VehicleImage
                {
                    VehicleImageId = Guid.NewGuid(),
                    VehicleId = request.VehicleId,
                    ImageUrl = digitalAsset.Url,
                    ThumbnailUrl = digitalAsset.Url,
                    Caption = string.Empty,
                    DisplayOrder = ++currentMaxOrder,
                    IsPrimary = !vehicle.Images.Any(),
                    CreatedDate = DateTime.UtcNow
                };

                vehicle.Images.Add(image);
                images.Add(image);
            }
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new UploadVehicleImagesResponse { Images = images.Select(x => x.ToDto()).ToList() };
    }
}
