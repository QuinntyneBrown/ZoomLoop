# ZoomLoop.Infrastructure

The infrastructure and data access layer for the ZoomLoop automotive marketplace platform. This project implements data persistence, external service integrations, and infrastructure concerns using Entity Framework Core and SQL Server.

## Overview

ZoomLoop.Infrastructure is a .NET 9.0 class library that implements the infrastructure layer following Clean Architecture principles. It contains Entity Framework Core configurations, database migrations, and implementations of repository interfaces defined in the Core layer.

## Responsibilities

- **Data Persistence** - Entity Framework Core implementation
- **Database Configuration** - Entity configurations and relationships
- **Migrations** - Database schema versioning
- **External Services** - Infrastructure service implementations
- **Data Seeding** - Initial and test data population

## Architecture

This layer implements the Persistence layer of Clean Architecture:
- Depends on **ZoomLoop.Core** for domain models and interfaces
- Used by **ZoomLoop.Api** for data access
- Contains EF Core DbContext and configurations

## Project Structure

```
ZoomLoop.Infrastructure/
├── Migrations/                          # EF Core migrations
│   ├── 20251214015154_InitialCreate.cs
│   ├── 20251214093754_AddProfile.cs
│   ├── 20251223000000_IdentitySystem.cs
│   ├── 20251224041430_FixModelChanges.cs
│   ├── 20251224090702_NewMigration.cs
│   └── ZoomLoopDbContextModelSnapshot.cs
├── ZoomLoopDbContext.cs                 # Main DbContext
├── ISeedService.cs                      # Seeding interface
└── SeedService.cs                       # Data seeding implementation
```

## Database Context

### ZoomLoopDbContext

The main Entity Framework Core DbContext that manages database operations for all domain entities.

**Key Features:**
- Configures entity relationships and constraints
- Implements query filters for soft deletes
- Manages database transactions
- Provides change tracking for domain entities

**DbSets:**
```csharp
public DbSet<Vehicle> Vehicles { get; set; }
public DbSet<VehicleModel> VehicleModels { get; set; }
public DbSet<VehicleImage> VehicleImages { get; set; }
public DbSet<VehicleFeature> VehicleFeatures { get; set; }
public DbSet<Make> Makes { get; set; }
public DbSet<User> Users { get; set; }
public DbSet<Profile> Profiles { get; set; }
public DbSet<Role> Roles { get; set; }
public DbSet<Session> Sessions { get; set; }
public DbSet<Dealer> Dealers { get; set; }
public DbSet<DealerLocation> DealerLocations { get; set; }
public DbSet<Listing> Listings { get; set; }
public DbSet<Favorite> Favorites { get; set; }
public DbSet<SavedSearch> SavedSearches { get; set; }
public DbSet<Inquiry> Inquiries { get; set; }
public DbSet<Review> Reviews { get; set; }
public DbSet<JsonContent> JsonContents { get; set; }
```

## Entity Relationships

The DbContext configures the following relationships:

### User & Authentication
- **User ↔ Role**: Many-to-many
- **Role ↔ Privilege**: One-to-many
- **User ↔ Profile**: One-to-one
- **User ↔ Session**: One-to-many
- **User ↔ UserAddress**: One-to-many

### Vehicle Domain
- **Make ↔ VehicleModel**: One-to-many
- **Vehicle ↔ Make**: Many-to-one
- **Vehicle ↔ VehicleModel**: Many-to-one
- **Vehicle ↔ VehicleImage**: One-to-many
- **Vehicle ↔ VehicleFeature**: One-to-many
- **Vehicle ↔ VehicleHistory**: One-to-many

### Listings & Marketplace
- **Dealer ↔ DealerLocation**: One-to-many
- **Dealer ↔ Listing**: One-to-many
- **Dealer ↔ Review**: One-to-many
- **Listing ↔ Vehicle**: Many-to-one
- **Listing ↔ PrivateSeller**: Many-to-one
- **Listing ↔ Inquiry**: One-to-many
- **Listing ↔ Favorite**: One-to-many

## Database Configuration

### Connection String

Configure the connection string in `appsettings.json`:

