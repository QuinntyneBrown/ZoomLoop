# ZoomLoop.Core

The core domain layer of the ZoomLoop automotive marketplace platform. This project contains domain models, business logic, service interfaces, and domain-driven design components that are independent of external concerns.

## Overview

ZoomLoop.Core is a .NET 9.0 class library following Clean Architecture and Domain-Driven Design principles. It contains the business logic and domain entities that define the ZoomLoop platform, with no dependencies on infrastructure or external frameworks.

## Architecture Principles

- **Framework Independence** - No dependencies on external frameworks except essential libraries
- **Domain-Centric** - Business rules and domain logic are the center of the application
- **Testable** - Pure business logic that's easy to unit test
- **Interface-Based** - Service contracts defined through interfaces

## Project Structure

```
ZoomLoop.Core/
├── Models/                      # Domain entities
│   ├── Vehicle.cs              # Vehicle aggregate
│   ├── VehicleModel.cs
│   ├── VehicleImage.cs
│   ├── VehicleFeature.cs
│   ├── VehicleHistory.cs
│   ├── Make.cs
│   ├── Listing.cs
│   ├── User.cs                 # User aggregate
│   ├── Profile.cs
│   ├── UserPreferences.cs
│   ├── UserAddress.cs
│   ├── Session.cs
│   ├── Role.cs
│   ├── Privilege.cs
│   ├── AccessRight.cs
│   ├── Dealer.cs              # Dealer aggregate
│   ├── DealerLocation.cs
│   ├── PrivateSeller.cs
│   ├── Favorite.cs
│   ├── SavedSearch.cs
│   ├── Inquiry.cs
│   ├── Review.cs
│   ├── Address.cs
│   ├── DigitalAsset.cs
│   └── JsonContent.cs
├── Services/                   # Business services
│   ├── Email/                 # Email services
│   │   ├── IEmailService.cs
│   │   ├── AzureEmailService.cs
│   │   ├── EmailMessage.cs
│   │   ├── EmailConfiguration.cs
│   │   ├── ITemplateEngine.cs
│   │   ├── RazorTemplateEngine.cs
│   │   ├── IQrCodeGenerator.cs
│   │   └── QrCodeGenerator.cs
│   ├── Security/              # Security services
│   │   ├── IPasswordHasher.cs
│   │   ├── PasswordHasher.cs
│   │   ├── ITokenProvider.cs
│   │   ├── TokenProvider.cs
│   │   ├── ITokenBuilder.cs
│   │   ├── TokenBuilder.cs
│   │   └── Authentication.cs
│   ├── VehicleIngestion/      # AI-powered vehicle ingestion
│   │   ├── IVehicleIngestionService.cs
│   │   ├── VehicleIngestionService.cs
│   │   ├── IAzureOpenAIService.cs
│   │   ├── AzureOpenAIService.cs
│   │   ├── IAzureVisionService.cs
│   │   ├── AzureVisionService.cs
│   │   ├── VehicleIngestionRequest.cs
│   │   ├── VehicleIngestionResult.cs
│   │   └── VehicleIngestionConfiguration.cs
│   ├── VehicleValuation/      # Vehicle valuation services
│   │   ├── IVehicleValuationService.cs
│   │   ├── VehicleValuationService.cs
│   │   ├── VehicleValuationRequest.cs
│   │   ├── VehicleValuationResult.cs
│   │   └── VehicleInfoByVinResult.cs
│   └── Financing/             # Financial calculations
│       ├── IPaymentCalculator.cs
│       ├── PaymentCalculator.cs
│       ├── FinancingCalculator.cs
│       ├── FinancingCalculationResult.cs
│       ├── FinancingOptions.cs
│       └── TaxConfiguration.cs
└── IZoomLoopContext.cs        # Database context interface
```

## Domain Models

### Core Aggregates

#### Vehicle Aggregate
The vehicle aggregate represents a vehicle listing in the marketplace.

**Key Entities:**
- `Vehicle` - Root aggregate containing vehicle details
- `VehicleImage` - Vehicle photos and media
- `VehicleFeature` - Features and options
- `VehicleHistory` - Service and ownership history
- `VehicleModel` - Model information
- `Make` - Vehicle manufacturer

#### User Aggregate
The user aggregate manages user accounts and authentication.

**Key Entities:**
- `User` - Root aggregate for user accounts
- `Profile` - User profile information
- `UserPreferences` - User settings and preferences
- `UserAddress` - Saved addresses
- `Session` - Active user sessions
- `Role` - User roles for authorization
- `Privilege` - Granular permissions
- `AccessRight` - Access control definitions

#### Dealer Aggregate
Represents dealership and private seller entities.

**Key Entities:**
- `Dealer` - Dealership information
- `DealerLocation` - Physical dealer locations
- `PrivateSeller` - Private party sellers

#### Supporting Entities
- `Listing` - Vehicle listing details
- `Favorite` - User's saved favorite vehicles
- `SavedSearch` - User's saved search criteria
- `Inquiry` - Customer inquiries about vehicles
- `Review` - User reviews and ratings
- `DigitalAsset` - File and media storage
- `JsonContent` - Dynamic JSON content storage

## Business Services

