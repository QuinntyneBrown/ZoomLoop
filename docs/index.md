# ZoomLoop

Welcome to the ZoomLoop documentation site.

## Overview

ZoomLoop is a modern web application built with:
- **Frontend**: Angular 21 (standalone components)
- **Backend**: ASP.NET Core 9.0
- **Database**: SQL Server with Entity Framework Core
- **Architecture**: CQRS pattern with MediatR

## Features

- Vehicle management and ingestion
- User authentication and authorization
- Azure AI Vision integration for OCR
- Azure OpenAI for VIN decoding and vehicle analysis
- Email services with Azure Communication Services
- QR code generation
- JSON-based content management

## Getting Started

### Prerequisites

- .NET 9.0 SDK
- Node.js 20.x
- SQL Server (LocalDB or Express)

### Running the Application

#### Backend

```bash
cd src/ZoomLoop.Api
dotnet restore
dotnet run
```

The API will be available at `https://localhost:5001`

#### Frontend

```bash
cd src/ZoomLoop.App
npm install
npm start
```

The application will be available at `http://localhost:4200`

### Default Credentials

- Username: `admin`
- Password: `Admin123!`

## Development

### Architecture

ZoomLoop follows a clean architecture approach with:

- **ZoomLoop.Core**: Domain models and business logic
- **ZoomLoop.Infrastructure**: Data access and external services
- **ZoomLoop.Api**: REST API with MediatR CQRS handlers
- **ZoomLoop.App**: Angular frontend application

### Testing

#### Backend Tests

```bash
dotnet test tests/ZoomLoop.UnitTests/ZoomLoop.UnitTests.csproj
```

Backend tests use NUnit with InMemoryDatabase for integration testing.

#### Frontend Tests

```bash
cd src/ZoomLoop.App
npm test
```

Frontend tests use Vitest.

#### End-to-End Tests

```bash
cd src/ZoomLoop.App
npm run e2e
```

E2E tests use Playwright.

## Contributing

Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines on contributing to this project.

## Key Technologies

- **Frontend**: Angular 21, TypeScript, SCSS, Vitest, Playwright
- **Backend**: ASP.NET Core 9.0, C#, Entity Framework Core, MediatR
- **Database**: SQL Server
- **Cloud Services**: Azure AI Vision, Azure OpenAI, Azure Communication Services
- **CI/CD**: GitHub Actions

## Documentation

- [Frontend README](../src/ZoomLoop.App/README.md)
- [Infrastructure README](../src/ZoomLoop.Infrastructure/README.md)
- [Vehicle Ingestion Service](../src/ZoomLoop.Core/Services/VehicleIngestion/README.md)
- [Email Service](../src/ZoomLoop.Core/Services/Email/README.md)
- [Testing Guide](../tests/ZoomLoop.Testing/README.md)

## License

Copyright © Quinntyne Brown. All rights reserved.
