// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using ZoomLoop.Api.Features.Vehicles;
using ZoomLoop.Core.Models;

namespace ZoomLoop.UnitTests.Features.Vehicles;

[TestFixture]
public class SearchVehiclesHandlerTests
{
    private InMemoryZoomLoopContext _context = default!;
    private SearchVehiclesHandler _handler = default!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<InMemoryZoomLoopContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new InMemoryZoomLoopContext(options);
        _handler = new SearchVehiclesHandler(_context);
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task Handle_WithNoFilters_ReturnsAllVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Page = 1,
            PageSize = 20
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(3));
        Assert.That(response.Items.Count, Is.EqualTo(3));
        Assert.That(response.Page, Is.EqualTo(1));
        Assert.That(response.PageSize, Is.EqualTo(20));
    }

    [Test]
    public async Task Handle_FilterByMake_ReturnsMatchingVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Filters = new SearchFilters
            {
                Makes = new List<string> { "Toyota" }
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(2));
        Assert.That(response.Items.All(v => v.Make == "Toyota"), Is.True);
    }

    [Test]
    public async Task Handle_FilterByYearRange_ReturnsMatchingVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Filters = new SearchFilters
            {
                Year = new IntRange { Min = 2020, Max = 2023 }
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(2));
        Assert.That(response.Items.All(v => v.Year >= 2020 && v.Year <= 2023), Is.True);
    }

    [Test]
    public async Task Handle_FilterByColor_ReturnsMatchingVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Filters = new SearchFilters
            {
                Colors = new List<string> { "Red" }
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(1));
        Assert.That(response.Items.All(v => v.ExteriorColor == "Red"), Is.True);
    }

    [Test]
    public async Task Handle_FilterByPrice_ReturnsMatchingVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Filters = new SearchFilters
            {
                Price = new PriceRange { Min = 20000, Max = 30000 }
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(2));
        Assert.That(response.Items.All(v => v.Price >= 20000 && v.Price <= 30000), Is.True);
    }

    [Test]
    public async Task Handle_FilterByAccidentFree_ReturnsMatchingVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Filters = new SearchFilters
            {
                AccidentFree = true
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(2));
        Assert.That(response.Items.All(v => v.AccidentFree == true), Is.True);
    }

    [Test]
    public async Task Handle_SortByYearDescending_ReturnsSortedVehicles()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Sort = new List<SortCriteria>
            {
                new SortCriteria { Field = "year", Direction = "desc" }
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Items.Count, Is.EqualTo(3));
        Assert.That(response.Items[0].Year, Is.GreaterThanOrEqualTo(response.Items[1].Year));
        Assert.That(response.Items[1].Year, Is.GreaterThanOrEqualTo(response.Items[2].Year));
    }

    [Test]
    public async Task Handle_WithPagination_ReturnsCorrectPage()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Page = 2,
            PageSize = 2
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(3));
        Assert.That(response.Items.Count, Is.EqualTo(1));
        Assert.That(response.Page, Is.EqualTo(2));
    }

    [Test]
    public async Task Handle_ValidatesPageSize_ClampsToMaximum()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            PageSize = 500
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.PageSize, Is.EqualTo(100));
    }

    [Test]
    public async Task Handle_MultipleFilters_AppliesAllFilters()
    {
        // Arrange
        await SeedTestData();
        var request = new SearchVehiclesRequest
        {
            Filters = new SearchFilters
            {
                Makes = new List<string> { "Toyota" },
                Year = new IntRange { Min = 2020 },
                Colors = new List<string> { "Red" }
            }
        };

        // Act
        var response = await _handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(response.Total, Is.EqualTo(1));
        var item = response.Items.First();
        Assert.That(item.Make, Is.EqualTo("Toyota"));
        Assert.That(item.Year, Is.GreaterThanOrEqualTo(2020));
        Assert.That(item.ExteriorColor, Is.EqualTo("Red"));
    }

    private async Task SeedTestData()
    {
        var toyotaMake = new Make { MakeId = Guid.NewGuid(), Name = "Toyota" };
        var hondaMake = new Make { MakeId = Guid.NewGuid(), Name = "Honda" };

        var camryModel = new VehicleModel { VehicleModelId = Guid.NewGuid(), MakeId = toyotaMake.MakeId, Name = "Camry" };
        var corollaModel = new VehicleModel { VehicleModelId = Guid.NewGuid(), MakeId = toyotaMake.MakeId, Name = "Corolla" };
        var civicModel = new VehicleModel { VehicleModelId = Guid.NewGuid(), MakeId = hondaMake.MakeId, Name = "Civic" };

        toyotaMake.VehicleModels = new List<VehicleModel> { camryModel, corollaModel };
        hondaMake.VehicleModels = new List<VehicleModel> { civicModel };

        _context.Makes.AddRange(toyotaMake, hondaMake);
        _context.VehicleModels.AddRange(camryModel, corollaModel, civicModel);

        var vehicle1 = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            VIN = "1HGBH41JXMN109186",
            MakeId = toyotaMake.MakeId,
            VehicleModelId = camryModel.VehicleModelId,
            Year = 2020,
            Mileage = 50000,
            ExteriorColor = "Red",
            InteriorColor = "Black",
            Transmission = "Automatic",
            Doors = 4,
            IsNew = false,
            IsCertified = true
        };

        var vehicle2 = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            VIN = "2HGBH41JXMN109187",
            MakeId = toyotaMake.MakeId,
            VehicleModelId = corollaModel.VehicleModelId,
            Year = 2022,
            Mileage = 20000,
            ExteriorColor = "Blue",
            InteriorColor = "Gray",
            Transmission = "Automatic",
            Doors = 4,
            IsNew = false,
            IsCertified = true
        };

        var vehicle3 = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            VIN = "3HGBH41JXMN109188",
            MakeId = hondaMake.MakeId,
            VehicleModelId = civicModel.VehicleModelId,
            Year = 2019,
            Mileage = 75000,
            ExteriorColor = "White",
            InteriorColor = "Black",
            Transmission = "Manual",
            Doors = 2,
            IsNew = false,
            IsCertified = false
        };

        _context.Vehicles.AddRange(vehicle1, vehicle2, vehicle3);

        var listing1 = new Listing
        {
            ListingId = Guid.NewGuid(),
            VehicleId = vehicle1.VehicleId,
            Price = 25000,
            Status = "Active",
            ListingType = "Sale",
            ListedDate = DateTime.UtcNow.AddDays(-5)
        };

        var listing2 = new Listing
        {
            ListingId = Guid.NewGuid(),
            VehicleId = vehicle2.VehicleId,
            Price = 28000,
            Status = "Active",
            ListingType = "Sale",
            ListedDate = DateTime.UtcNow.AddDays(-3)
        };

        var listing3 = new Listing
        {
            ListingId = Guid.NewGuid(),
            VehicleId = vehicle3.VehicleId,
            Price = 15000,
            Status = "Active",
            ListingType = "Sale",
            ListedDate = DateTime.UtcNow.AddDays(-10)
        };

        _context.Listings.AddRange(listing1, listing2, listing3);

        var history1 = new VehicleHistory
        {
            VehicleHistoryId = Guid.NewGuid(),
            VehicleId = vehicle1.VehicleId,
            VIN = vehicle1.VIN,
            HasAccidents = false,
            ReportType = "CarFax",
            ReportProvider = "CarFax",
            ReportData = "{}",
            ReportDate = DateTime.UtcNow
        };

        var history2 = new VehicleHistory
        {
            VehicleHistoryId = Guid.NewGuid(),
            VehicleId = vehicle2.VehicleId,
            VIN = vehicle2.VIN,
            HasAccidents = false,
            ReportType = "CarFax",
            ReportProvider = "CarFax",
            ReportData = "{}",
            ReportDate = DateTime.UtcNow
        };

        var history3 = new VehicleHistory
        {
            VehicleHistoryId = Guid.NewGuid(),
            VehicleId = vehicle3.VehicleId,
            VIN = vehicle3.VIN,
            HasAccidents = true,
            ReportType = "CarFax",
            ReportProvider = "CarFax",
            ReportData = "{}",
            ReportDate = DateTime.UtcNow
        };

        _context.VehicleHistories.AddRange(history1, history2, history3);

        await _context.SaveChangesAsync();
    }
}
