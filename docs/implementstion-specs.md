# Software Requirements Specification (SRS)
## ZoomLoop System

**Document Version:** 1.0
**Date:** 2025-12-21
**Status:** Final

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the technical requirements and architectural specifications for the ZoomLoop system. It defines the structural organization, naming conventions, and implementation standards that shall be followed throughout the development lifecycle.

### 1.2 Scope
This specification covers the backend (.NET-based) and frontend (Angular-based) components of the ZoomLoop system, including project structure, architectural patterns, coding conventions, and technology stack requirements.

### 1.3 Definitions, Acronyms, and Abbreviations
- **SRS**: Software Requirements Specification
- **API**: Application Programming Interface
- **DTO**: Data Transfer Object
- **EF**: Entity Framework
- **BEM**: Block Element Modifier (CSS naming methodology)
- **CORS**: Cross-Origin Resource Sharing
- **DDD**: Domain-Driven Design

### 1.4 Critical Architectural Constraints

The following architectural constraints are fundamental to the ZoomLoop system and SHALL NOT be violated under any circumstances:

1. **No Repository Pattern**: ZoomLoop SHALL NOT use the Repository pattern (IRepository or any repository abstraction) for data persistence. All data access SHALL be performed directly through the `IZoomLoopContext` interface.

2. **Services in Core (PREFERRED)**: Business logic and domain services SHALL be implemented in `ZoomLoop.Core` whenever possible. This is the **PREFERRED** architectural approach. Services should only be placed outside the Core project when they have explicit infrastructure dependencies.

3. **IZoomLoopContext as Persistence Surface**: The `IZoomLoopContext` interface is the single, unified persistence surface for the entire system. No additional abstraction layers SHALL be introduced.

---

## 2. System-Wide Requirements

### 2.1 Namespace Architecture
**REQ-SYS-001**: The system SHALL use flattened namespaces throughout all projects.

### 2.8 Frontend Theme and Colours
**REQ-SYS-011**: The frontend SHALL use the default Angular Material colours and theme. No new colours are to be introduced.

### 2.2 Backend Project Structure
**REQ-SYS-002**: The Backend SHALL consist of exactly three (3) projects:
- ZoomLoop.Core
- ZoomLoop.Infrastructure
- ZoomLoop.Api

### 2.3 Object Mapping
**REQ-SYS-003**: The system SHALL NOT use AutoMapper for object mapping.

**REQ-SYS-004**: The system SHALL create extension methods for Core models in the Api layer with a `ToDto` method that returns the mapped DTO.

### 2.4 Data Access Pattern
**REQ-SYS-005**: **CRITICAL** - The system SHALL NOT use the Repository pattern (IRepository or any repository abstraction) for persistence. This is a fundamental architectural constraint.

**REQ-SYS-006**: The system SHALL use the `IZoomLoopContext` interface directly for all data access operations. This interface provides the persistence surface for the entire system.

### 2.5 Identity Property Naming
**REQ-SYS-007**: The system SHALL include the name of the entity in identity properties.

**Example (Compliant):**
```
{Entity}Id
```

**Example (Non-Compliant):**
```
Id
```

### 2.6 File Organization
**REQ-SYS-008**: The system SHALL have exactly one (1) class, enum, record, or other type definition per file.

**REQ-SYS-009**: The system SHALL NOT have multiple object definitions in a single file.

### 2.7 Database Configuration
**REQ-SYS-010**: The system SHALL use SQL Server Express as the default database.

### 2.9 Implementation Simplicity
**REQ-SYS-012**: All implementations in the system SHALL be as simple as possible. Complex solutions SHALL be avoided in favor of straightforward, maintainable approaches that directly solve the problem at hand.

### 2.10 Structured Logging
**REQ-SYS-013**: **CRITICAL** - The system SHALL implement structured logging using Serilog across all backend areas with appropriate log levels and enrichment.

**REQ-SYS-014**: Information level SHALL log normal operations and API calls.

**REQ-SYS-015**: Warning level SHALL log validation failures and business rule violations.

**REQ-SYS-016**: Error level SHALL log all exceptions and external service failures with complete error details.

**REQ-SYS-017**: Critical level SHALL log system failures and data corruption issues.

**REQ-SYS-018**: Logs SHALL be enriched with CorrelationId, UserId, Timestamp, and relevant context identifiers (e.g., VehicleId, UserId, CustomerId).

**REQ-SYS-019**: Environment information SHALL be included in logs.

**REQ-SYS-020**: Logs SHALL be centralized in Azure Log Analytics (production) or appropriate development targets.

**REQ-SYS-021**: Sensitive data (passwords, tokens, credit card information, personal identification numbers) SHALL NOT be logged.

**REQ-SYS-022**: All errors and exceptions SHALL be clearly logged with sufficient context to enable debugging and troubleshooting.

---

## 3. Core Project Requirements

### 3.1 Project Identity
**REQ-CORE-001**: The Core project SHALL be named `ZoomLoop.Core`.

### 3.2 Aggregate Organization
**REQ-CORE-002**: Aggregates SHALL be placed in the `ZoomLoop.Core\Model` folder.

