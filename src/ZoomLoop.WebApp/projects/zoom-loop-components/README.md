# ZoomLoop Components

A comprehensive Angular component library for the ZoomLoop automotive marketplace platform. This library provides reusable UI components designed for vehicle listings, search, financing, and user interactions.

## Features

- **Modern Angular Components**: Built with Angular 21.0.0
- **Storybook Integration**: Visual component development and documentation
- **TypeScript Support**: Full type safety and IntelliSense support
- **Responsive Design**: Mobile-first, responsive components
- **Standalone Components**: Leveraging Angular's modern standalone component architecture

## Components

### Layout Components
- **Header** - Application header with navigation and user menu
- **Footer** - Application footer with links and information
- **Hero** - Landing page hero section with call-to-action

### Vehicle Components
- **VehicleCard** - Display vehicle information in card format
- **VehicleMasterDetail** - Master-detail view for vehicle browsing
- **Vehicles** - Vehicle listing grid/list view
- **VehicleIngestionDialog** - Dialog for uploading and processing vehicle information
- **ImageGallery** - Image carousel/gallery for vehicle photos

### Search & Filter Components
- **SearchBar** - Vehicle search input with suggestions
- **FilterSidebar** - Advanced filtering options for vehicle search

### Form Components
- **Input** - Styled form input component
- **Button** - Customizable button component
- **Modal** - Reusable modal/dialog component

### Feature Components
- **FinanceCalculator** - Calculate monthly payments and financing options
- **LoginDialog** - User authentication dialog
- **MyProfile** - User profile management component
- **Toast** - Notification/toast messages
- **Badge** - Status and information badges
- **TrustBadges** - Trust and security indicators
- **HowItWorks** - Informational section explaining the platform

## Installation

Install the package in your Angular project:

```bash
npm install zoom-loop-components
```

## Usage

Import individual components in your Angular application:

```typescript
import { ButtonComponent } from 'zoom-loop-components';
import { VehicleCardComponent } from 'zoom-loop-components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ButtonComponent, VehicleCardComponent],
  template: `
    <zoom-loop-button>Click Me</zoom-loop-button>
    <zoom-loop-vehicle-card [vehicle]="vehicleData"></zoom-loop-vehicle-card>
  `
})
export class ExampleComponent {
  // Component logic
}
```

## Development

### Building the Library

To build the component library:

```bash
npm run build:zoom-loop-components
```

Or using Angular CLI directly:

```bash
ng build zoom-loop-components
```

Build artifacts will be placed in the `dist/zoom-loop-components/` directory.

### Running Storybook

View and develop components interactively with Storybook:

```bash
npm run storybook:zoom-loop-components
```

This will start Storybook on `http://localhost:6006` where you can browse all components with interactive examples.

### Building Storybook

To build a static Storybook for deployment:

```bash
npm run build-storybook:zoom-loop-components
```

### Running Tests

Execute unit tests with Karma:

```bash
ng test zoom-loop-components
```

## Project Structure

```
zoom-loop-components/
├── src/
│   ├── lib/
│   │   ├── badge/
│   │   ├── button/
│   │   ├── filter-sidebar/
│   │   ├── finance-calculator/
│   │   ├── footer/
│   │   ├── header/
│   │   ├── hero/
│   │   ├── how-it-works/
│   │   ├── image-gallery/
│   │   ├── input/
│   │   ├── login-dialog/
│   │   ├── modal/
│   │   ├── my-profile/
│   │   ├── search-bar/
│   │   ├── toast/
│   │   ├── trust-badges/
│   │   ├── vehicle-card/
│   │   ├── vehicle-ingestion-dialog/
│   │   ├── vehicle-master-detail/
│   │   └── vehicles/
│   └── styles/
├── .storybook/
└── README.md
```

## Publishing

To publish the library to npm:

1. Build the library:
   ```bash
   ng build zoom-loop-components
   ```

2. Navigate to the dist directory:
   ```bash
   cd dist/zoom-loop-components
   ```

3. Publish to npm:
   ```bash
   npm publish
   ```

## Requirements

- Angular: ^21.0.0
- TypeScript: Compatible with Angular 21
- Node.js: LTS version recommended

## License

Copyright (c) Quinntyne Brown. All Rights Reserved.

Licensed under the MIT License. See License.txt in the project root for license information.

## Contributing

This library is part of the ZoomLoop platform. For questions or contributions, please refer to the main project documentation.

## Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Storybook Documentation](https://storybook.js.org/)
- [Angular Component Library Guide](https://angular.dev/tools/libraries)
