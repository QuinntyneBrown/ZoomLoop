<p align="center">
  <img src="assets/car.png" alt="ZoomLoop" width="600"/>
</p>

# ZoomLoop

A modern web application for vehicle management built with Angular and ASP.NET Core.

## Features

- 🚗 Vehicle management and ingestion
- 🔐 User authentication and authorization
- 🤖 AI-powered VIN decoding with Azure OpenAI
- 📸 OCR with Azure AI Vision
- 📧 Email services with Azure Communication Services
- 📱 QR code generation
- 📝 Flexible JSON-based content management

## Tech Stack

### Frontend
- Angular 21 with standalone components
- TypeScript
- SCSS
- Vitest for unit testing
- Playwright for E2E testing

### Backend
- ASP.NET Core 9.0
- Entity Framework Core with SQL Server
- MediatR (CQRS pattern)
- NUnit for testing

### Cloud Services
- Azure AI Vision
- Azure OpenAI
- Azure Communication Services

## Quick Start

### Prerequisites

- .NET 9.0 SDK
- Node.js 20.x
- SQL Server (LocalDB or Express)

### Backend Setup

```bash
cd src/ZoomLoop.Api
dotnet restore
dotnet run
```

API available at: `https://localhost:5001`

### Frontend Setup

```bash
cd src/ZoomLoop.App
npm install
npm start
```

Application available at: `http://localhost:4200`

### Default Login

- Username: `admin`
- Password: `Admin123!`

## Documentation

📚 [Full Documentation](https://quinntynebrown.github.io/ZoomLoop/)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## Project Structure

```
ZoomLoop/
├── src/
│   ├── ZoomLoop.Api/          # ASP.NET Core Web API
│   ├── ZoomLoop.App/          # Angular frontend
│   ├── ZoomLoop.Core/         # Domain models and business logic
│   └── ZoomLoop.Infrastructure/ # Data access and external services
└── tests/
    ├── ZoomLoop.UnitTests/    # Backend unit tests
    └── ZoomLoop.Testing/      # Shared testing utilities
```

## Testing

### Backend Tests
```bash
dotnet test tests/ZoomLoop.UnitTests/ZoomLoop.UnitTests.csproj
```

### Frontend Tests
```bash
cd src/ZoomLoop.App
npm test
```

### E2E Tests
```bash
cd src/ZoomLoop.App
npm run e2e
```

## License

Copyright © Quinntyne Brown. All rights reserved.