**REQ-CORE-003**: Each aggregate SHALL have a dedicated folder in `ZoomLoop.Core\Model` named `ZoomLoop.Core\Model\{Aggregate}Aggregate`.

### 3.3 Persistence Interface
**REQ-CORE-004**: The Core project SHALL contain an interface named `IZoomLoopContext` with DbSet properties for each entity in the system. This interface represents the persistence surface. The implementation of this interface SHALL be located in the Infrastructure project.

**REQ-CORE-005**: **CRITICAL** - All data access operations throughout the system SHALL use the `IZoomLoopContext` interface directly. No repository pattern or abstraction layer SHALL be introduced between business logic and the context interface.

### 3.4 Service Layer
**REQ-CORE-006**: **CRITICAL** - Backend services SHALL be located in a folder named `Services` within the project where they are implemented.

**REQ-CORE-007**: **CRITICAL** - Backend services SHALL be implemented in `ZoomLoop.Core\Services` whenever possible. This is the **PREFERRED** approach. Business logic, domain services, and application services SHALL reside in the Core project's Services folder unless they have specific infrastructure dependencies that necessitate placement in the Infrastructure project.

**REQ-CORE-008**: When infrastructure dependencies require a service to be implemented outside the Core project, the service SHALL be placed in `ZoomLoop.Infrastructure\Services`.

**REQ-CORE-009**: The `ZoomLoop.Core\Services` folder SHALL contain service interfaces and classes with core business logic for the system.

**REQ-CORE-010**: Service implementations in `ZoomLoop.Core\Services` SHALL include but are not limited to: Authentication services, Email services, Azure AI Integration services, and other domain-specific business logic services.

### 3.5 Aggregate Folder Structure
**REQ-CORE-011**: Aggregate folders SHALL be named `ZoomLoop.Core\Model\{Aggregate}Aggregate`.

**REQ-CORE-012**: The aggregate folder `ZoomLoop.Core\Model\{Aggregate}Aggregate` SHALL contain all related Entities, Enums, Events, AggregateRoot, and other domain objects.

**REQ-CORE-013**: Each type within `ZoomLoop.Core\Model\{Aggregate}Aggregate` SHALL have its own subfolder (e.g., Events folder, Enums folder).

---

## 4. Infrastructure Project Requirements

### 4.1 Project Identity
**REQ-INFRA-001**: The Infrastructure project SHALL be named `ZoomLoop.Infrastructure`.

### 4.2 Context Implementation
**REQ-INFRA-002**: The Infrastructure project SHALL contain the implementation of `IZoomLoopContext`. The implementation class SHALL be named `ZoomLoopContext`.

### 4.3 Entity Framework Components
**REQ-INFRA-003**: The Infrastructure project SHALL contain Entity Framework migrations.

**REQ-INFRA-004**: The Infrastructure project SHALL contain Entity Configurations.

**REQ-INFRA-005**: The Infrastructure project SHALL contain database seeding services.

---

## 5. API Project Requirements

### 5.1 Project Identity
**REQ-API-001**: The API project SHALL be named `ZoomLoop.Api`.

### 5.2 Feature Organization
**REQ-API-002**: The API project SHALL have a folder named `Features` containing all Commands and Queries (using MediatR) grouped in folders by Bounded Context.

**REQ-API-003**: The subfolders within the Features folder SHALL contain the DTOs associated with their respective features.

### 5.3 Controller Organization
**REQ-API-004**: The API project SHALL have API Controllers located in a `Controllers` folder.

### 5.4 MediatR Behaviors
**REQ-API-005**: The API project MAY optionally have MediatR behaviors in a folder named `Behaviours`.

### 5.5 CORS Configuration
**REQ-API-006**: The API SHALL have a CORS policy defined. The origins allowed in the CORS policy SHALL be retrieved from configuration and SHALL include the URLs where the frontend(s) are hosted.

---

## 6. Frontend Requirements

### 6.1 Project Identity
**REQ-FE-001**: The frontend SHALL be named `ZoomLoop.App` (located at `src\ZoomLoop.App`).

**REQ-FE-002**: The frontend SHALL be configured as an Angular workspace with projects.

**REQ-FE-003**: The frontend project SHALL be named `ZoomLoop` if it is not an admin frontend.

**REQ-FE-004**: The frontend project SHALL be named `ZoomLoop-admin` if it is an admin frontend.

### 6.2 Technology Stack
**REQ-FE-005**: The system SHALL use the latest stable version of Angular.

**REQ-FE-006**: The system SHALL use the latest stable version of Angular Material for all UI elements.

**REQ-FE-007**: The frontend SHALL NOT use NgRx for state management.

**REQ-FE-008**: The frontend SHALL NOT use Angular signals.

**REQ-FE-009**: The frontend SHALL use RxJS for state management.

**REQ-FE-010**: The system SHALL strictly adhere to Material 3 guidelines and SHALL NOT use any colors that are not defined in the Angular Material theme.

### 6.3 Component File Structure
**REQ-FE-011**: Component files in the frontend SHALL be separated into distinct files:
- A file for HTML template
- A file for SCSS styles
- A file for TypeScript code

