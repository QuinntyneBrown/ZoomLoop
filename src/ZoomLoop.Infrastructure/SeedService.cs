// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;
using ZoomLoop.Core.Services.Security;

namespace ZoomLoop.Infrastructure;

public class SeedService : ISeedService
{
    private readonly IZoomLoopContext _context;
    private readonly IPasswordHasher _passwordHasher;
    private readonly ILogger<SeedService> _logger;

    public SeedService(
        IZoomLoopContext context,
        IPasswordHasher passwordHasher,
        ILogger<SeedService> logger)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        _logger.LogInformation("Starting database seeding...");

        await SeedRolesAndPrivilegesAsync();
        await SeedUsersAsync();
        await SeedMakesAndModelsAsync();
        await SeedVehiclesAsync();

        _logger.LogInformation("Database seeding completed successfully.");
    }

    private async Task SeedRolesAndPrivilegesAsync()
    {
        if (await _context.Roles.AnyAsync())
        {
            _logger.LogInformation("Roles already exist, skipping role seeding.");
            return;
        }

        _logger.LogInformation("Seeding roles and privileges...");

        var adminRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Administrator"
        };

        var dealerRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "Dealer"
        };

        var userRole = new Role
        {
            RoleId = Guid.NewGuid(),
            Name = "User"
        };

        _context.Roles.Add(adminRole);
        _context.Roles.Add(dealerRole);
        _context.Roles.Add(userRole);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Roles seeded successfully.");
    }

    private async Task SeedUsersAsync()
    {
        if (await _context.Users.AnyAsync())
        {
            _logger.LogInformation("Users already exist, skipping user seeding.");
            return;
        }

        _logger.LogInformation("Seeding default users...");

        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Administrator");
        var userRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "User");

        if (adminRole == null)
        {
            _logger.LogWarning("Administrator role not found, cannot create admin user.");
            return;
        }

        var now = DateTime.UtcNow;

        var adminUser = new User
        {
            UserId = Guid.NewGuid(),
            Email = "admin@zoomloop.com",
            PasswordHash = _passwordHasher.HashPassword("Admin123!"),
            FirstName = "Admin",
            LastName = "User",
            EmailVerified = true,
            EmailVerifiedAt = now,
            Status = UserStatus.Active,
            CreatedAt = now,
            UpdatedAt = now,
            Roles = [adminRole]
        };

        _context.Users.Add(adminUser);

        if (userRole != null)
        {
            var testUser = new User
            {
                UserId = Guid.NewGuid(),
                Email = "test@zoomloop.com",
                PasswordHash = _passwordHasher.HashPassword("Test123!"),
                FirstName = "Test",
                LastName = "User",
                Phone = "555-0100",
                EmailVerified = true,
                EmailVerifiedAt = now,
                Status = UserStatus.Active,
                CreatedAt = now,
                UpdatedAt = now,
                Roles = [userRole]
            };

            _context.Users.Add(testUser);
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Users seeded successfully.");
    }

    private async Task SeedMakesAndModelsAsync()
    {
        if (await _context.Makes.AnyAsync())
        {
            _logger.LogInformation("Makes already exist, skipping make seeding.");
            return;
        }

        _logger.LogInformation("Seeding vehicle makes and models...");

        var makes = new List<Make>
        {
            new Make
            {
                MakeId = Guid.NewGuid(),
                Name = "Toyota",
                LogoUrl = string.Empty,
                IsActive = true,
                DisplayOrder = 1,
                VehicleModels =
                [
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Camry", Description = "Mid-size sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Corolla", Description = "Compact sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "RAV4", Description = "Compact SUV", IsActive = true }
                ]
            },
            new Make
            {
                MakeId = Guid.NewGuid(),
                Name = "Honda",
                LogoUrl = string.Empty,
                IsActive = true,
                DisplayOrder = 2,
                VehicleModels =
                [
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Accord", Description = "Mid-size sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Civic", Description = "Compact sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "CR-V", Description = "Compact SUV", IsActive = true }
                ]
            },
            new Make
            {
                MakeId = Guid.NewGuid(),
                Name = "Ford",
                LogoUrl = string.Empty,
                IsActive = true,
                DisplayOrder = 3,
                VehicleModels =
                [
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "F-150", Description = "Full-size pickup truck", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Escape", Description = "Compact SUV", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Explorer", Description = "Mid-size SUV", IsActive = true }
                ]
            }
        };

        foreach (var make in makes)
        {
            foreach (var model in make.VehicleModels)
            {
                model.MakeId = make.MakeId;
            }
        }

        _context.Makes.AddRange(makes);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Vehicle makes and models seeded successfully.");
    }

    private async Task SeedVehiclesAsync()
    {
        if (await _context.Vehicles.AnyAsync())
        {
            _logger.LogInformation("Vehicles already exist, skipping vehicle seeding.");
            return;
        }

        _logger.LogInformation("Seeding vehicles...");

        var makes = await _context.Makes.Include(m => m.VehicleModels).ToListAsync();

        if (!makes.Any())
        {
            _logger.LogWarning("No makes found, cannot seed vehicles.");
            return;
        }

        var random = new Random(42);
        var exteriorColors = new[] { "Sonic Gray", "Magnetic Gray", "Pearl White", "Agate Black", "Soul Red", "Alpine White", "Gravity Gray", "Amazon Gray", "Midnight Blue", "Silver Metallic" };
        var interiorColors = new[] { "Black", "Gray", "Beige", "Tan", "Parchment", "Brown" };
        var transmissions = new[] { "Automatic", "Manual" };
        var fuelTypes = new[] { "Gasoline", "Diesel", "Electric", "Hybrid" };
        var driveTypes = new[] { "FWD", "RWD", "AWD", "4WD" };
        var bodyTypes = new[] { "Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Wagon" };
        var trims = new[] { "Base", "Sport", "Limited", "Touring", "XLE", "SE", "XLT", "GT", "Premium", "Platinum" };

        var vehicles = new List<Vehicle>();
        var now = DateTime.UtcNow;

        for (int i = 1; i <= 20; i++)
        {
            var make = makes[random.Next(makes.Count)];
            var model = make.VehicleModels[random.Next(make.VehicleModels.Count)];
            var year = random.Next(2019, 2025);
            var isNew = year >= 2024;
            var mileage = isNew ? random.Next(0, 500) : random.Next(5000, 120000);
            var basePrice = random.Next(20000, 65000);
            var vehicleId = Guid.NewGuid();

            var vehicle = new Vehicle
            {
                VehicleId = vehicleId,
                VIN = $"1HGCM{random.Next(10000, 99999)}A{random.Next(100000, 999999)}",
                StockNumber = $"STK{i:D4}",
                MakeId = make.MakeId,
                VehicleModelId = model.VehicleModelId,
                Year = year,
                Trim = trims[random.Next(trims.Length)],
                Mileage = mileage,
                ExteriorColor = exteriorColors[random.Next(exteriorColors.Length)],
                InteriorColor = interiorColors[random.Next(interiorColors.Length)],
                Transmission = transmissions[random.Next(transmissions.Length)],
                FuelType = fuelTypes[random.Next(fuelTypes.Length)],
                DriveType = driveTypes[random.Next(driveTypes.Length)],
                BodyType = bodyTypes[random.Next(bodyTypes.Length)],
                Doors = random.Next(2, 5) == 2 ? 2 : 4,
                Seats = random.Next(4, 8),
                EngineSize = Math.Round((decimal)(1.5 + random.NextDouble() * 2.5), 1),
                Cylinders = random.Next(3, 9),
                Horsepower = random.Next(150, 400),
                CityFuelConsumption = Math.Round((decimal)(7 + random.NextDouble() * 6), 1),
                HighwayFuelConsumption = Math.Round((decimal)(5 + random.NextDouble() * 4), 1),
                Description = $"Well-maintained {year} {make.Name} {model.Name} in excellent condition.",
                IsNew = isNew,
                IsCertified = !isNew && random.Next(0, 2) == 1,
                ManufactureDate = new DateTime(year, random.Next(1, 13), 1),
                Images =
                [
                    new VehicleImage
                    {
                        VehicleImageId = Guid.NewGuid(),
                        VehicleId = vehicleId,
                        ImageUrl = $"https://images.unsplash.com/photo-{1550000000 + i * 1000}?w=800",
                        ThumbnailUrl = $"https://images.unsplash.com/photo-{1550000000 + i * 1000}?w=200",
                        Caption = $"{year} {make.Name} {model.Name} - Exterior",
                        DisplayOrder = 1,
                        IsPrimary = true,
                        CreatedDate = now
                    }
                ]
            };

            vehicles.Add(vehicle);
        }

        _context.Vehicles.AddRange(vehicles);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Seeded {Count} vehicles successfully.", vehicles.Count);
    }
}
