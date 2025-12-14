// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.UnitTests;

public class InMemoryZoomLoopContext : DbContext, IZoomLoopContext
{
    public InMemoryZoomLoopContext(DbContextOptions<InMemoryZoomLoopContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = default!;
    public DbSet<Role> Roles { get; set; } = default!;
    public DbSet<Privilege> Privileges { get; set; } = default!;
    public DbSet<Dealer> Dealers { get; set; } = default!;
    public DbSet<DealerLocation> DealerLocations { get; set; } = default!;
    public DbSet<Vehicle> Vehicles { get; set; } = default!;
    public DbSet<Make> Makes { get; set; } = default!;
    public DbSet<VehicleModel> VehicleModels { get; set; } = default!;
    public DbSet<VehicleImage> VehicleImages { get; set; } = default!;
    public DbSet<VehicleFeature> VehicleFeatures { get; set; } = default!;
    public DbSet<Listing> Listings { get; set; } = default!;
    public DbSet<PrivateSeller> PrivateSellers { get; set; } = default!;
    public DbSet<SavedSearch> SavedSearches { get; set; } = default!;
    public DbSet<Favorite> Favorites { get; set; } = default!;
    public DbSet<Inquiry> Inquiries { get; set; } = default!;
    public DbSet<Review> Reviews { get; set; } = default!;
    public DbSet<VehicleHistory> VehicleHistories { get; set; } = default!;
    public DbSet<JsonContent> JsonContents { get; set; } = default!;
    public DbSet<DigitalAsset> DigitalAssets { get; set; } = default!;
    public DbSet<Profile> Profiles { get; set; } = default!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.HasMany(e => e.Roles)
                .WithMany(r => r.Users);
        });

        // Configure Role entity
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId);
            entity.HasMany(e => e.Privileges)
                .WithOne(p => p.Role)
                .HasForeignKey(p => p.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Privilege entity
        modelBuilder.Entity<Privilege>(entity =>
        {
            entity.HasKey(e => e.PrivilegeId);
        });

        // Configure Profile entity
        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(e => e.ProfileId);
            entity.OwnsOne(e => e.HomeAddress);
        });
    }
}
