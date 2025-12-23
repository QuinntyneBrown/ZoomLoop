# Identity Software Requirements Specification - Backend

## Document Information

- **Project:** ZoomLoop
- **Version:** 1.0
- **Date:** 2025-12-22
- **Status:** Implemented

---

## Table of Contents

1. [Authentication Requirements](#authentication-requirements)
2. [Password Security Requirements](#password-security-requirements)
3. [User Management Requirements](#user-management-requirements)
4. [Authorization & Access Control Requirements](#authorization--access-control-requirements)
5. [Security Infrastructure Requirements](#security-infrastructure-requirements)
6. [Configuration Requirements](#configuration-requirements)

---

## 1. Authentication Requirements

### REQ-AUTH-001: JWT Bearer Token Authentication

**Requirement:** The system shall implement JWT (JSON Web Token) based authentication using Bearer token scheme with HMAC-SHA256 signing algorithm.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] JWT tokens are signed using HMAC-SHA256 symmetric encryption
- [x] Token validation verifies issuer, audience, and signing key
- [x] Token lifetime is validated
- [x] Invalid or expired tokens are rejected
- [x] Tokens are provided via Authorization header

**Configuration:**

| Parameter | Value |
|-----------|-------|
| Token Expiration | 60 minutes (1 hour) |
| Issuer | EventManagementPlatform |
| Audience | EventManagementPlatform |
| Algorithm | HS256 |

**API Endpoint:** `POST /api/identity/authenticate`

**Request:**

```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "user@example.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a3d5f7b9c1e2d4f6a8b0c2e4d6f8a0b2...",
  "roles": ["Administrator"]
}
```

**Implementation Files:**
- [IdentityController.cs](../../../src/EventManagementPlatform.Api/Controllers/IdentityController.cs)
- [AuthenticateCommandHandler.cs](../../../src/EventManagementPlatform.Api/Features/Identity/Authenticate/AuthenticateCommandHandler.cs)

---

### REQ-AUTH-002: Token Generation and Management

**Requirement:** The system shall provide secure token generation with configurable expiration and support for refresh tokens.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] JWT tokens are generated with standard claims (sub, unique_name, jti, role)
- [x] Access tokens expire after 1 hour
- [x] Refresh tokens are generated using cryptographically secure random numbers (32 bytes, Base64 encoded)
- [x] Token expiration is configurable via appsettings
- [x] Refresh tokens are stored in database and rotated on refresh

**Token Claims:**

| Claim Type | Description | Example |
|------------|-------------|---------|
| sub | Subject (User ID) | "3fa85f64-5717-4562-b3fc-2c963f66afa6" |
| unique_name | User's username | "user@example.com" |
| jti | JWT ID (unique token identifier) | "7c9e6679-7425-40de-944b-e07fc1f90ae7" |
| role | User roles (multiple claims) | "Administrator" |

**Sample Token Payload:**

```json
{
  "sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "unique_name": "user@example.com",
  "jti": "7c9e6679-7425-40de-944b-e07fc1f90ae7",
  "role": ["Administrator"],
  "nbf": 1702345600,
  "exp": 1702349200,
  "iss": "EventManagementPlatform",
  "aud": "EventManagementPlatform"
}
```

**Implementation Files:**
- [TokenService.cs](../../../src/EventManagementPlatform.Core/Services/TokenService.cs)

---

### REQ-AUTH-003: User Registration Endpoint

**Requirement:** The system shall provide a public registration endpoint that accepts username and password credentials and creates new user accounts.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Endpoint is accessible without authentication (AllowAnonymous)
- [x] Endpoint is exposed at POST /api/identity/register
- [x] Username must be 3-100 characters
- [x] Username must be unique
- [x] Password must be at least 6 characters
- [x] Password confirmation must match password
- [x] Password is hashed with salt before storage
- [x] User existence is verified to prevent duplicates
- [x] Successful registration returns userId and username

**API Endpoint:** `POST /api/identity/register`

**Request:**

```json
{
  "username": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "newuser@example.com"
}
```

**Validation Rules:**

| Field | Rule | Error Message |
|-------|------|---------------|
| Username | Required, 3-100 characters | "Username is required and must be between 3 and 100 characters" |
| Password | Required, minimum 6 characters | "Password must be at least 6 characters" |
| ConfirmPassword | Must match Password | "Passwords do not match" |

**Implementation Files:**
- [IdentityController.cs](../../../src/EventManagementPlatform.Api/Controllers/IdentityController.cs)
- [RegisterCommandHandler.cs](../../../src/EventManagementPlatform.Api/Features/Identity/Register/RegisterCommandHandler.cs)
- [RegisterCommandValidator.cs](../../../src/EventManagementPlatform.Api/Features/Identity/Register/RegisterCommandValidator.cs)

---

### REQ-AUTH-004: Token Refresh Endpoint

**Requirement:** The system shall provide a token refresh endpoint that allows users to obtain new access tokens using refresh tokens.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Endpoint is accessible without authentication (AllowAnonymous)
- [x] Endpoint is exposed at POST /api/identity/refresh-token
- [x] Refresh token is validated against database
- [x] New access token is generated
- [x] New refresh token is generated and stored
- [x] Old refresh token is replaced with new one
- [x] Invalid refresh tokens return 401 Unauthorized

**API Endpoint:** `POST /api/identity/refresh-token`

**Request:**

```json
{
  "refreshToken": "a3d5f7b9c1e2d4f6a8b0c2e4d6f8a0b2..."
}
```

**Response (200 OK):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2..."
}
```

**Implementation Files:**
- [IdentityController.cs](../../../src/EventManagementPlatform.Api/Controllers/IdentityController.cs)
- [RefreshTokenCommandHandler.cs](../../../src/EventManagementPlatform.Api/Features/Identity/RefreshToken/RefreshTokenCommandHandler.cs)
- [RefreshTokenCommandValidator.cs](../../../src/EventManagementPlatform.Api/Features/Identity/RefreshToken/RefreshTokenCommandValidator.cs)

---

## 2. Password Security Requirements

### REQ-PWD-001: Password Hashing

**Requirement:** The system shall hash all passwords using PBKDF2 (Password-Based Key Derivation Function 2) with per-user salts before storage.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] PBKDF2 algorithm is used with HMACSHA256 pseudo-random function
- [x] 10,000 iterations are performed
- [x] 128-bit (16 bytes) cryptographically secure random salt is generated per user
- [x] 256-bit (32 bytes) hash output is produced
- [x] Plaintext passwords are never stored
- [x] Salt is stored alongside hashed password in database

**Algorithm Specifications:**

| Parameter | Value |
|-----------|-------|
| Algorithm | PBKDF2 |
| PRF | HMACSHA256 |
| Iterations | 10,000 |
| Salt Size | 128 bits (16 bytes) |
| Hash Size | 256 bits (32 bytes) |
| Salt Generation | RandomNumberGenerator (cryptographically secure) |

**Implementation:**

```csharp
public class PasswordHasher : IPasswordHasher
{
    public (string hashedPassword, byte[] salt) HashPassword(string password)
    {
        var salt = new byte[16];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(salt);
        }

        var hash = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 32
        );

        return (Convert.ToBase64String(hash), salt);
    }

    public bool VerifyPassword(string password, string hashedPassword, byte[] salt)
    {
        var hashToCompare = KeyDerivation.Pbkdf2(
            password: password,
            salt: salt,
            prf: KeyDerivationPrf.HMACSHA256,
            iterationCount: 10000,
            numBytesRequested: 32
        );

        return Convert.ToBase64String(hashToCompare) == hashedPassword;
    }
}
```

**Implementation Files:**
- [PasswordHasher.cs](../../../src/EventManagementPlatform.Core/Services/PasswordHasher.cs)

---

### REQ-PWD-002: Password Policy

**Requirement:** The system shall enforce password complexity and security policies for all user passwords.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Passwords must be at least 6 characters in length
- [x] Password confirmation must match new password during registration
- [x] Empty or whitespace-only passwords are rejected

**Password Policy Rules:**

| Rule | Requirement | Enforced |
|------|-------------|----------|
| Minimum Length | 6 characters | Yes |
| Maximum Length | Not specified | No |
| Uppercase Required | Not required | No |
| Lowercase Required | Not required | No |
| Number Required | Not required | No |
| Special Character Required | Not required | No |
| Password History | Not enforced | No |
| Password Expiration | Not enforced | No |

**Validation:**

```csharp
RuleFor(x => x.Username).NotEmpty().Length(3, 100);
RuleFor(x => x.Password).NotEmpty().MinimumLength(6);
RuleFor(x => x.ConfirmPassword).Equal(x => x.Password)
    .WithMessage("Passwords do not match");
```

**Implementation Files:**
- [RegisterCommandValidator.cs](../../../src/EventManagementPlatform.Api/Features/Identity/Register/RegisterCommandValidator.cs)

---

## 3. User Management Requirements

### REQ-USER-001: User Entity Model

**Requirement:** The system shall maintain a comprehensive user entity with unique identification, credentials, roles, and profile associations.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Each user has a unique GUID identifier
- [x] Username is unique across the system
- [x] Password is stored as hashed value with salt
- [x] Users can have multiple roles (many-to-many relationship)
- [x] Users can have a default profile and current profile
- [x] Soft delete is supported via IsDeleted flag
- [x] Refresh tokens are stored per user

**User Entity Schema:**

| Property | Type | Constraints | Description |
|----------|------|-------------|-------------|
| UserId | Guid | Primary Key, Required | Unique user identifier |
| Username | string | Required, Unique, MaxLength(100) | User's login name/email |
| Password | string | Required | Hashed password (Base64 encoded) |
| Salt | byte[] | Required | Cryptographic salt (128-bit/16 bytes) |
| RefreshToken | string? | Nullable, MaxLength(500) | Current refresh token |
| CurrentProfileId | Guid? | Nullable | Currently active profile |
| DefaultProfileId | Guid? | Nullable | Default profile |
| IsDeleted | bool | Default: false | Soft delete flag |
| CreatedAt | DateTime | Required | Creation timestamp |
| ModifiedAt | DateTime? | Nullable | Last modification timestamp |
| Roles | Collection<Role> | Navigation | Associated roles |

**Implementation Files:**
- [User.cs](../../../src/EventManagementPlatform.Core/Model/UserAggregate/User.cs)
- [UserConfiguration.cs](../../../src/EventManagementPlatform.Infrastructure/Configurations/UserConfiguration.cs)

---

## 4. Authorization & Access Control Requirements

### REQ-AUTHZ-001: Role-Based Access Control (RBAC)

**Requirement:** The system shall implement role-based access control with roles and role-privilege mappings.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] System supports multiple roles
- [x] Roles can have multiple privileges
- [x] Users can have multiple roles (many-to-many)
- [x] Role assignments are persistent in database
- [x] Roles are included in JWT token claims

**Role Entity Schema:**

| Property | Type | Constraints | Description |
|----------|------|-------------|-------------|
| RoleId | Guid | Primary Key, Required | Unique role identifier |
| Name | string | Required, Unique | Role name |
| Privileges | Collection<Privilege> | Navigation | Associated privileges |
| Users | Collection<User> | Navigation | Users with this role |

**Implementation Files:**
- [Role.cs](../../../src/EventManagementPlatform.Core/Model/UserAggregate/Role.cs)
- [RoleConfiguration.cs](../../../src/EventManagementPlatform.Infrastructure/Configurations/RoleConfiguration.cs)

---

### REQ-AUTHZ-002: Privilege-Based Authorization

**Requirement:** The system shall implement granular privilege-based authorization at the resource and operation level.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Privileges are defined per role and resource aggregate
- [x] Five access rights are supported: None, Read, Write, Create, Delete
- [x] Privileges are stored in database with roles
- [x] Privilege model includes aggregate name and access right

**Access Rights Enum:**

```csharp
public enum AccessRight
{
    None = 0,
    Read = 1,
    Write = 2,
    Create = 3,
    Delete = 4
}
```

**Privilege Entity Schema:**

| Property | Type | Constraints | Description |
|----------|------|-------------|-------------|
| PrivilegeId | Guid | Primary Key | Unique privilege identifier |
| RoleId | Guid | Foreign Key, Required | Associated role |
| Aggregate | string | Required, MaxLength(100) | Resource/aggregate name |
| AccessRight | AccessRight | Required | Access level |
| Role | Role | Navigation | Parent role |

**Sample Privilege Configuration:**

```csharp
new Privilege
{
    PrivilegeId = Guid.NewGuid(),
    RoleId = systemAdminRoleId,
    Aggregate = "User",
    AccessRight = AccessRight.Create
}
```

**Implementation Files:**
- [Privilege.cs](../../../src/EventManagementPlatform.Core/Model/UserAggregate/Privilege.cs)
- [AccessRight.cs](../../../src/EventManagementPlatform.Core/Model/UserAggregate/Enums/AccessRight.cs)
- [PrivilegeConfiguration.cs](../../../src/EventManagementPlatform.Infrastructure/Configurations/PrivilegeConfiguration.cs)

---

### REQ-AUTHZ-003: Protected Resource Endpoints

**Requirement:** The system shall protect resource management endpoints with authentication using the [Authorize] attribute.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] All resource controllers require authentication
- [x] Customers, Events, Staff, Venues, Equipment controllers are protected
- [x] Identity endpoints (authenticate, register, refresh-token) are public
- [x] Authorization is enforced globally via JWT Bearer authentication

**Protected Controllers:**

| Controller | Protection | Resources |
|------------|-----------|-----------|
| CustomersController | [Authorize] | Customer CRUD operations |
| EventsController | [Authorize] | Event CRUD operations |
| StaffController | [Authorize] | Staff CRUD operations |
| VenuesController | [Authorize] | Venue CRUD operations |
| EquipmentController | [Authorize] | Equipment CRUD operations |
| IdentityController | [AllowAnonymous] on auth endpoints | Authentication/Registration |

**Implementation Files:**
- [CustomersController.cs](../../../src/EventManagementPlatform.Api/Controllers/CustomersController.cs)
- [EventsController.cs](../../../src/EventManagementPlatform.Api/Controllers/EventsController.cs)
- [StaffController.cs](../../../src/EventManagementPlatform.Api/Controllers/StaffController.cs)
- [VenuesController.cs](../../../src/EventManagementPlatform.Api/Controllers/VenuesController.cs)
- [EquipmentController.cs](../../../src/EventManagementPlatform.Api/Controllers/EquipmentController.cs)

---

## 5. Security Infrastructure Requirements

### REQ-SEC-001: JWT Authentication Middleware

**Requirement:** The system shall configure ASP.NET Core authentication and authorization middleware in the request pipeline.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] JWT Bearer authentication is configured
- [x] Token validation parameters are set (issuer, audience, signing key, lifetime)
- [x] Authentication middleware is in the pipeline
- [x] Authorization middleware is in the pipeline
- [x] Authentication occurs on every request to protected endpoints

**JWT Configuration:**

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = configuration["Jwt:Issuer"],
            ValidAudience = configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["Jwt:Key"])
            )
        };
    });
```

**Implementation Files:**
- [ConfigureServices.cs](../../../src/EventManagementPlatform.Api/ConfigureServices.cs)

---

### REQ-SEC-002: CORS Configuration

**Requirement:** The system shall configure Cross-Origin Resource Sharing (CORS) to allow authorized client applications to access the API.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] CORS policy allows specific origins (localhost:4200 for Angular frontend)
- [x] All HTTP methods are allowed
- [x] All headers are allowed
- [x] Credentials are allowed for authenticated requests
- [x] Policy is applied to all endpoints

