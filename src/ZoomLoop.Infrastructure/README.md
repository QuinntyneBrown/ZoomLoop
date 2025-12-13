# ZoomLoop.Infrastructure

This project contains the Entity Framework Core SQL Server implementation of the ZoomLoop data access layer.

## Features

- **ZoomLoopDbContext**: SQL Server implementation of `IZoomLoopContext` using Entity Framework Core
- **Database Migrations**: EF Core migrations for database schema management
- **Seed Service**: Automatic database seeding with initial data on application startup

## Configuration

The connection string is configured in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SqlExpress;Database=ZoomLoop;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  }
}
```

## Database Migrations

To create a new migration:

```bash
cd src/ZoomLoop.Infrastructure
dotnet ef migrations add MigrationName --context ZoomLoopDbContext --startup-project ../ZoomLoop.Api/ZoomLoop.Api.csproj
```

To update the database:

```bash
cd src/ZoomLoop.Infrastructure
dotnet ef database update --context ZoomLoopDbContext --startup-project ../ZoomLoop.Api/ZoomLoop.Api.csproj
```

## Seeding

The database is automatically seeded with initial data when the application starts:

- **Roles**: Administrator, Dealer, User
- **Admin User**: Username: `admin`, Password: `Admin123!`
- **Vehicle Makes and Models**: Toyota, Honda, Ford with sample models

The seeding logic is implemented in `SeedService.cs` and is executed during application startup in `Program.cs`.

## Entity Relationships

The DbContext configures the following relationships:

- **User ↔ Role**: Many-to-many
- **Role ↔ Privilege**: One-to-many
- **Dealer ↔ DealerLocation**: One-to-many
- **Dealer ↔ Listing**: One-to-many
- **Dealer ↔ Review**: One-to-many
- **Make ↔ VehicleModel**: One-to-many
- **Vehicle ↔ Make**: Many-to-one
- **Vehicle ↔ VehicleModel**: Many-to-one
- **Vehicle ↔ VehicleImage**: One-to-many
- **Vehicle ↔ VehicleFeature**: One-to-many
- **Listing ↔ Vehicle**: Many-to-one
- **Listing ↔ PrivateSeller**: Many-to-one
- **Listing ↔ Inquiry**: One-to-many
- **Listing ↔ Favorite**: One-to-many
