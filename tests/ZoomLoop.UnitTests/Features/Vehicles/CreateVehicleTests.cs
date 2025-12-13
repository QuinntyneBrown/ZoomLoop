// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using ZoomLoop.Api.Features.Vehicles;
using ZoomLoop.Core.Models;

namespace ZoomLoop.UnitTests.Features.Vehicles;

[TestFixture]
public class CreateVehicleTests
{
    private InMemoryZoomLoopContext _context = default!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<InMemoryZoomLoopContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new InMemoryZoomLoopContext(options);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task ShouldCreateVehicle()
    {
        // Arrange
        var make = new Make
        {
            MakeId = Guid.NewGuid(),
            Name = "Toyota",
            LogoUrl = "toyota-logo.png",
            IsActive = true
        };

        var vehicleModel = new VehicleModel
        {
            VehicleModelId = Guid.NewGuid(),
            MakeId = make.MakeId,
            Name = "Camry",
            Description = "Sedan",
            IsActive = true
        };

        _context.Makes.Add(make);
        _context.VehicleModels.Add(vehicleModel);
        await _context.SaveChangesAsync();

        var handler = new CreateVehicleHandler(_context);
        var vehicleDto = new VehicleDto
        {
            VIN = "1HGBH41JXMN109186",
            StockNumber = "STK123",
            MakeId = make.MakeId,
            VehicleModelId = vehicleModel.VehicleModelId,
            Year = 2023,
            Trim = "LE",
            Mileage = 15000,
            ExteriorColor = "Silver",
            InteriorColor = "Black",
            Transmission = "Automatic",
            FuelType = "Gasoline",
            DriveType = "FWD",
            BodyType = "Sedan",
            Doors = 4,
            Seats = 5,
            EngineSize = 2.5m,
            Cylinders = 4,
            Horsepower = 203,
            CityFuelConsumption = 8.1m,
            HighwayFuelConsumption = 5.9m,
            Description = "Well-maintained vehicle",
            IsNew = false,
            IsCertified = true
        };

        var request = new CreateVehicleRequest(vehicleDto);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Vehicle, Is.Not.Null);
        Assert.That(result.Vehicle.VehicleId, Is.Not.Null);
        Assert.That(result.Vehicle.VIN, Is.EqualTo("1HGBH41JXMN109186"));
        Assert.That(result.Vehicle.Year, Is.EqualTo(2023));
        Assert.That(result.Vehicle.MakeId, Is.EqualTo(make.MakeId));

        var savedVehicle = await _context.Vehicles.FirstOrDefaultAsync();
        Assert.That(savedVehicle, Is.Not.Null);
        Assert.That(savedVehicle!.VIN, Is.EqualTo("1HGBH41JXMN109186"));
    }

    [Test]
    public async Task ShouldCreateVehicleWithImages()
    {
        // Arrange
        var handler = new CreateVehicleHandler(_context);
        var vehicleDto = new VehicleDto
        {
            VIN = "1HGBH41JXMN109186",
            StockNumber = "STK123",
            Year = 2023,
            Trim = "LE",
            Mileage = 15000,
            ExteriorColor = "Silver",
            InteriorColor = "Black",
            Transmission = "Automatic",
            FuelType = "Gasoline",
            DriveType = "FWD",
            BodyType = "Sedan",
            Doors = 4,
            Seats = 5,
            Description = "Well-maintained vehicle",
            IsNew = false,
            IsCertified = true,
            Images = new List<VehicleImageDto>
            {
                new VehicleImageDto
                {
                    ImageUrl = "/assets/image1.jpg",
                    ThumbnailUrl = "/assets/thumb1.jpg",
                    Caption = "Front view",
                    DisplayOrder = 1,
                    IsPrimary = true
                },
                new VehicleImageDto
                {
                    ImageUrl = "/assets/image2.jpg",
                    ThumbnailUrl = "/assets/thumb2.jpg",
                    Caption = "Side view",
                    DisplayOrder = 2,
                    IsPrimary = false
                }
            }
        };

        var request = new CreateVehicleRequest(vehicleDto);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result.Vehicle.Images, Has.Count.EqualTo(2));
        Assert.That(result.Vehicle.Images[0].ImageUrl, Is.EqualTo("/assets/image1.jpg"));
        Assert.That(result.Vehicle.Images[0].IsPrimary, Is.True);
    }

    [Test]
    public async Task ShouldCreateVehicleWithFeatures()
    {
        // Arrange
        var handler = new CreateVehicleHandler(_context);
        var vehicleDto = new VehicleDto
        {
            VIN = "1HGBH41JXMN109186",
            StockNumber = "STK123",
            Year = 2023,
            Trim = "LE",
            Mileage = 15000,
            ExteriorColor = "Silver",
            InteriorColor = "Black",
            Transmission = "Automatic",
            FuelType = "Gasoline",
            DriveType = "FWD",
            BodyType = "Sedan",
            Doors = 4,
            Seats = 5,
            Description = "Well-maintained vehicle",
            IsNew = false,
            IsCertified = true,
            Features = new List<VehicleFeatureDto>
            {
                new VehicleFeatureDto
                {
                    Name = "Backup Camera",
                    Category = "Safety",
                    Description = "Rearview camera",
                    IsStandard = true
                },
                new VehicleFeatureDto
                {
                    Name = "Bluetooth",
                    Category = "Technology",
                    Description = "Bluetooth connectivity",
                    IsStandard = true
                }
            }
        };

        var request = new CreateVehicleRequest(vehicleDto);

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result.Vehicle.Features, Has.Count.EqualTo(2));
        Assert.That(result.Vehicle.Features[0].Name, Is.EqualTo("Backup Camera"));
        Assert.That(result.Vehicle.Features[1].Name, Is.EqualTo("Bluetooth"));
    }
}