**CORS Configuration:**

```csharp
services.AddCors(options =>
{
    options.AddPolicy("AllowAngularClient", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
```

**Implementation Files:**
- [ConfigureServices.cs](../../../src/EventManagementPlatform.Api/ConfigureServices.cs)

---

### REQ-SEC-003: Swagger/OpenAPI Security Configuration

**Requirement:** The system shall configure OpenAPI/Swagger documentation with Bearer token authentication support.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] Swagger UI includes security definition for Bearer tokens
- [x] Users can input JWT tokens in Swagger UI
- [x] All protected endpoints show lock icon
- [x] Token is automatically included in authorized requests

**Swagger Security Configuration:**

```csharp
services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
```

**Implementation Files:**
- [ConfigureServices.cs](../../../src/EventManagementPlatform.Api/ConfigureServices.cs)

---

## 6. Configuration Requirements

### REQ-CFG-001: Environment-Specific Configuration

**Requirement:** The system shall support environment-specific authentication configuration via appsettings.json.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] JWT secret key is configurable
- [x] JWT issuer is configurable
- [x] JWT audience is configurable
- [x] Configuration is loaded from appsettings.json
- [x] Environment-specific overrides are supported via appsettings.{Environment}.json

**Configuration Structure:**

```json
{
  "Jwt": {
    "Key": "EventManagementPlatformSecretKey2025VeryLongSecretKey!",
    "Issuer": "EventManagementPlatform",
    "Audience": "EventManagementPlatform"
  },
  "ConnectionStrings": {
    "DefaultConnection": "..."
  }
}
```

