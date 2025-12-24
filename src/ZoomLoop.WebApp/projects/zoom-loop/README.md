# ZoomLoop Application

The main ZoomLoop Angular application providing the core user interface and functionality.

## Overview

This is the primary application project within the ZoomLoop workspace. It's built using Angular 21 with standalone components, Angular Material UI, and follows modern Angular best practices.

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── guards/         # Route guards for authentication and authorization
│   ├── models/         # TypeScript interfaces and types
│   ├── pages/          # Page-level components (routes)
│   ├── services/       # Business logic and API services
│   ├── app.config.ts   # Application configuration
│   ├── app.routes.ts   # Application routing configuration
│   └── app.ts          # Root application component
├── e2e/                # End-to-end tests
├── environments/       # Environment-specific configurations
├── index.html          # Main HTML file
├── main.ts             # Application entry point
└── styles.scss         # Global styles
```

## Key Features

- **Standalone Components**: Built with Angular's standalone component architecture
- **Angular Material**: Comprehensive Material Design UI components
- **Routing**: Client-side routing with guards for protected routes
- **Type Safety**: Full TypeScript integration with strict type checking
- **Responsive Design**: Mobile-first responsive layouts using SCSS
- **E2E Testing**: Playwright-based end-to-end testing

## Development

### Running the Application

From the workspace root:

```bash
npm start
```

Or specifically target this project:

```bash
ng serve zoom-loop
```

The application will be available at `http://localhost:4200/`.

### Building

Development build:
```bash
ng build zoom-loop --configuration=development
```

Production build:
```bash
ng build zoom-loop --configuration=production
```

### Testing

**Unit Tests:**
```bash
ng test zoom-loop
```

**E2E Tests:**
```bash
npm run e2e
```

E2E tests are configured in `playwright.config.ts` and run using Playwright.

## Code Generation

Generate new components:
```bash
ng generate component components/component-name --project=zoom-loop
```

Generate a new service:
```bash
ng generate service services/service-name --project=zoom-loop
```

Generate a new guard:
```bash
ng generate guard guards/guard-name --project=zoom-loop
```

## Configuration

### TypeScript

TypeScript configuration is in `tsconfig.app.json` and extends the workspace configuration.

### Styles

- **Style Language**: SCSS
- **Global Styles**: `src/styles.scss`
- **Style Preprocessor**: Includes paths from `zoom-loop-components` library

### Environment Files

Environment-specific configurations are stored in the `environments/` directory.

## Architecture

### Routing

Routes are defined in `app.routes.ts` using Angular's functional routing API.

### State Management

The application uses Angular services with RxJS for state management and reactive data flow.

### Authentication

Authentication logic is handled through:
- Route guards in the `guards/` directory
- Authentication services in the `services/` directory
- Auth models in the `models/` directory

## Build Configuration

### Production Build

- **Output Hashing**: All files are hashed for cache busting
- **Budgets**:
  - Initial bundle: 500kB warning, 1MB error
  - Component styles: 4kB warning, 8kB error
- **Optimization**: Full optimization enabled

### Development Build

- **Optimization**: Disabled for faster builds
- **Source Maps**: Enabled for debugging
- **License Extraction**: Disabled

## Dependencies

This project relies on:
- **zoom-loop-components**: Internal component library
- **Angular Material**: UI component framework
- **RxJS**: Reactive programming library

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **Services**: Use services for business logic and API calls
3. **Models**: Define TypeScript interfaces for all data structures
4. **Guards**: Protect routes that require authentication
5. **Lazy Loading**: Consider lazy loading for feature modules
6. **SCSS**: Use component-scoped styles, global styles only when necessary

## Related Documentation

- [Workspace README](../../README.md)
- [Angular Style Guide](https://angular.dev/style-guide)
- [Angular Material Components](https://material.angular.io/components)
