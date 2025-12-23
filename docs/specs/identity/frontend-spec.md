# Identity Software Requirements Specification - Frontend (Angular)

## Document Information

- **Project:** ZoomLoop - Angular Frontend
- **Version:** 1.0
- **Date:** 2025-12-22
- **Status:** Aligned with Backend Implementation

---

## Table of Contents

1. [Authentication Requirements](#authentication-requirements)
2. [Token Management Requirements](#token-management-requirements)
3. [Route Protection & Navigation Requirements](#route-protection--navigation-requirements)
4. [User Registration Requirements](#user-registration-requirements)
5. [Session Management Requirements](#session-management-requirements)
6. [Authorization & Access Control Requirements](#authorization--access-control-requirements)
7. [User Interface Requirements](#user-interface-requirements)
8. [State Management Requirements](#state-management-requirements)
9. [Validation Requirements](#validation-requirements)

---

## 1. Authentication Requirements

### REQ-FE-AUTH-001: Login Form

**Requirement:** The system shall provide a reactive login form with username and password fields that integrates with the backend authentication endpoint.

**Acceptance Criteria:**
- [ ] Login form uses Angular Reactive Forms
- [ ] Username field is required
- [ ] Password field is required
- [ ] Form validation prevents submission of invalid data
- [ ] Submit button emits login credentials event
- [ ] Form is visually accessible and user-friendly

**Form Model:**

```typescript
loginForm: FormGroup = new FormGroup({
  username: new FormControl('', [Validators.required]),
  password: new FormControl('', [Validators.required])
});
```

**Form Fields:**

| Field | Type | Validation | Default |
|-------|------|------------|---------|
| username | string | Required | '' |
| password | string | Required | '' |

**Backend Integration:**
- Endpoint: `POST /api/identity/authenticate`
- Request: `{ username: string, password: string }`

---

### REQ-FE-AUTH-002: Authentication Service

**Requirement:** The system shall provide a centralized authentication service that handles login, logout, and current user state management using the backend identity API.

**Acceptance Criteria:**
- [ ] Service provides `login()` method accepting username and password
- [ ] Login method calls backend API endpoint `POST /api/identity/authenticate`
- [ ] Service provides `logout()` method to clear authentication state
- [ ] Service exposes `currentUser$` observable for reactive state access
- [ ] Service integrates with LocalStorageService for token persistence
- [ ] Service stores both access token and refresh token
- [ ] Service handles roles returned from backend

**Service Interface:**

```typescript
export class AuthService {
  currentUser$: Observable<User>;

  login(options: { username: string; password: string }): Observable<AuthenticateResponse>;
  logout(): void;
  tryToLogin(): Observable<User>;
}
```

**Authentication Response Model (from Backend):**

```typescript
interface AuthenticateResponse {
  userId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}
```

---

### REQ-FE-AUTH-003: Login Page Component

**Requirement:** The system shall provide a login page that orchestrates the authentication flow and manages post-login navigation.

**Acceptance Criteria:**
- [ ] Successful login stores access token and refresh token in localStorage
- [ ] Successful login redirects user to default workspace path
- [ ] Failed login displays appropriate error message from backend
- [ ] Login page is accessible without authentication
- [ ] User roles are stored for authorization checks

**Login Flow:**

```typescript
public handleLogin(credentials: { username: string; password: string }): void {
  this._authService.login(credentials).subscribe({
    next: (response: AuthenticateResponse) => {
      // Store tokens
      this._localStorageService.put({ key: accessTokenKey, value: response.accessToken });
      this._localStorageService.put({ key: refreshTokenKey, value: response.refreshToken });

      // Set current user
      const user: User = {
        userId: response.userId,
        username: response.username,
        roles: response.roles
      };
      this._authService.setCurrentUser(user);

      // Navigate to workspace
      this._navigationService.redirectPreLogin();
    },
    error: (error) => {
      // Display error message (401 Unauthorized, 400 Bad Request)
      this.errorMessage = 'Invalid username or password';
    }
  });
}
```

---

### REQ-FE-AUTH-004: Logout Functionality

**Requirement:** The system shall provide logout functionality that clears all authentication state and redirects to public area.

**Acceptance Criteria:**
- [ ] Logout button is displayed in workspace navigation
- [ ] Clicking logout clears access token from storage
- [ ] Clicking logout clears refresh token from storage
- [ ] Clicking logout clears current user state
- [ ] Logout redirects user to public landing page

**Logout Implementation:**

```typescript
public logout(): void {
  this._localStorageService.put({ key: accessTokenKey, value: null });
  this._localStorageService.put({ key: refreshTokenKey, value: null });
  this._authService.clearCurrentUser();
  this._navigationService.redirectToPublicDefault();
}
```

---

## 2. Token Management Requirements

### REQ-FE-TOKEN-001: Token Storage

**Requirement:** The system shall store JWT access tokens and refresh tokens securely in browser localStorage.

**Acceptance Criteria:**
- [ ] Access token is stored in localStorage
- [ ] Refresh token is stored in localStorage
- [ ] Storage keys are defined as constants
- [ ] Tokens are stored immediately after successful login
- [ ] Tokens are cleared on logout
- [ ] Tokens are cleared on 401 Unauthorized error
- [ ] LocalStorageService provides get/put methods for token access

**Storage Keys:**

| Key | Purpose | Value Format |
|-----|---------|--------------|
| eventmanagement:accessToken | JWT access token | string (JWT, expires in 1 hour) |
| eventmanagement:refreshToken | Refresh token | string (Base64, rotates on refresh) |
| eventmanagement:currentUser | Current user object | User JSON |

**LocalStorage Service Interface:**

```typescript
export class LocalStorageService {
  get({ key }: { key: string }): any;
  put({ key, value }: { key: string; value: any }): void;
}
```

---

### REQ-FE-TOKEN-002: HTTP Headers Interceptor

**Requirement:** The system shall automatically inject JWT access tokens into all HTTP request headers using an HTTP interceptor.

**Acceptance Criteria:**
- [ ] Interceptor retrieves access token from localStorage
- [ ] Interceptor adds `Authorization` header with Bearer scheme
- [ ] Header format is: `Authorization: Bearer {accessToken}`
- [ ] Interceptor applies to all outgoing HTTP requests to the API
- [ ] Interceptor does not modify requests if no token is present
- [ ] Interceptor is registered in app module providers

**Interceptor Implementation:**

```typescript
export class HeadersInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this._localStorageService.get({ key: accessTokenKey });

    if (accessToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
      });
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}
```

---

### REQ-FE-TOKEN-003: JWT Error Interceptor & Token Refresh

**Requirement:** The system shall intercept HTTP 401 Unauthorized errors and attempt to refresh the access token using the refresh token.

**Acceptance Criteria:**
- [ ] Interceptor detects 401 status codes in HTTP responses
- [ ] 401 errors trigger token refresh attempt using refresh token
- [ ] Refresh request calls `POST /api/identity/refresh-token`
- [ ] New access token and refresh token are stored
- [ ] Original failed request is retried with new access token
- [ ] If refresh fails, clear tokens and redirect to login
- [ ] Navigation service is used for consistent redirection

**Token Refresh Flow:**

```
API Request → Headers Interceptor (adds access token) → API Response
                                                              ↓
                                                         401 Error?
                                                              ↓ Yes
                                              JWT Interceptor catches error
                                                              ↓
                                                 Attempt token refresh
                                                              ↓
                              ┌─────────────────────────────┴─────────────────────────────┐
                              ↓                                                           ↓
                    Refresh succeeds                                          Refresh fails
                              ↓                                                           ↓
                  Store new tokens                                        Clear all tokens
                              ↓                                                           ↓
              Retry original request                                   Redirect to login
```

**Implementation:**

```typescript
export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Attempt token refresh
          const refreshToken = this._localStorageService.get({ key: refreshTokenKey });

          if (refreshToken) {
            return this._authService.refreshToken({ refreshToken }).pipe(
              switchMap((response: RefreshTokenResponse) => {
                // Store new tokens
                this._localStorageService.put({ key: accessTokenKey, value: response.accessToken });
                this._localStorageService.put({ key: refreshTokenKey, value: response.refreshToken });

                // Retry original request with new token
                const clonedReq = req.clone({
                  headers: req.headers.set('Authorization', `Bearer ${response.accessToken}`)
                });
                return next.handle(clonedReq);
              }),
              catchError(() => {
                // Refresh failed, logout
                this._authService.logout();
                this._navigationService.redirectToLogin();
                return throwError(error);
              })
            );
          }

          // No refresh token, logout
          this._authService.logout();
          this._navigationService.redirectToLogin();
        }
        return throwError(error);
      })
    );
  }
}
```

**Backend Integration:**
- Endpoint: `POST /api/identity/refresh-token`
- Request: `{ refreshToken: string }`
- Response: `{ accessToken: string, refreshToken: string }`

---

## 3. Route Protection & Navigation Requirements

### REQ-FE-ROUTE-001: Authentication Guard

**Requirement:** The system shall implement a route guard that protects workspace routes from unauthorized access.

**Acceptance Criteria:**
- [ ] Guard implements Angular `CanActivate` interface
- [ ] Guard checks for access token in localStorage
- [ ] Guard allows navigation if token exists
- [ ] Guard prevents navigation and redirects to login if no token
- [ ] Guard saves attempted URL for post-login redirection
- [ ] Guard is applied to protected route tree

**Guard Implementation:**

```typescript
export class AuthGuard implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessToken = this._localStorageService.get({ key: accessTokenKey });

    if (accessToken) {
      return true;
    }

    this._navigationService.lastPath = state.url;
    this._navigationService.redirectToLogin();
    return false;
  }
}
```

---

### REQ-FE-ROUTE-002: Route Configuration

**Requirement:** The system shall define protected and public routes with appropriate guards and lazy loading.

**Acceptance Criteria:**
- [ ] Workspace routes are protected with `AuthGuard`
- [ ] Login route is public and accessible without authentication
- [ ] Registration route is public
- [ ] Protected routes lazy load workspace module
- [ ] Unauthenticated access to protected routes redirects to login

**Route Configuration:**

```typescript
const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'workspace',
    canActivate: [AuthGuard],
    loadChildren: () => import('./workspace/workspace.module').then(m => m.WorkspaceModule)
  }
];
```

---

### REQ-FE-ROUTE-003: Navigation Service

**Requirement:** The system shall provide a centralized navigation service for consistent routing and post-login redirection.

**Acceptance Criteria:**
- [ ] Service provides `redirectToLogin()` method
- [ ] Service provides `redirectPreLogin()` method for post-login navigation
- [ ] Service provides `redirectToPublicDefault()` for logout navigation
- [ ] Service tracks `lastPath` for return navigation after login
- [ ] Service uses Angular Router for navigation

**Navigation Methods:**

```typescript
export class NavigationService {
  lastPath: string = '/';
  loginUrl: string = '/login';
  defaultWorkspacePath: string = '/workspace/dashboard';

  redirectToLogin(): void {
    this._router.navigate([this.loginUrl]);
  }

  redirectPreLogin(): void {
    const path = this.lastPath || this.defaultWorkspacePath;
    this._router.navigate([path]);
  }

  redirectToPublicDefault(): void {
    this._router.navigate(['/']);
  }
}
```

---

## 4. User Registration Requirements

### REQ-FE-REG-001: Registration Form

**Requirement:** The system shall provide a registration form that integrates with the backend registration endpoint.

**Acceptance Criteria:**
- [ ] Form includes username field (required, 3-100 characters, email format)
- [ ] Form includes password field (required, minimum 6 characters)
- [ ] Form includes password confirmation field (required, must match password)
- [ ] Username field has validation to check format
- [ ] Form emits registration request on valid submission
- [ ] Form prevents submission if validation fails

**Form Fields:**

| Field | Type | Validation |
|-------|------|------------|
| username | string | Required, Email format, 3-100 characters |
| password | string | Required, Minimum 6 characters |
| confirmPassword | string | Required, Must match password |

**Registration Request Model (to Backend):**

```typescript
interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}
```

**Backend Response:**

```typescript
interface RegisterResponse {
  userId: string;
  username: string;
}
```

---

### REQ-FE-REG-002: Registration Page

**Requirement:** The system shall provide a registration page that handles account creation and redirects to login on success.

**Acceptance Criteria:**
- [ ] Page is accessible without authentication
- [ ] Page receives form data from registration form component
- [ ] Page calls backend endpoint `POST /api/identity/register`
- [ ] Successful registration redirects to login page with success message
- [ ] Failed registration displays error message (400 Bad Request if username exists)
- [ ] Page displays user-friendly success/error feedback

**Registration Flow:**

```typescript
public handleRegister(request: RegisterRequest): void {
  this._authService.register(request).subscribe({
    next: (response: RegisterResponse) => {
      // Show success message
      this.successMessage = 'Account created successfully. Please login.';

      // Redirect to login after delay
      setTimeout(() => {
        this._navigationService.redirectToLogin();
      }, 2000);
    },
    error: (error: HttpErrorResponse) => {
      // Display error message (username exists, validation errors)
      if (error.status === 400) {
        this.errorMessage = error.error.message || 'Registration failed. Username may already exist.';
      }
    }
  });
}
```

**Backend Integration:**
- Endpoint: `POST /api/identity/register`
- Request: `{ username, password, confirmPassword }`
- Response (201): `{ userId, username }`
- Error (400): Validation errors or duplicate username

---

## 5. Session Management Requirements

### REQ-FE-SESS-001: Current User Initialization

**Requirement:** The system shall attempt to restore user session from stored access token on application startup.

**Acceptance Criteria:**
- [ ] App component attempts session restoration on initialization
- [ ] Method retrieves stored access token from localStorage
- [ ] If token exists, app assumes user is authenticated
- [ ] Current user state is initialized from token or fetched from backend
- [ ] Failed initialization clears invalid tokens
- [ ] Current user observable is available app-wide

**Session Initialization:**

```typescript
ngOnInit() {
  this.tryToInitializeCurrentUser();
}

private tryToInitializeCurrentUser(): void {
  const accessToken = this._localStorageService.get({ key: accessTokenKey });

  if (accessToken) {
    // Token exists, restore session
    const currentUser = this._localStorageService.get({ key: currentUserKey });

    if (currentUser) {
      this._authService.setCurrentUser(currentUser);
    }
  }
}
```

---

### REQ-FE-SESS-002: Auto-Logout on Token Expiration

**Requirement:** The system shall automatically log out users when their JWT token expires (after 1 hour).

**Acceptance Criteria:**
- [ ] System detects 401 Unauthorized responses from API
- [ ] 401 errors first trigger token refresh attempt
- [ ] If refresh fails, tokens are cleared
- [ ] User is redirected to login page
- [ ] Current user state is cleared
- [ ] Attempted URL is saved for post-login redirection

---

## 6. Authorization & Access Control Requirements

### REQ-FE-AUTHZ-001: User Model with Roles

**Requirement:** The system shall maintain a user model that includes role information from backend authentication response.

**Acceptance Criteria:**
- [ ] User model includes userId property
- [ ] User model includes username property
- [ ] User model includes roles collection (string array)
- [ ] Model matches backend AuthenticateResponse structure
- [ ] Model supports serialization from API responses

**User Model:**

```typescript
interface User {
  userId: string;
  username: string;
  roles: string[];
}
```

**Note:** The backend returns roles as a string array in the authentication response. Privilege checking will need to be implemented when the backend adds privilege claims to JWT tokens.

---

### REQ-FE-AUTHZ-002: Role-Based UI Rendering

**Requirement:** The system shall conditionally render UI elements based on user roles.

**Acceptance Criteria:**
- [ ] Navigation menu items are conditionally displayed
- [ ] Menu visibility is controlled by role checks
- [ ] Users only see features they have permission to access
- [ ] UI updates reactively when user roles change

**Role-Based UI Examples:**

```html
<!-- Admin-only menu item -->
<a *ngIf="hasRole('SystemAdministrator')"
   routerLink="/workspace/admin">
  Administration
</a>

<!-- Check for specific role -->
<button *ngIf="currentUser$ | async as user">
  <span *ngIf="user.roles.includes('SystemAdministrator')">
    Admin Panel
  </span>
</button>
```

**Role Check Method:**

```typescript
export class AuthService {
  hasRole(roleName: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => user ? user.roles.includes(roleName) : false)
    );
  }
}
```

---

## 7. User Interface Requirements

### REQ-FE-UI-001: Login Component

**Requirement:** The system shall provide a login component with username and password inputs.

**Acceptance Criteria:**
- [ ] Component displays reactive form with username and password fields
- [ ] Component shows validation errors inline
- [ ] Component displays backend error messages (401, 400)
- [ ] Component has submit button disabled when form is invalid
- [ ] Component shows loading indicator during authentication

---

### REQ-FE-UI-002: Registration Component

**Requirement:** The system shall provide a registration component for new user account creation.

**Acceptance Criteria:**
- [ ] Component displays reactive form with username, password, confirmPassword fields
- [ ] Component shows validation errors inline
- [ ] Component displays backend error messages
- [ ] Component shows password strength indicator
- [ ] Component validates password confirmation matches
- [ ] Component shows success message before redirecting to login

---

### REQ-FE-UI-003: Protected Workspace Layout

**Requirement:** The system shall provide a workspace layout component for authenticated users.

**Acceptance Criteria:**
- [ ] Layout displays navigation menu
- [ ] Layout shows current user information
- [ ] Layout includes logout button
- [ ] Layout is only accessible to authenticated users
- [ ] Layout adapts navigation based on user roles

---

## 8. State Management Requirements

### REQ-FE-STATE-001: Authentication State Management

**Requirement:** The system shall manage authentication state using RxJS observables and services.

**Acceptance Criteria:**
- [ ] AuthService maintains currentUser$ observable
- [ ] State is persisted to localStorage
- [ ] State is reactive and updates UI automatically
- [ ] State is cleared on logout
- [ ] State includes user identity and roles

**State Management:**

```typescript
export class AuthService {
  private _currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUserSubject.asObservable();

  setCurrentUser(user: User): void {
    this._currentUserSubject.next(user);
    this._localStorageService.put({ key: currentUserKey, value: user });
  }

  clearCurrentUser(): void {
    this._currentUserSubject.next(null);
    this._localStorageService.put({ key: currentUserKey, value: null });
  }
}
```

---

### REQ-FE-STATE-002: Reactive State Patterns

**Requirement:** The system shall use reactive programming patterns with RxJS for state management.

**Acceptance Criteria:**
- [ ] Observables are used for asynchronous data streams
- [ ] BehaviorSubject is used for current user state
- [ ] Operators like map, switchMap, catchError are used appropriately
- [ ] Subscriptions are properly managed to prevent memory leaks
- [ ] Async pipe is used in templates for automatic subscription management

---

## 9. Validation Requirements

### REQ-FE-VAL-001: Login Form Validation

**Requirement:** The system shall validate login form inputs before submission.

**Acceptance Criteria:**
- [ ] Username field is required
- [ ] Password field is required
- [ ] Form submission is disabled when invalid
- [ ] Validation errors are displayed to user
- [ ] Validation is reactive (real-time feedback)

**Validation Rules:**

| Field | Validators | Error Messages |
|-------|-----------|----------------|
| username | Required | "Username is required" |
| password | Required | "Password is required" |

---

### REQ-FE-VAL-002: Registration Form Validation

**Requirement:** The system shall validate registration form inputs matching backend validation rules.

**Acceptance Criteria:**
- [ ] Username is required and 3-100 characters
- [ ] Username format is email
- [ ] Password is required and minimum 6 characters
- [ ] Password confirmation matches password
- [ ] Validation errors are displayed clearly
- [ ] Form submission is disabled when invalid

**Validation Rules:**

| Field | Validators | Error Messages |
|-------|-----------|----------------|
| username | Required, Email, Length(3-100) | "Username is required", "Must be valid email", "Must be 3-100 characters" |
| password | Required, MinLength(6) | "Password is required", "Password must be at least 6 characters" |
| confirmPassword | Required, MustMatch('password') | "Password confirmation is required", "Passwords must match" |

**Custom Validator for Password Match:**

```typescript
export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  };
}
```

---

## Appendix A: API Endpoints Used by Frontend

### Authentication Endpoints

| Method | Endpoint | Purpose | Request Body | Response |
|--------|----------|---------|--------------|----------|
| POST | /api/identity/authenticate | Login | `{ username, password }` | `{ userId, username, accessToken, refreshToken, roles }` |
| POST | /api/identity/register | Register | `{ username, password, confirmPassword }` | `{ userId, username }` |
| POST | /api/identity/refresh-token | Refresh Token | `{ refreshToken }` | `{ accessToken, refreshToken }` |

---

## Appendix B: LocalStorage Keys

| Key | Purpose | Data Type |
|-----|---------|-----------|
| eventmanagement:accessToken | JWT access token (expires 1 hour) | string |
| eventmanagement:refreshToken | Refresh token (rotates on refresh) | string |
| eventmanagement:currentUser | Current user object | User JSON |

---

## Appendix C: Component Architecture

### Core Services

- **AuthService**: Authentication, token management, current user state
- **LocalStorageService**: Browser storage management
- **NavigationService**: Routing and navigation

### HTTP Interceptors

- **HeadersInterceptor**: Adds JWT access token to requests
- **JwtInterceptor**: Handles 401 errors, token refresh, auto-logout

### Route Guards

- **AuthGuard**: Protects workspace routes, requires authentication

### Feature Components

#### Authentication
- LoginComponent
- RegisterComponent

#### Workspace
- WorkspaceLayoutComponent (protected, shows navigation and logout)

---

## Appendix D: Security Considerations

### Implemented Security Controls

1. **Token-Based Authentication**
   - JWT access tokens (1 hour expiration)
   - Refresh tokens (rotated on each refresh)
   - Tokens stored in localStorage
   - Tokens automatically included in API requests

2. **Token Refresh**
   - Automatic token refresh on 401 errors
   - Seamless user experience
   - Logout on refresh failure

3. **Route Protection**
   - AuthGuard prevents unauthorized access to workspace
   - Post-login redirection to attempted URL

4. **Input Validation**
   - Required field validation
   - Email format validation
   - Password length validation (minimum 6 characters)
   - Password confirmation matching
   - Matches backend validation rules

5. **Error Handling**
   - 401 errors trigger token refresh or logout
   - Invalid tokens are cleared automatically
   - User-friendly error messages

### Not Implemented (Future Enhancements)

1. Remember Me functionality
2. Multi-factor authentication (2FA/MFA)
3. Password reset via email
4. Email verification for registration
5. Granular privilege-based authorization (awaiting backend privilege claims in JWT)
6. User profile management
7. Role management UI
8. Account settings/preferences

---

## Appendix E: TypeScript Models Summary

### Authentication Models

```typescript
interface AuthenticateRequest {
  username: string;
  password: string;
}

interface AuthenticateResponse {
  userId: string;
  username: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}

interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}

interface RegisterResponse {
  userId: string;
  username: string;
}

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}
```

### User Models

```typescript
interface User {
  userId: string;
  username: string;
  roles: string[];
}
```

---

## Appendix F: Backend Alignment Summary

This frontend specification is aligned with the backend implementation as follows:

### ✅ Aligned Features

1. **Authentication Endpoints**
   - Login: `POST /api/identity/authenticate`
   - Register: `POST /api/identity/register`
   - Refresh Token: `POST /api/identity/refresh-token`

2. **Request/Response Models**
   - All DTOs match backend command/response structures
   - Validation rules match backend FluentValidation rules

3. **Token Management**
   - Access token (JWT, 1 hour expiration)
   - Refresh token (Base64, 32 bytes, rotated)
   - Bearer token authentication scheme

4. **Password Policy**
   - Minimum 6 characters
   - Password confirmation required
   - Username 3-100 characters

5. **Security**
   - CORS configured for localhost:4200
   - JWT Bearer authentication
   - Token refresh flow

### 📋 Removed from Original Frontend Spec

The following items were removed as they are **not implemented in the backend**:

1. ❌ Invitation token system
2. ❌ Profile management endpoints
3. ❌ User CRUD operations (create, update, delete users)
4. ❌ Role management endpoints
5. ❌ Privilege management endpoints
6. ❌ Password change endpoint
7. ❌ Current user endpoint (`/api/user/current`)
8. ❌ Username exists check endpoint
9. ❌ Granular privilege-based authorization with AccessRight enum
10. ❌ Profile-related features

### 🔮 Future Enhancements (When Backend Implements)

These features can be added to the frontend when the backend implements the corresponding endpoints:

1. User management UI (when backend adds user CRUD endpoints)
2. Role management UI (when backend adds role endpoints)
3. Privilege-based authorization (when backend adds privilege claims to JWT)
4. Profile management (when backend adds profile endpoints)
5. Password change functionality (when backend adds password change endpoint)
6. Current user info from API (when backend adds `/api/user/current` or includes in auth response)

---

**End of Document**