**Implementation Files:**
- [appsettings.json](../../../src/EventManagementPlatform.Api/appsettings.json)
- [appsettings.Development.json](../../../src/EventManagementPlatform.Api/appsettings.Development.json)

---

### REQ-CFG-002: Dependency Injection Configuration

**Requirement:** The system shall register all identity-related services in the dependency injection container.

**Implementation Status:** ✅ IMPLEMENTED

**Acceptance Criteria:**
- [x] IPasswordHasher is registered as scoped service
- [x] ITokenService is registered as scoped service
- [x] MediatR is registered with command handlers
- [x] FluentValidation validators are registered
- [x] DbContext is registered with connection string

**Service Registration:**

```csharp
services.AddScoped<IPasswordHasher, PasswordHasher>();
services.AddScoped<ITokenService, TokenService>();
services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(Program).Assembly));
services.AddValidatorsFromAssembly(typeof(Program).Assembly);
services.AddDbContext<EventManagementPlatformDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
```

**Implementation Files:**
- [ConfigureServices.cs](../../../src/EventManagementPlatform.Api/ConfigureServices.cs)

---

## Appendix A: API Reference

### Identity Endpoints

#### POST /api/identity/authenticate
**Description:** Authenticates a user and returns JWT tokens

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "user@example.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "a3d5f7b9c1e2d4f6a8b0c2e4d6f8a0b2...",
  "roles": ["Administrator"]
}
```

**Error Responses:**
- 401 Unauthorized: Invalid credentials
- 400 Bad Request: Validation errors

---

#### POST /api/identity/register
**Description:** Registers a new user account

**Request:**
```json
{
  "username": "newuser@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "newuser@example.com"
}
```

**Error Responses:**
- 400 Bad Request: Validation errors or username already exists

---

#### POST /api/identity/refresh-token
**Description:** Refreshes an expired access token using a refresh token

**Request:**
```json
{
  "refreshToken": "a3d5f7b9c1e2d4f6a8b0c2e4d6f8a0b2..."
}
```

**Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "x7y8z9a0b1c2d3e4f5g6h7i8j9k0l1m2..."
}
```

