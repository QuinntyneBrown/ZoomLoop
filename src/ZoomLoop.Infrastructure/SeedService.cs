// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using System.Security.Cryptography;
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

        _logger.LogInformation("Seeding default admin user...");

        var adminRole = await _context.Roles.FirstOrDefaultAsync(r => r.Name == "Administrator");

        if (adminRole == null)
        {
            _logger.LogWarning("Administrator role not found, cannot create admin user.");
            return;
        }

        var salt = RandomNumberGenerator.GetBytes(16);
        var password = _passwordHasher.HashPassword(salt, "Admin123!");

        var adminUser = new User
        {
            UserId = Guid.NewGuid(),
            Username = "admin",
            Password = password,
            Salt = salt,
            Roles = new List<Role> { adminRole }
        };

        _context.Users.Add(adminUser);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Admin user seeded successfully.");
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
                VehicleModels = new List<VehicleModel>
                {
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Camry", Description = "Mid-size sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Corolla", Description = "Compact sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "RAV4", Description = "Compact SUV", IsActive = true }
                }
            },
            new Make
            {
                MakeId = Guid.NewGuid(),
                Name = "Honda",
                LogoUrl = string.Empty,
                IsActive = true,
                DisplayOrder = 2,
                VehicleModels = new List<VehicleModel>
                {
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Accord", Description = "Mid-size sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Civic", Description = "Compact sedan", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "CR-V", Description = "Compact SUV", IsActive = true }
                }
            },
            new Make
            {
                MakeId = Guid.NewGuid(),
                Name = "Ford",
                LogoUrl = string.Empty,
                IsActive = true,
                DisplayOrder = 3,
                VehicleModels = new List<VehicleModel>
                {
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "F-150", Description = "Full-size pickup truck", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Escape", Description = "Compact SUV", IsActive = true },
                    new VehicleModel { VehicleModelId = Guid.NewGuid(), Name = "Explorer", Description = "Mid-size SUV", IsActive = true }
                }
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
}
