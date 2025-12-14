# Backend API Configuration

## Overview

The ZoomLoop frontend application has been configured to communicate with a backend API using a centralized configuration system. This allows for easy management of the API base URL across different environments.

## Configuration Files

### Environment Files

Two environment files have been created in `src/environments/`:

1. **environment.development.ts** - Used during development
   ```typescript
   export const environment = {
     production: false,
     apiBaseUrl: 'https://localhost:7217'
   };
   ```

2. **environment.ts** - Used for production builds
   ```typescript
   export const environment = {
     production: true,
     apiBaseUrl: ''
   };
   ```

### Build Configuration

The `angular.json` file has been updated with `fileReplacements` to automatically use the correct environment file based on the build configuration:

- Development builds use `environment.development.ts`
- Production builds use `environment.ts`

## How It Works

### API Base URL Interceptor

A custom HTTP interceptor (`ApiBaseUrlInterceptor`) has been implemented that:

1. Intercepts all HTTP requests
2. Checks if the request URL starts with `/api/`
3. If yes, prepends the `apiBaseUrl` from the environment configuration
4. Passes through all other requests unchanged

Example:
- Original request: `GET /api/user/current`
- Modified request: `GET https://localhost:7217/api/user/current`

### Interceptor Order

The interceptors are registered in this order in `app.config.ts`:

1. **ApiBaseUrlInterceptor** - Prepends base URL
2. **HeadersInterceptor** - Adds Authorization header
3. **JwtInterceptor** - Handles 401 errors

This order ensures the base URL is prepended before any headers are added.

## Usage in Code

Services can continue to use relative URLs for API calls:

```typescript
// auth.service.ts
this._httpClient.post('/api/user/token', options)  // Works automatically

// vehicle-create.ts
this._http.post('/api/vehicle', { vehicle })  // Works automatically
```

The interceptor handles the base URL prepending transparently.

## Testing

### Unit Tests

Unit tests mock HTTP requests and are not affected by the interceptor. The `HttpClientTestingModule` works as before.

### E2E Tests

E2E tests use Playwright's `page.route()` to mock API responses. These continue to work because they intercept at the browser level using pattern matching (`**/api/user/token`).

### Interceptor Tests

Dedicated unit tests for the interceptor verify:
- API requests get the base URL prepended
- Non-API requests are not modified
- POST requests with payloads work correctly

## Changing the Backend URL

To change the backend URL for development:

1. Open `src/environments/environment.development.ts`
2. Update the `apiBaseUrl` property
3. Restart the development server (`ng serve`)

For production deployments, update `src/environments/environment.ts` or use environment variables through your deployment process.