**Error Responses:**
- 401 Unauthorized: Invalid refresh token

---

## Appendix B: Security Considerations

### Implemented Security Controls

1. **Password Storage**
   - Passwords hashed with PBKDF2-HMACSHA256 (10,000 iterations)
   - Per-user cryptographic salts (128-bit)
   - No plaintext password storage

2. **Token Security**
   - JWT signed with HMAC-SHA256
   - Access token expiration: 1 hour
   - Refresh token rotation on each refresh
   - Refresh tokens stored securely in database

3. **Authorization**
   - Role-based access control
   - Granular privilege system (Read, Write, Create, Delete)
   - JWT claims-based authorization
   - Global [Authorize] attribute on protected controllers

4. **Input Validation**
   - FluentValidation framework
   - Password policy enforcement (minimum 6 characters)
   - Username uniqueness checks
   - Username length constraints (3-100 characters)

5. **CORS**
   - Configured for Angular frontend (localhost:4200)
   - Credentials allowed for authenticated requests

6. **Soft Delete**
   - Users are soft-deleted (IsDeleted flag)
   - Maintains data integrity and audit trail

### Not Implemented (Future Enhancements)

1. Multi-factor authentication (2FA/MFA)
2. OAuth/OpenID Connect providers
3. Account lockout after failed attempts
4. Password expiration policies
5. Password history enforcement
6. Email verification for registration
7. Password reset via email
8. Rate limiting on authentication endpoints
9. Audit logging for authentication events
10. Token blacklisting/revocation

