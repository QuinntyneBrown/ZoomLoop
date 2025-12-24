# ZoomLoop Web Application

ZoomLoop is an Angular-based web application built with Angular 21 and Angular Material. This workspace contains both the main application and a reusable component library.

## Project Structure

This Angular workspace contains two projects:

- **zoom-loop** - Main web application
- **zoom-loop-components** - Reusable component library with Storybook integration

## Prerequisites

- Node.js (npm 10.9.4 or later)
- Angular CLI 21.0.4

## Getting Started

### Installation

```bash
npm install
```

### Development Server

To start the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you modify source files.

## Available Scripts

### Application Development

- `npm start` - Start development server
- `npm run build` - Build the application for production
- `npm run watch` - Build in watch mode for development
- `npm test` - Run unit tests with Vitest
- `npm run e2e` - Run end-to-end tests with Playwright

### Component Library

- `npm run storybook` - Start Storybook for component development
- `npm run build-storybook` - Build Storybook for deployment

## Technology Stack

### Core Framework
- Angular 21.0
- TypeScript 5.9
- RxJS 7.8

### UI Components
- Angular Material 21.0
- Angular CDK 21.0

### Testing
- Vitest 4.0 - Unit testing
- Playwright 1.57 - End-to-end testing
- JSDOM 27.1 - DOM manipulation and testing

### Development Tools
- Storybook 10.1 - Component development and documentation
- ng-packagr 21.0 - Library packaging

## Development Workflows

### Creating Components

For the main application:
```bash
ng generate component component-name --project=zoom-loop
```

For the component library:
```bash
ng generate component component-name --project=zoom-loop-components
```

### Building for Production

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.

### Running Tests

**Unit tests:**
```bash
npm test
```

**E2E tests:**
```bash
npm run e2e
```

### Component Development with Storybook

Start Storybook to develop and test components in isolation:

```bash
npm run storybook
```

Storybook will be available at `http://localhost:6006/`.

## Code Style

This project uses Prettier for code formatting with the following configuration:
- Print width: 100 characters
- Single quotes
- Angular parser for HTML files

## Additional Resources

- [Angular Documentation](https://angular.dev)
- [Angular Material Documentation](https://material.angular.io)
- [Storybook Documentation](https://storybook.js.org)
- [Vitest Documentation](https://vitest.dev)
- [Playwright Documentation](https://playwright.dev)
