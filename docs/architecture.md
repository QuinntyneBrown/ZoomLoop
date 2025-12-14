# Architecture

ZoomLoop follows a clean architecture approach with clear separation of concerns.

## Solution Structure

```
ZoomLoop/
├── src/
│   ├── ZoomLoop.Api/              # ASP.NET Core Web API
│   ├── ZoomLoop.App/              # Angular frontend
│   ├── ZoomLoop.Core/             # Domain models and business logic
│   └── ZoomLoop.Infrastructure/   # Data access and external services
└── tests/
    ├── ZoomLoop.UnitTests/        # Backend unit tests
    └── ZoomLoop.Testing/          # Shared testing utilities
```

## Backend Architecture

### Layers

#### ZoomLoop.Core
The core domain layer containing:
- **Models**: Domain entities (Vehicle, User, JsonContent)
- **Interfaces**: Service contracts
- **Business Logic**: Domain services

Key components:
- `Models/`: Domain entities
- `Services/VehicleIngestion/`: AI-powered vehicle processing
- `Services/Email/`: Email services with templates
- `Interfaces/`: Repository and service contracts

#### ZoomLoop.Infrastructure
Implementation of data access and external services:
- **DbContext**: Entity Framework Core context
- **Migrations**: Database schema
- **Seed Data**: Initial data population

Key features:
- SQL Server integration with EF Core 9.0
- Automatic migrations on startup
- Default admin user seeding

#### ZoomLoop.Api
RESTful API built with ASP.NET Core:
- **Features**: Organized by feature using MediatR
- **CQRS Pattern**: Commands and queries with handlers
- **Minimal APIs**: Endpoint definitions

Example feature structure:
```
Features/
├── Users/
│   └── Users.cs              # All user-related handlers
├── Vehicles/
│   └── Vehicles.cs           # All vehicle-related handlers
└── JsonContents/
    └── JsonContents.cs       # All content-related handlers
```

### CQRS with MediatR

Each feature uses the CQRS pattern:

**Query Example**:
```csharp
public record GetVehicleByIdRequest(Guid Id) : IRequest<VehicleDto>;

public class GetVehicleByIdHandler : IRequestHandler<GetVehicleByIdRequest, VehicleDto>
{
    // Handler implementation
}
```

**Command Example**:
```csharp
public record CreateVehicleRequest(VehicleDto Vehicle) : IRequest<VehicleDto>;

public class CreateVehicleHandler : IRequestHandler<CreateVehicleRequest, VehicleDto>
{
    // Handler implementation
}
```

### Dependency Injection

Services are registered in `ConfigureServices.cs`:

```csharp
public static IServiceCollection AddApiServices(this IServiceCollection services, IConfiguration configuration)
{
    // Service registration with options pattern
    services.AddSingleton<IVehicleIngestionService, VehicleIngestionService>();
    services.AddSingleton<IEmailService, AzureEmailService>();
    // ...
}
```

## Frontend Architecture

### Angular 21 with Standalone Components

The frontend uses modern Angular architecture:
- **No NgModules**: All components are standalone
- **Signal-based state**: Reactive state management
- **Dependency Injection**: Service-based architecture

### Project Structure

```
src/ZoomLoop.App/src/
├── app/
│   ├── components/           # Reusable UI components
│   │   ├── input/
│   │   ├── slider/
│   │   ├── carousel/
│   │   └── tabs/
│   ├── pages/                # Route pages
│   │   ├── login/
│   │   ├── vehicle-create/
│   │   └── vehicle-list/
│   ├── services/             # Business logic services
│   └── guards/               # Route guards
├── styles.scss               # Global styles
└── main.ts                   # Application bootstrap
```

### Component Pattern

Components implement ControlValueAccessor for form integration:

```typescript
@Component({
  selector: 'zl-input',
  standalone: true,
  // No OnPush to avoid issues with programmatic value changes
})
export class InputComponent implements ControlValueAccessor {
  // Implementation
}
```

### Services

Services handle API communication and business logic:

```typescript
@Injectable({ providedIn: 'root' })
export class VehicleService {
  private http = inject(HttpClient);
  
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('/api/vehicles');
  }
}
```

## Data Flow

### Backend Request Flow

1. **HTTP Request** → Controller/Minimal API endpoint
2. **MediatR** → Dispatches to appropriate handler
3. **Handler** → Business logic execution
4. **Repository** → Data access via EF Core
5. **Response** → DTO mapping and return

### Frontend Data Flow

1. **User Action** → Component
2. **Service Call** → HTTP request to API
3. **Observable** → Async data stream
4. **State Update** → Component state/signals
5. **Template Update** → UI re-renders

## Key Technologies

### Backend Stack
- **Framework**: ASP.NET Core 9.0
- **ORM**: Entity Framework Core 9.0
- **Database**: SQL Server
- **CQRS**: MediatR
- **Testing**: NUnit with InMemoryDatabase

### Frontend Stack
- **Framework**: Angular 21
- **Language**: TypeScript 5.7
- **Styling**: SCSS
- **Testing**: Vitest (unit), Playwright (E2E)
- **Build**: Angular CLI with esbuild

### Cloud Services
- **Azure AI Vision**: OCR for vehicle documents
- **Azure OpenAI**: VIN decoding and analysis
- **Azure Communication Services**: Email delivery

## Security

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control
- Secure password hashing

### Configuration Security
- User Secrets for development
- Azure Key Vault for production
- Environment variables for sensitive data
- Never commit API keys

## Performance Considerations

### Backend
- Async/await throughout
- EF Core query optimization
- Response caching where appropriate
- Connection pooling

### Frontend
- Lazy loading routes
- OnPush change detection (where appropriate)
- Image optimization
- Bundle optimization with esbuild

## Testing Strategy

### Backend Testing
- **Unit Tests**: NUnit with InMemoryDatabase
- **Integration Tests**: Full handler testing
- **Test Isolation**: Each test uses fresh context

Example:
```csharp
[Test]
public async Task CreateVehicle_ShouldReturnVehicle()
{
    var context = new InMemoryZoomLoopContext();
    var handler = new CreateVehicleHandler(context);
    // Test implementation
}
```

### Frontend Testing
- **Unit Tests**: Vitest with component testing
- **E2E Tests**: Playwright for user flows
- **Mock Services**: vi.spyOn for isolation

Example:
```typescript
it('should create component', () => {
  const fixture = TestBed.createComponent(InputComponent);
  expect(fixture.componentInstance).toBeTruthy();
});
```

## Design Patterns

### Backend Patterns
- **CQRS**: Command Query Responsibility Segregation
- **Repository Pattern**: Data access abstraction
- **Options Pattern**: Configuration binding
- **Dependency Injection**: Loose coupling

### Frontend Patterns
- **Reactive Programming**: RxJS observables
- **Smart/Dumb Components**: Separation of concerns
- **Service Layer**: Business logic abstraction
- **Guard Pattern**: Route protection

## Development Workflow

1. **Feature Development**: Feature-based organization
2. **Testing**: Write tests alongside code
3. **Code Review**: PR-based workflow
4. **CI/CD**: Automated testing and deployment
5. **Documentation**: Keep docs updated

## Conventions

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed coding conventions:
- One type per file
- Namespace matching folder structure
- PascalCase for types and files
- Consistent formatting via .editorconfig
