# ZoomLoop.Api

The REST API layer for the ZoomLoop automotive marketplace platform. This project provides HTTP endpoints for vehicle management, user authentication, financing calculations, and vehicle valuation services.

## Overview

ZoomLoop.Api is an ASP.NET Core Web API built with .NET 9.0, following Clean Architecture principles with CQRS pattern using MediatR. The API serves as the primary interface for the ZoomLoop web application and mobile clients.

## Features

- **RESTful API Design** - Well-structured endpoints following REST conventions
- **CQRS Pattern** - Command/Query separation using MediatR
- **JWT Authentication** - Secure token-based authentication
- **Swagger/OpenAPI** - Interactive API documentation
- **Structured Logging** - Comprehensive logging with Serilog
- **Request/Response Pipeline** - Custom middleware for logging and error handling
- **Validation** - Automatic request validation with FluentValidation
- **Entity Framework Core** - Data access with EF Core 9.0

## Architecture

This project follows the **Vertical Slice Architecture** pattern, organizing features by business capability rather than technical layers.

### Project Structure

```
ZoomLoop.Api/
├── Controllers/           # API controllers
│   ├── AuthController.cs
│   ├── VehicleController.cs
│   ├── FinancingController.cs
│   ├── ProfileController.cs
│   ├── VehicleValuationController.cs
│   └── UsersController.cs
├── Features/             # Feature-based vertical slices
│   ├── Auth/            # Authentication features
│   ├── Vehicles/        # Vehicle management features
│   ├── Financing/       # Financing calculation features
│   ├── Profiles/        # User profile features
│   ├── Users/           # User management features
│   ├── VehicleValuation/ # Vehicle valuation features
│   └── JsonContents/    # Dynamic content features
├── Behaviours/          # MediatR pipeline behaviors
│   ├── LoggingBehaviour.cs
│   └── ValidationBehaviour.cs
├── Middleware/          # Custom middleware
│   ├── CorrelationIdMiddleware.cs
│   └── RequestLoggingMiddleware.cs
├── Program.cs           # Application entry point
└── ConfigureServices.cs # Dependency injection configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email address
- `POST /api/auth/verify-phone` - Verify phone number

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `GET /api/vehicles/{id}` - Get vehicle by ID
- `GET /api/vehicles/search` - Search vehicles
- `GET /api/vehicles/suggestions` - Get vehicle suggestions
- `POST /api/vehicles` - Create new vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle
- `POST /api/vehicles/ingest` - Ingest vehicle from images/data
- `POST /api/vehicles/{id}/images` - Upload vehicle images

### Financing
- `POST /api/financing/calculate` - Calculate financing options
- `GET /api/financing/tax-rates` - Get tax rates by location

### Vehicle Valuation
- `POST /api/valuation` - Get vehicle valuation estimate
- `GET /api/valuation/vin/{vin}` - Get vehicle info by VIN

### User Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `DELETE /api/users/{id}` - Delete user
- `GET /api/users/current` - Get current authenticated user
- `PUT /api/users/current/profile` - Update current user profile
- `POST /api/users/current/change-password` - Change password
- `POST /api/users/current/change-email` - Change email
- `GET /api/users/current/sessions` - Get active sessions
- `DELETE /api/users/current/sessions/{id}` - Revoke session

## Technologies & Packages

### Core Frameworks
- **.NET 9.0** - Target framework
- **ASP.NET Core** - Web API framework
- **Entity Framework Core 9.0** - ORM and data access

### Key Libraries
- **MediatR** (11.1.0) - CQRS implementation
- **Swashbuckle.AspNetCore** (6.7.0) - Swagger/OpenAPI
- **Microsoft.AspNetCore.Authentication.JwtBearer** (9.0.0) - JWT authentication
- **Serilog.AspNetCore** (8.0.3) - Structured logging
- **StyleCop.Analyzers** (1.1.118) - Code style enforcement

## Getting Started

### Prerequisites
- .NET 9.0 SDK or later
- SQL Server (LocalDB or Express for development)
- Visual Studio 2022 or later / VS Code with C# extension

### Configuration

The API uses `appsettings.json` and User Secrets for configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ZoomLoopDb;Trusted_Connection=true;"
  },
  "JwtSettings": {
    "SecretKey": "your-secret-key",
    "Issuer": "ZoomLoop",
    "Audience": "ZoomLoop",
    "ExpiryMinutes": 60
  },
  "AzureOpenAI": {
    "Endpoint": "your-endpoint",
    "ApiKey": "your-key"
  }
}
```

**Important:** Store sensitive values in User Secrets for development:

```bash
dotnet user-secrets set "JwtSettings:SecretKey" "your-secret-key"
dotnet user-secrets set "AzureOpenAI:ApiKey" "your-api-key"
```

### Running the API

1. **Restore packages:**
   ```bash
   dotnet restore
   ```

2. **Apply database migrations:**
   ```bash
   dotnet ef database update
   ```

3. **Run the application:**
   ```bash
   dotnet run
   ```

4. **Access Swagger UI:**
   Navigate to `https://localhost:5001/swagger` (or the port shown in console)

### Database Migrations

Create a new migration:
```bash
dotnet ef migrations add MigrationName
```

Update database:
```bash
dotnet ef database update
```

Remove last migration:
```bash
dotnet ef migrations remove
```

## Development

### Adding a New Feature

Follow the vertical slice pattern:

1. Create a new folder under `Features/` for your feature
2. Create request/response DTOs
3. Create command/query classes
4. Create handler classes implementing `IRequestHandler<TRequest, TResponse>`
5. Add controller endpoint if needed
6. Add any necessary validation

Example structure:
```
Features/
└── NewFeature/
    ├── CreateNewFeature.cs          # Command
    ├── CreateNewFeatureHandler.cs   # Handler
    ├── NewFeatureDto.cs             # DTO
    └── NewFeatureExtensions.cs      # Mapping extensions
```

### Code Quality

The project enforces code quality through:
- **StyleCop** - Code style rules
- **.NET Analyzers** - Code analysis
- **Nullable reference types** - Enabled
- **Documentation generation** - XML documentation required

### Logging

The API uses Serilog with:
- Console sink for development
- File sink for persistent logs
- Azure Analytics sink for production
- Correlation ID tracking for request tracing

## Testing

Run tests from the solution root:
```bash
dotnet test
```

## Deployment

### Build for Release
```bash
dotnet build --configuration Release
```

### Publish
```bash
dotnet publish --configuration Release --output ./publish
```

## Dependencies

- **ZoomLoop.Core** - Domain models and business logic
- **ZoomLoop.Infrastructure** - Data access and external services

## Security Considerations

- JWT tokens for authentication
- HTTPS enforced in production
- User secrets for sensitive configuration
- CORS configured for specific origins
- Request validation and sanitization

## License

Copyright (c) Quinntyne Brown. All Rights Reserved.

Licensed under the MIT License. See License.txt in the project root for license information.

## Additional Resources

- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core)
- [MediatR Documentation](https://github.com/jbogard/MediatR)
- [Entity Framework Core Documentation](https://docs.microsoft.com/ef/core)
- [Serilog Documentation](https://serilog.net/)