**Development (LocalDB):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ZoomLoopDb;Trusted_Connection=true;"
  }
}
```

**Development (SQL Server Express):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SqlExpress;Database=ZoomLoop;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

**Production (Azure SQL):**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=tcp:your-server.database.windows.net,1433;Database=ZoomLoopDb;User Id=username;Password=password;Encrypt=true;TrustServerCertificate=false;"
  }
}
```

**Security Note:** Never commit connection strings with credentials to source control. Use environment variables or Azure Key Vault.

## Database Migrations

The project uses Entity Framework Core migrations for database schema management.

### Migration History

1. **InitialCreate** (2025-12-14)
   - Initial database schema
   - Core vehicle and user entities
   - Base tables and relationships

2. **AddProfile** (2025-12-14)
   - Added user profile system
   - User preferences and addresses
   - Profile-related tables

3. **IdentitySystem** (2025-12-23)
   - Enhanced identity and authentication
   - Session management
   - Role-based access control

4. **FixModelChanges** (2025-12-24)
   - Model refinements and fixes
   - Schema adjustments

5. **NewMigration** (2025-12-24)
   - Latest schema updates
   - Current production schema

### Managing Migrations

**Create a new migration:**
```bash
cd src/ZoomLoop.Infrastructure
dotnet ef migrations add MigrationName --context ZoomLoopDbContext --startup-project ../ZoomLoop.Api/ZoomLoop.Api.csproj
```

Or from solution root:
```bash
dotnet ef migrations add MigrationName --project src/ZoomLoop.Infrastructure --startup-project src/ZoomLoop.Api
```

**Update the database:**
```bash
cd src/ZoomLoop.Infrastructure
dotnet ef database update --context ZoomLoopDbContext --startup-project ../ZoomLoop.Api/ZoomLoop.Api.csproj
```

**Remove last migration:**
```bash
dotnet ef migrations remove --project src/ZoomLoop.Infrastructure --startup-project src/ZoomLoop.Api
```

**Generate SQL script:**
```bash
dotnet ef migrations script --project src/ZoomLoop.Infrastructure --startup-project src/ZoomLoop.Api --output migration.sql
```

**Update to specific migration:**
```bash
dotnet ef database update MigrationName --project src/ZoomLoop.Infrastructure --startup-project src/ZoomLoop.Api
```

**Revert all migrations:**
```bash
dotnet ef database update 0 --project src/ZoomLoop.Infrastructure --startup-project src/ZoomLoop.Api
```

## Data Seeding

The `SeedService` provides functionality to populate the database with initial and test data.

### Automatic Seeding

The database is automatically seeded with initial data when the application starts **in Development environment only**:

**Seeded Data:**
- **Roles**: Administrator, Dealer, User
- **Admin User**: Username: `admin`, Password: `Admin123!`
- **Vehicle Makes and Models**: Toyota, Honda, Ford with sample models
- **Reference Data**: Common lookups and configurations

### Manual Seeding

```csharp
var seedService = serviceProvider.GetRequiredService<ISeedService>();
await seedService.SeedAsync();
```

### Security Considerations

> **Security Note**: The default admin password should be changed immediately after first login in any non-development environment. For production, consider using environment variables or secure configuration providers for initial admin credentials.

## Technologies & Packages

### Core Technologies
- **.NET 9.0** - Target framework
- **Entity Framework Core 9.0** - ORM framework
- **SQL Server** - Database provider

### Key Packages
- **Microsoft.EntityFrameworkCore** (9.0.0) - Core EF functionality
- **Microsoft.EntityFrameworkCore.SqlServer** (9.0.0) - SQL Server provider
- **Microsoft.EntityFrameworkCore.Design** (9.0.0) - Design-time support for migrations

### Code Quality
- **StyleCop.Analyzers** (1.1.118) - Code style enforcement
- **Microsoft.CodeAnalysis.NetAnalyzers** (9.0.0) - Code analysis

## Best Practices

### Query Optimization
- Use `.AsNoTracking()` for read-only queries
- Project to DTOs to reduce data transfer
- Use eager loading with `.Include()` to prevent N+1 queries
- Implement pagination for large result sets

Example:
```csharp
var vehicles = await context.Vehicles
    .AsNoTracking()
    .Include(v => v.Images)
    .Include(v => v.Make)
    .Include(v => v.VehicleModel)
    .Where(v => v.IsNew)
    .Take(10)
    .ToListAsync();
```