---

## Appendix C: Database Schema

### Users Table

```sql
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(MAX) NOT NULL,
    Salt VARBINARY(16) NOT NULL,
    RefreshToken NVARCHAR(500) NULL,
    CurrentProfileId UNIQUEIDENTIFIER NULL,
    DefaultProfileId UNIQUEIDENTIFIER NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2 NOT NULL,
    ModifiedAt DATETIME2 NULL
);

CREATE INDEX IX_Users_Username ON Users(Username);
```

### Roles Table

```sql
CREATE TABLE Roles (
    RoleId UNIQUEIDENTIFIER PRIMARY KEY,
    Name NVARCHAR(MAX) NOT NULL UNIQUE
);
```

### UserRoles Table (Many-to-Many)

```sql
CREATE TABLE UserRoles (
    UserId UNIQUEIDENTIFIER NOT NULL,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    PRIMARY KEY (UserId, RoleId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE
);
```

### Privileges Table

```sql
CREATE TABLE Privileges (
    PrivilegeId UNIQUEIDENTIFIER PRIMARY KEY,
    RoleId UNIQUEIDENTIFIER NOT NULL,
    Aggregate NVARCHAR(100) NOT NULL,
    AccessRight INT NOT NULL,
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId) ON DELETE CASCADE
);
```

---

**End of Document**
