// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Testing;

public class FakeZoomLoopContext : DbContext, IZoomLoopContext
{
    public FakeZoomLoopContext(DbContextOptions<FakeZoomLoopContext> options)
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

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId);
            entity.HasOne(e => e.Make)
                .WithMany()
                .HasForeignKey(e => e.MakeId)
                .OnDelete(DeleteBehavior.NoAction);
            entity.HasOne(e => e.VehicleModel)
                .WithMany()
                .HasForeignKey(e => e.VehicleModelId)
                .OnDelete(DeleteBehavior.NoAction);
            entity.HasMany(e => e.Images)
                .WithOne(i => i.Vehicle)
                .HasForeignKey(i => i.VehicleId);
            entity.HasMany(e => e.Features)
                .WithOne(f => f.Vehicle)
                .HasForeignKey(f => f.VehicleId);
        });

        modelBuilder.Entity<Make>(entity =>
        {
            entity.HasKey(e => e.MakeId);
            entity.HasMany(e => e.VehicleModels)
                .WithOne(vm => vm.Make)
                .HasForeignKey(vm => vm.MakeId);
        });

        modelBuilder.Entity<VehicleModel>(entity =>
        {
            entity.HasKey(e => e.VehicleModelId);
        });

        modelBuilder.Entity<VehicleImage>(entity =>
        {
            entity.HasKey(e => e.VehicleImageId);
        });

        modelBuilder.Entity<VehicleFeature>(entity =>
        {
            entity.HasKey(e => e.VehicleFeatureId);
        });

        modelBuilder.Entity<Listing>(entity =>
        {
            entity.HasKey(e => e.ListingId);
            entity.HasOne(e => e.Vehicle)
                .WithMany()
                .HasForeignKey(e => e.VehicleId);
        });

        modelBuilder.Entity<VehicleHistory>(entity =>
        {
            entity.HasKey(e => e.VehicleHistoryId);
            entity.HasOne(e => e.Vehicle)
                .WithMany()
                .HasForeignKey(e => e.VehicleId);
        });
    }
}
