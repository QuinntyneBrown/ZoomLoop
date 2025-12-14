# ZoomLoopApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.0.3.

## Configuration

### Backend API URL

The application is configured to communicate with a backend API. The API base URL is managed through environment configuration files:

- **Development**: `src/environments/environment.development.ts` - configured to use `https://localhost:7217`
- **Production**: `src/environments/environment.ts` - configured to use relative URLs (empty string)

To change the backend URL for development:

1. Open `src/environments/environment.development.ts`
2. Update the `apiBaseUrl` property to your desired backend URL

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:7217'  // Change this to your backend URL
};
```

The `ApiBaseUrlInterceptor` automatically prepends this base URL to all API requests that start with `/api/`.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
