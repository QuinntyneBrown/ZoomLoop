// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.EntityFrameworkCore;
using System.Threading;
using System.Threading.Tasks;
using ZoomLoop.Core.Models;

namespace ZoomLoop.Core;

public interface IZoomLoopContext
{
    DbSet<User> Users { get; }
    DbSet<Role> Roles { get; }
    DbSet<Privilege> Privileges { get; }
    DbSet<Dealer> Dealers { get; }
    DbSet<DealerLocation> DealerLocations { get; }
    DbSet<Vehicle> Vehicles { get; }
    DbSet<Make> Makes { get; }
    DbSet<VehicleModel> VehicleModels { get; }
    DbSet<VehicleImage> VehicleImages { get; }
    DbSet<VehicleFeature> VehicleFeatures { get; }
    DbSet<Listing> Listings { get; }
    DbSet<PrivateSeller> PrivateSellers { get; }
    DbSet<SavedSearch> SavedSearches { get; }
    DbSet<Favorite> Favorites { get; }
    DbSet<Inquiry> Inquiries { get; }
    DbSet<Review> Reviews { get; }
    DbSet<VehicleHistory> VehicleHistories { get; }
    DbSet<JsonContent> JsonContents { get; }
    DbSet<DigitalAsset> DigitalAssets { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
