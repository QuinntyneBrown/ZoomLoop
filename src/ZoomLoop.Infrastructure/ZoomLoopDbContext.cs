// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using ZoomLoop.Core;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Infrastructure;

public class ZoomLoopDbContext : DbContext, IZoomLoopContext
{
    public ZoomLoopDbContext(DbContextOptions<ZoomLoopDbContext> options)
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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId);
            entity.HasMany(e => e.Roles)
                .WithMany(r => r.Users);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId);
            entity.HasMany(e => e.Privileges)
                .WithOne(p => p.Role)
                .HasForeignKey(p => p.RoleId);
        });

        modelBuilder.Entity<Privilege>(entity =>
        {
            entity.HasKey(e => e.PrivilegeId);
        });

        modelBuilder.Entity<Dealer>(entity =>
        {
            entity.HasKey(e => e.DealerId);
            entity.HasMany(e => e.Locations)
                .WithOne(l => l.Dealer)
                .HasForeignKey(l => l.DealerId);
            entity.HasMany(e => e.Listings)
                .WithOne(l => l.Dealer)
                .HasForeignKey(l => l.DealerId);
        });

        modelBuilder.Entity<DealerLocation>(entity =>
        {
            entity.HasKey(e => e.DealerLocationId);
        });

        modelBuilder.Entity<Vehicle>(entity =>
        {
            entity.HasKey(e => e.VehicleId);
            entity.HasOne(e => e.Make)
                .WithMany()
                .HasForeignKey(e => e.MakeId);
            entity.HasOne(e => e.VehicleModel)
                .WithMany()
                .HasForeignKey(e => e.VehicleModelId);
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
            entity.HasOne(e => e.PrivateSeller)
                .WithMany(ps => ps.Listings)
                .HasForeignKey(e => e.PrivateSellerId);
            entity.HasMany(e => e.Inquiries)
                .WithOne(i => i.Listing)
                .HasForeignKey(i => i.ListingId);
            entity.HasMany(e => e.Favorites)
                .WithOne(f => f.Listing)
                .HasForeignKey(f => f.ListingId);
        });

        modelBuilder.Entity<PrivateSeller>(entity =>
        {
            entity.HasKey(e => e.PrivateSellerId);
        });

        modelBuilder.Entity<SavedSearch>(entity =>
        {
            entity.HasKey(e => e.SavedSearchId);
        });

        modelBuilder.Entity<Favorite>(entity =>
        {
            entity.HasKey(e => e.FavoriteId);
        });

        modelBuilder.Entity<Inquiry>(entity =>
        {
            entity.HasKey(e => e.InquiryId);
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.ReviewId);
            entity.HasOne(e => e.Dealer)
                .WithMany(d => d.Reviews)
                .HasForeignKey(e => e.DealerId);
        });

        modelBuilder.Entity<VehicleHistory>(entity =>
        {
            entity.HasKey(e => e.VehicleHistoryId);
        });

        modelBuilder.Entity<JsonContent>(entity =>
        {
            entity.HasKey(e => e.JsonContentId);
            entity.Property(e => e.Json)
                .HasColumnType("nvarchar(max)");
        });

        modelBuilder.Entity<DigitalAsset>(entity =>
        {
            entity.HasKey(e => e.DigitalAssetId);
        });
    }
}
