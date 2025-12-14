// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using NSubstitute;
using NUnit.Framework;
using ZoomLoop.Api.Features.Vehicles;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.VehicleIngestion;

namespace ZoomLoop.UnitTests.Features.Vehicles;

[TestFixture]
public class VehicleIngestTests
{
    private InMemoryZoomLoopContext _context = default!;
    private IVehicleIngestionService _vehicleIngestionService = default!;

    [SetUp]
    public void Setup()
    {
        var options = new DbContextOptionsBuilder<InMemoryZoomLoopContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        _context = new InMemoryZoomLoopContext(options);
        _vehicleIngestionService = Substitute.For<IVehicleIngestionService>();
    }

    [TearDown]
    public void TearDown()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    [Test]
    public async Task ShouldIngestVehicleFromImages()
    {
        // Arrange
        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Honda",
            Model = "Civic",
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 4,
            Description = "A well-maintained Honda Civic in excellent condition."
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile = CreateMockFormFile("test-image.jpg", "image/jpeg", new byte[] { 1, 2, 3, 4, 5 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Vehicle, Is.Not.Null);
        Assert.That(result.Vehicle.VehicleId, Is.Not.Null);
        Assert.That(result.Vehicle.VIN, Is.EqualTo("1HGBH41JXMN109186"));
        Assert.That(result.Vehicle.Year, Is.EqualTo(2023));
        Assert.That(result.Vehicle.Doors, Is.EqualTo(4));
        Assert.That(result.Vehicle.Description, Is.EqualTo("A well-maintained Honda Civic in excellent condition."));

        var savedVehicle = await _context.Vehicles
            .Include(v => v.Images)
            .FirstOrDefaultAsync();
        Assert.That(savedVehicle, Is.Not.Null);
        Assert.That(savedVehicle!.VIN, Is.EqualTo("1HGBH41JXMN109186"));
        Assert.That(savedVehicle.Images, Has.Count.EqualTo(1));
        Assert.That(savedVehicle.Images[0].IsPrimary, Is.True);
    }

    [Test]
    public async Task ShouldCreateNewMakeWhenNotExists()
    {
        // Arrange
        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Tesla",
            Model = "Model 3",
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 4,
            Description = "Electric vehicle"
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile = CreateMockFormFile("test-image.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var make = await _context.Makes.FirstOrDefaultAsync(m => m.Name == "Tesla");
        Assert.That(make, Is.Not.Null);
        Assert.That(make!.Name, Is.EqualTo("Tesla"));
        Assert.That(make.IsActive, Is.True);
    }

    [Test]
    public async Task ShouldUseExistingMakeWhenExists()
    {
        // Arrange
        var existingMake = new Make
        {
            MakeId = Guid.NewGuid(),
            Name = "Toyota",
            LogoUrl = "toyota-logo.png",
            IsActive = true
        };
        _context.Makes.Add(existingMake);
        await _context.SaveChangesAsync();

        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Toyota",
            Model = "Camry",
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 4,
            Description = "Reliable sedan"
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile = CreateMockFormFile("test-image.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var makes = await _context.Makes.Where(m => m.Name == "Toyota").ToListAsync();
        Assert.That(makes, Has.Count.EqualTo(1));
        Assert.That(result.Vehicle.MakeId, Is.EqualTo(existingMake.MakeId));
    }

    [Test]
    public async Task ShouldCreateNewVehicleModelWhenNotExists()
    {
        // Arrange
        var make = new Make
        {
            MakeId = Guid.NewGuid(),
            Name = "Ford",
            LogoUrl = "ford-logo.png",
            IsActive = true
        };
        _context.Makes.Add(make);
        await _context.SaveChangesAsync();

        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Ford",
            Model = "Mustang",
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 2,
            Description = "Sports car"
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile = CreateMockFormFile("test-image.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var vehicleModel = await _context.VehicleModels.FirstOrDefaultAsync(vm => vm.Name == "Mustang");
        Assert.That(vehicleModel, Is.Not.Null);
        Assert.That(vehicleModel!.Name, Is.EqualTo("Mustang"));
        Assert.That(vehicleModel.IsActive, Is.True);
    }

    [Test]
    public async Task ShouldCreateDigitalAssetsForImages()
    {
        // Arrange
        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Honda",
            Model = "Civic",
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 4,
            Description = "Test vehicle"
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile1 = CreateMockFormFile("image1.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        var imageFile2 = CreateMockFormFile("image2.jpg", "image/jpeg", new byte[] { 4, 5, 6 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile1, imageFile2 });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        var digitalAssets = await _context.DigitalAssets.ToListAsync();
        Assert.That(digitalAssets, Has.Count.EqualTo(2));
        Assert.That(digitalAssets[0].Name, Is.EqualTo("image1.jpg"));
        Assert.That(digitalAssets[1].Name, Is.EqualTo("image2.jpg"));
        Assert.That(digitalAssets[0].ContentType, Is.EqualTo("image/jpeg"));
    }

    [Test]
    public async Task ShouldSetFirstImageAsPrimary()
    {
        // Arrange
        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Honda",
            Model = "Civic",
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 4,
            Description = "Test vehicle"
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile1 = CreateMockFormFile("image1.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        var imageFile2 = CreateMockFormFile("image2.jpg", "image/jpeg", new byte[] { 4, 5, 6 });
        var imageFile3 = CreateMockFormFile("image3.jpg", "image/jpeg", new byte[] { 7, 8, 9 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile1, imageFile2, imageFile3 });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result.Vehicle.Images, Has.Count.EqualTo(3));
        Assert.That(result.Vehicle.Images[0].IsPrimary, Is.True);
        Assert.That(result.Vehicle.Images[0].DisplayOrder, Is.EqualTo(1));
        Assert.That(result.Vehicle.Images[1].IsPrimary, Is.False);
        Assert.That(result.Vehicle.Images[1].DisplayOrder, Is.EqualTo(2));
        Assert.That(result.Vehicle.Images[2].IsPrimary, Is.False);
        Assert.That(result.Vehicle.Images[2].DisplayOrder, Is.EqualTo(3));
    }

    [Test]
    public async Task ShouldUpdateExistingVehicleWhenVINExists()
    {
        // Arrange - Create and save an existing vehicle first
        var existingMake = new Make
        {
            MakeId = Guid.NewGuid(),
            Name = "Toyota",
            LogoUrl = "toyota-logo.png",
            IsActive = true
        };
        _context.Makes.Add(existingMake);

        var existingModel = new VehicleModel
        {
            VehicleModelId = Guid.NewGuid(),
            MakeId = existingMake.MakeId,
            Name = "Camry",
            Description = "Sedan",
            IsActive = true
        };
        _context.VehicleModels.Add(existingModel);

        var existingVehicle = new Vehicle
        {
            VehicleId = Guid.NewGuid(),
            VIN = "1HGBH41JXMN109186",
            StockNumber = "OLD123",
            MakeId = existingMake.MakeId,
            VehicleModelId = existingModel.VehicleModelId,
            Year = 2020,
            Doors = 2,
            Description = "Old description"
        };
        _context.Vehicles.Add(existingVehicle);
        await _context.SaveChangesAsync();
        
        var existingVehicleId = existingVehicle.VehicleId;

        // Arrange - Setup ingestion result with SAME make/model to avoid creating new ones
        var ingestionResult = new VehicleIngestionResult
        {
            VIN = "1HGBH41JXMN109186",
            Year = 2023,
            Make = "Toyota", // Same make
            Model = "Camry", // Same model
            InteriorCondition = "Good",
            ExteriorCondition = "Excellent",
            NumberOfDoors = 4,
            Description = "Updated vehicle with new information from AI analysis."
        };

        _vehicleIngestionService
            .IngestVehicleAsync(Arg.Any<VehicleIngestionRequest>(), Arg.Any<CancellationToken>())
            .Returns(ingestionResult);

        var handler = new VehicleIngestHandler(_context, _vehicleIngestionService);

        var imageFile = CreateMockFormFile("test-image.jpg", "image/jpeg", new byte[] { 1, 2, 3 });
        var request = new VehicleIngestRequest(new List<IFormFile> { imageFile });

        // Act
        var result = await handler.Handle(request, CancellationToken.None);

        // Assert
        Assert.That(result, Is.Not.Null);
        Assert.That(result.Vehicle.VehicleId, Is.EqualTo(existingVehicleId));
        Assert.That(result.Vehicle.VIN, Is.EqualTo("1HGBH41JXMN109186"));
        Assert.That(result.Vehicle.Year, Is.EqualTo(2023));
        Assert.That(result.Vehicle.Doors, Is.EqualTo(4));
        Assert.That(result.Vehicle.Description, Is.EqualTo("Updated vehicle with new information from AI analysis."));

        var vehicles = await _context.Vehicles.ToListAsync();
        Assert.That(vehicles, Has.Count.EqualTo(1)); // Should still be only 1 vehicle
        Assert.That(vehicles[0].VehicleId, Is.EqualTo(existingVehicleId));
        Assert.That(vehicles[0].Year, Is.EqualTo(2023)); // Updated
        Assert.That(vehicles[0].Doors, Is.EqualTo(4)); // Updated
    }

    private static IFormFile CreateMockFormFile(string fileName, string contentType, byte[] content)
    {
        var stream = new MemoryStream(content);
        var formFile = new FormFile(stream, 0, content.Length, "file", fileName)
        {
            Headers = new HeaderDictionary(),
            ContentType = contentType
        };
        return formFile;
    }
}
