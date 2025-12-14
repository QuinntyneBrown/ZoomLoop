# Getting Started with ZoomLoop

This guide will help you get ZoomLoop up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **.NET 9.0 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/9.0)
- **Node.js 20.x** - [Download](https://nodejs.org/)
- **SQL Server** - LocalDB, Express, or full version
- **Git** - [Download](https://git-scm.com/)

## Clone the Repository

```bash
git clone https://github.com/QuinntyneBrown/ZoomLoop.git
cd ZoomLoop
```

## Backend Setup

### 1. Configure the Database

The application uses SQL Server with automatic migrations. Update the connection string in `src/ZoomLoop.Api/appsettings.Development.json` if needed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ZoomLoop;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"
  }
}
```

### 2. Restore Dependencies

```bash
cd src/ZoomLoop.Api
dotnet restore
```

### 3. Run the API

```bash
dotnet run
```

The API will start at `https://localhost:5001` (or `http://localhost:5000`).

On first run, the database will be automatically created and seeded with:
- Default admin user (username: `admin`, password: `Admin123!`)
- Sample data

### 4. Verify the API

Open a browser and navigate to:
- Swagger UI: `https://localhost:5001/swagger`

## Frontend Setup

### 1. Navigate to the Angular App

```bash
cd src/ZoomLoop.App
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm start
```

The application will start at `http://localhost:4200`.

### 4. Login

Use the default credentials:
- **Username**: `admin`
- **Password**: `Admin123!`

## Optional: Azure Services Configuration

ZoomLoop integrates with Azure services for advanced features. To enable them:

### Azure AI Vision (OCR)

1. Create an Azure AI Vision resource
2. Add to `appsettings.json`:

```json
{
  "AzureAIVision": {
    "Endpoint": "https://your-resource.cognitiveservices.azure.com/",
    "Key": "your-key"
  }
}
```

### Azure OpenAI (VIN Decoding)

1. Create an Azure OpenAI resource
2. Add to `appsettings.json`:

```json
{
  "AzureOpenAI": {
    "Endpoint": "https://your-resource.openai.azure.com/",
    "Key": "your-key",
    "DeploymentName": "your-deployment"
  }
}
```

### Azure Communication Services (Email)

1. Create an Azure Communication Services resource
2. Add to `appsettings.json`:

```json
{
  "AzureCommunicationServices": {
    "ConnectionString": "your-connection-string"
  }
}
```

**Security Note**: Never commit API keys to source control. Use:
- User Secrets for development: `dotnet user-secrets set "AzureOpenAI:Key" "your-key"`
- Azure Key Vault for production
- Environment variables

## Running Tests

### Backend Tests

```bash
dotnet test tests/ZoomLoop.UnitTests/ZoomLoop.UnitTests.csproj
```

### Frontend Unit Tests

```bash
cd src/ZoomLoop.App
npm test
```

### E2E Tests

```bash
cd src/ZoomLoop.App
npm run e2e
```

## Troubleshooting

### Database Connection Issues

- Ensure SQL Server is running
- Check the connection string in `appsettings.Development.json`
- For LocalDB: `sqllocaldb start mssqllocaldb`

### Port Already in Use

- Backend: Change ports in `src/ZoomLoop.Api/Properties/launchSettings.json`
- Frontend: Add `--port 4201` to the `npm start` command

### Node Module Issues

```bash
cd src/ZoomLoop.App
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clean .NET build
dotnet clean
dotnet build

# Clean Angular build
cd src/ZoomLoop.App
rm -rf dist
npm run build
```

## Next Steps

- [Architecture Overview](architecture.md)
- [API Documentation](api.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## Support

For issues and questions:
- [GitHub Issues](https://github.com/QuinntyneBrown/ZoomLoop/issues)
- [Discussions](https://github.com/QuinntyneBrown/ZoomLoop/discussions)