### 6.4 Component Naming Conventions
**REQ-FE-012**: The frontend SHALL NOT add a "Component" suffix to Angular component class names.

**Example (Compliant):**
```typescript
export class Header { }
```

**Example (Non-Compliant):**
```typescript
export class HeaderComponent { }
```

**REQ-FE-013**: The frontend SHALL NOT add a "component" prefix to Angular component file names.

**Example (Compliant):**
```
header.html
header.scss
header.ts
```

**Example (Non-Compliant):**
```
header.component.html
header.component.scss
header.component.ts
```

### 6.5 Folder Structure
**REQ-FE-014**: The e2e folder SHALL be located at `src/ZoomLoop.App/projects/ZoomLoop/src/e2e`.

**REQ-FE-015**: The frontend SHALL contain a folder named `pages` for components that can appear in the `<router-outlet>`.

**REQ-FE-016**: The frontend SHALL contain a folder named `components` for reusable components. Child components of a page SHALL be contained within the components folder.

### 6.6 Module Exports
**REQ-FE-017**: The system SHALL create barrel exports (index.ts) for every folder and SHALL export TypeScript code except test code.

### 6.7 Design and Responsiveness
**REQ-FE-018**: The frontend SHALL be responsive and follow a mobile-first design approach.

**REQ-FE-019**: The frontend SHALL use the BEM (Block Element Modifier) HTML class naming strategy.

**REQ-FE-020**: The frontend SHALL use design tokens for consistent spacing throughout the application.

### 6.8 Testing Configuration
**REQ-FE-021**: The frontend SHALL use Jest for unit tests.

**REQ-FE-022**: The frontend SHALL use Playwright for end-to-end (e2e) tests.

**REQ-FE-023**: Jest tests SHALL be configured to ignore the e2e folder.

### 6.9 API Integration
**REQ-FE-024**: The frontend SHALL be configured with a `baseUrl` which is the URL of the backend as specified in the launchSettings.

**REQ-FE-025**: The frontend SHALL have a single configuration point for the baseUrl of the backend API.

**REQ-FE-026**: **CRITICAL** - The frontend `baseUrl` configuration SHALL contain ONLY the base URI without the `/api` path segment. Frontend services SHALL append the complete path including `/api` and any additional segments when making HTTP requests.

**Example (Compliant):**
```typescript
// Configuration
baseUrl = "http://localhost:3200"

// Service usage
this.http.get(`${baseUrl}/api/customers`)
```

**Example (Non-Compliant):**
```typescript
// Configuration
baseUrl = "http://localhost:3200/api"

// Service usage
this.http.get(`${baseUrl}/customers`)
```

---

## 7. Code Linting and Static Analysis

### 7.1 Backend Linting Requirements
**REQ-LINT-001**: **CRITICAL** - The backend SHALL use StyleCop.Analyzers and Microsoft.CodeAnalysis.NetAnalyzers for code style and quality enforcement.

**REQ-LINT-002**: All linting warnings in the backend SHALL be treated as errors and SHALL block the build.

**REQ-LINT-003**: The backend linting configuration SHALL enforce:
- Consistent code style and formatting
- Null safety analysis
- Code quality best practices
- Security vulnerability detection

**REQ-LINT-004**: A shared `.editorconfig` file SHALL be used at the solution root to define consistent code style rules across all backend projects.

### 7.2 Frontend Linting Requirements
**REQ-LINT-005**: **CRITICAL** - The frontend SHALL use ESLint with the official Angular ESLint plugin (@angular-eslint) for TypeScript and template linting.

**REQ-LINT-006**: All linting errors in the frontend SHALL block the build.

**REQ-LINT-007**: The frontend linting configuration SHALL enforce:
- TypeScript best practices
- Angular-specific conventions and best practices
- Accessibility (a11y) rules
- Import organization

**REQ-LINT-008**: A `lint` script SHALL be added to package.json and SHALL be executed as part of the build process.

### 7.3 Build Integration
**REQ-LINT-009**: **CRITICAL** - Both backend and frontend builds SHALL fail if any linting errors are detected. This ensures code quality gates are enforced before code can be merged.

**REQ-LINT-010**: Linting SHALL be integrated into the CI/CD pipeline as a mandatory quality gate.

---

## 8. Compliance and Standards

### 8.1 Code Quality
All code SHALL adhere to the requirements specified in this document. Deviations from these requirements SHALL require formal approval and documentation.

### 8.2 Version Control
All changes to this specification SHALL be tracked and versioned appropriately.

---

## 9. Appendices

### 9.1 Document History

| Version | Date       | Author | Description |
|---------|------------|--------|-------------|
| 1.0     | 2025-12-21 | System | Initial SRS document creation |
| 1.1     | 2025-12-22 | System | Added structured logging requirements (REQ-SYS-013 through REQ-SYS-022) |
| 1.2     | 2025-12-22 | System | Added code linting and static analysis requirements (REQ-LINT-001 through REQ-LINT-010) |

---

**End of Software Requirements Specification**