### Transaction Management
```csharp
using var transaction = await context.Database.BeginTransactionAsync();
try
{
    // Perform operations
    await context.SaveChangesAsync();
    await transaction.CommitAsync();
}
catch
{
    await transaction.RollbackAsync();
    throw;
}
```

### Indexing Strategy
Ensure proper indexes are defined for:
- Primary keys (automatic)
- Foreign keys
- Frequently queried columns
- Unique constraints (e.g., VIN, Email)

## Performance Considerations

### Connection Pooling
Entity Framework Core uses connection pooling by default. Configure pool size if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=...;Max Pool Size=100;Min Pool Size=5;"
  }
}
```

### Compiled Queries
For frequently executed queries, use compiled queries:

```csharp
private static readonly Func<ZoomLoopDbContext, Guid, Task<Vehicle>> GetVehicleById =
    EF.CompileAsyncQuery((ZoomLoopDbContext context, Guid id) =>
        context.Vehicles
            .Include(v => v.Images)
            .FirstOrDefault(v => v.VehicleId == id));
```

### Query Splitting
For complex queries with multiple includes:

```csharp
var vehicle = await context.Vehicles
    .Include(v => v.Images)
    .Include(v => v.Features)
    .AsSplitQuery()  // Prevents cartesian explosion
    .FirstOrDefaultAsync(v => v.VehicleId == id);
```

## Testing

### In-Memory Database
For unit tests, use the in-memory provider:

```csharp
var options = new DbContextOptionsBuilder<ZoomLoopDbContext>()
    .UseInMemoryDatabase(databaseName: "TestDb")
    .Options;

using var context = new ZoomLoopDbContext(options);
```

### Integration Tests
For integration tests, use a test database:

```csharp
var options = new DbContextOptionsBuilder<ZoomLoopDbContext>()
    .UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=ZoomLoopTestDb;")
    .Options;

using var context = new ZoomLoopDbContext(options);
// Run migrations
await context.Database.MigrateAsync();
```

## Troubleshooting

### Migration Issues

**Problem:** Migration already applied
```bash
dotnet ef database update 0  # Revert all migrations
dotnet ef database update    # Reapply migrations
```

**Problem:** Pending model changes
```bash
dotnet ef migrations add FixPendingChanges
dotnet ef database update
```

**Problem:** Unable to create migrations**
- Ensure the startup project is set correctly
- Verify the connection string is valid
- Check that required packages are installed

### Connection Issues

**Problem:** Cannot connect to LocalDB
```bash
# Start SQL Server LocalDB
sqllocaldb start mssqllocaldb

# Check LocalDB instances
sqllocaldb info

# Create a new instance if needed
sqllocaldb create mssqllocaldb
```

**Problem:** Trust Server Certificate error
Add `TrustServerCertificate=True` to connection string for development only.

## Production Deployment

### Pre-Deployment Checklist
- [ ] Generate SQL migration scripts
- [ ] Review scripts for data loss
- [ ] Backup production database
- [ ] Test scripts on staging environment
- [ ] Schedule maintenance window if needed

### Applying Migrations in Production

**Option 1: SQL Scripts (Recommended)**
```bash
# Generate script from last deployed version
dotnet ef migrations script FromMigration ToMigration --output migration.sql --idempotent

# Apply script using SQL Server Management Studio or Azure Portal
```

**Option 2: Automatic Migration (Use with caution)**
```csharp
// In Program.cs
if (app.Environment.IsProduction())
{
    using var scope = app.Services.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<ZoomLoopDbContext>();
    await context.Database.MigrateAsync();
}
```

## Dependencies

- **ZoomLoop.Core** - Domain models and interfaces

## License

Copyright (c) Quinntyne Brown. All Rights Reserved.

Licensed under the MIT License. See License.txt in the project root for license information.

## Additional Resources

- [Entity Framework Core Documentation](https://docs.microsoft.com/ef/core)
- [EF Core Migrations](https://docs.microsoft.com/ef/core/managing-schemas/migrations)
- [SQL Server Documentation](https://docs.microsoft.com/sql)
- [Connection String Reference](https://www.connectionstrings.com/sql-server)
- [EF Core Performance](https://docs.microsoft.com/ef/core/performance)