### Email Services
Handles email communication with support for:
- Azure Communication Services integration
- Razor template engine for email templates
- QR code generation for verification
- HTML email composition

**Key Interfaces:**
- `IEmailService` - Email sending abstraction
- `ITemplateEngine` - Template rendering
- `IQrCodeGenerator` - QR code generation

### Security Services
Provides authentication and authorization functionality:
- Password hashing with BCrypt
- JWT token generation and validation
- Session management
- User authentication

**Key Interfaces:**
- `IPasswordHasher` - Password hashing
- `ITokenProvider` - Token validation
- `ITokenBuilder` - Token generation

### Vehicle Ingestion Services
AI-powered vehicle data extraction from images and documents:
- Azure OpenAI integration for data extraction
- Azure Vision API for image analysis
- Automatic vehicle detail parsing
- VIN detection and decoding

**Key Interfaces:**
- `IVehicleIngestionService` - Main ingestion service
- `IAzureOpenAIService` - OpenAI integration
- `IAzureVisionService` - Vision API integration

### Vehicle Valuation Services
Vehicle pricing and valuation estimation:
- Market value estimation
- VIN lookup and vehicle information
- Pricing analysis based on market data

**Key Interfaces:**
- `IVehicleValuationService` - Valuation service

### Financing Services
Calculate vehicle financing and payments:
- Monthly payment calculation
- Interest calculation
- Tax and fee computation
- Provincial/state tax rates

**Key Services:**
- `IPaymentCalculator` - Payment calculations
- `FinancingCalculator` - Complete financing calculations
- `TaxConfiguration` - Tax rate management

## Technologies & Packages

### Core Dependencies
- **.NET 9.0** - Target framework
- **MediatR** (11.1.0) - CQRS and messaging
- **Entity Framework Core** (9.0.0) - ORM abstractions

### Azure Services
- **Azure.AI.OpenAI** (2.1.0) - OpenAI integration
- **Azure.AI.Vision.ImageAnalysis** (1.0.0) - Vision API
- **Azure.Communication.Email** (1.1.0) - Email service

### Security & Authentication
- **BCrypt.Net-Next** (4.0.3) - Password hashing
- **System.IdentityModel.Tokens.Jwt** (7.5.2) - JWT tokens

### Utilities
- **QRCoder** (1.6.0) - QR code generation
- **RazorEngineCore** (2024.4.1) - Template engine

### Code Quality
- **StyleCop.Analyzers** (1.1.118) - Code style
- **Microsoft.CodeAnalysis.NetAnalyzers** (9.0.0) - Code analysis

## Usage Examples

### Password Hashing
```csharp
var hasher = new PasswordHasher();
string hashedPassword = hasher.HashPassword("myPassword");
bool isValid = hasher.VerifyPassword("myPassword", hashedPassword);
```

### Payment Calculation
```csharp
var calculator = new PaymentCalculator();
decimal monthlyPayment = calculator.CalculateMonthlyPayment(
    principal: 25000m,
    annualInterestRate: 5.9m,
    termInMonths: 60
);
```

### Vehicle Ingestion
```csharp
var ingestionService = serviceProvider.GetRequiredService<IVehicleIngestionService>();
var result = await ingestionService.IngestVehicleAsync(new VehicleIngestionRequest
{
    Images = vehicleImages,
    DocumentText = documentContent
});
```

### Email with Template
```csharp
var emailService = serviceProvider.GetRequiredService<IEmailService>();
var templateEngine = serviceProvider.GetRequiredService<ITemplateEngine>();

var htmlBody = await templateEngine.RenderAsync("WelcomeEmail", new { UserName = "John" });
await emailService.SendEmailAsync(new EmailMessage
{
    To = "user@example.com",
    Subject = "Welcome to ZoomLoop",
    HtmlBody = htmlBody
});
```

## Domain Rules and Validation

The Core layer enforces domain rules through:
- Entity validation in constructors
- Value objects for complex types
- Domain events for cross-aggregate communication
- Invariant enforcement in setters

## Testing

This project is designed to be highly testable:

```bash
dotnet test
```

Unit tests should focus on:
- Domain model behavior
- Business rule validation
- Service implementations
- Calculation accuracy

## Design Patterns

- **Repository Pattern** - Data access abstraction
- **Service Layer Pattern** - Business logic encapsulation
- **Factory Pattern** - Complex object creation
- **Strategy Pattern** - Algorithm variation (e.g., payment calculations)

## Best Practices

1. **Keep it clean** - No infrastructure dependencies
2. **Interface segregation** - Small, focused interfaces
3. **Single responsibility** - Each class has one reason to change
4. **Explicit dependencies** - Constructor injection
5. **Immutability** - Prefer immutable value objects
6. **Fail fast** - Validate early, throw meaningful exceptions

## Dependencies

This project has no dependencies on other ZoomLoop projects, ensuring the domain layer remains independent and reusable.

## License

Copyright (c) Quinntyne Brown. All Rights Reserved.

Licensed under the MIT License. See License.txt in the project root for license information.

## Additional Resources

- [Domain-Driven Design](https://domainlanguage.com/ddd/)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [.NET 9 Documentation](https://docs.microsoft.com/dotnet)
