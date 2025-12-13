# Carousel Component

A responsive, reusable carousel/slider component for displaying images with navigation controls.

## Features

- ✅ Responsive design (works on desktop, tablet, and mobile)
- ✅ Auto-play functionality with configurable interval
- ✅ Arrow buttons for manual navigation
- ✅ Indicator dots for visual feedback and direct navigation
- ✅ Slide counter display
- ✅ Smooth fade transitions
- ✅ Accessibility features (ARIA labels, keyboard support)
- ✅ Configurable styling and behavior
- ✅ Optional slide titles and descriptions with gradient overlay

## Installation

The carousel component is already exported in the components module:

```typescript
import { CarouselComponent } from '@app/components';
```

## Usage

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { CarouselComponent, CarouselItem } from '@app/components';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <zl-carousel [items]="carouselItems" [height]="'500px'"></zl-carousel>
  `,
})
export class ExampleComponent {
  carouselItems: CarouselItem[] = [
    {
      imageUrl: 'https://example.com/image1.jpg',
      alt: 'First Image',
      title: 'Slide 1',
      description: 'This is the first slide',
    },
    {
      imageUrl: 'https://example.com/image2.jpg',
      alt: 'Second Image',
      title: 'Slide 2',
      description: 'This is the second slide',
    },
    {
      imageUrl: 'https://example.com/image3.jpg',
      alt: 'Third Image',
      title: 'Slide 3',
      description: 'This is the third slide',
    },
  ];
}
```

### With Custom Configuration

```typescript
<zl-carousel 
  [items]="carouselItems"
  [autoPlay]="true"
  [autoPlayInterval]="4000"
  [showIndicators]="true"
  [height]="'600px'"
></zl-carousel>
```

## API

### Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `CarouselItem[]` | `[]` | Array of carousel items to display |
| `autoPlay` | `boolean` | `true` | Enable automatic slide advancement |
| `autoPlayInterval` | `number` | `5000` | Time in milliseconds between auto-play slides |
| `showIndicators` | `boolean` | `true` | Show/hide indicator dots |
| `height` | `string` | `'400px'` | CSS height of the carousel container |

### CarouselItem Interface

```typescript
interface CarouselItem {
  imageUrl: string;        // Required: URL of the image
  alt?: string;            // Optional: Alt text for accessibility
  title?: string;          // Optional: Title displayed on the slide
  description?: string;    // Optional: Description displayed on the slide
  [key: string]: any;      // Additional custom properties
}
```

### Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `nextSlide()` | - | Navigate to the next slide |
| `prevSlide()` | - | Navigate to the previous slide |
| `goToSlide(index: number)` | `index` | Navigate to a specific slide by index |
| `getCurrentItem()` | - | Get the current carousel item |

## Styling

The component uses SCSS with the following customizable variables:

```scss
$primary-color: #ff4500;      // Primary color for buttons and indicators
$dark-bg: #1a1a1a;           // Background color
$light-text: #ffffff;         // Text color
$transition-speed: 0.5s;      // Slide transition duration
$border-radius: 8px;          // Border radius for the container
```

To override these variables, import the component with custom styles:

```scss
$primary-color: #1e90ff;
@import '@app/components/carousel/carousel.component.scss';
```

## Responsiveness

The carousel is fully responsive with breakpoints for:
- **Desktop**: Full size controls
- **Tablet** (≤768px): Slightly smaller controls
- **Mobile** (≤480px): Compact controls and spacing

### Responsive Behavior

- Arrow buttons scale from 50px → 40px → 36px
- Indicator dots scale from 12px → 10px
- Font sizes adjust for readability on smaller screens
- Spacing and padding optimize for mobile devices
- Respects `prefers-reduced-motion` for accessibility

## Keyboard Navigation

- **Previous Slide**: Click the left arrow or use previous slide button
- **Next Slide**: Click the right arrow or use next slide button
- **Jump to Slide**: Click any indicator dot
- All buttons have focus states for keyboard accessibility

## Accessibility

- ✅ Semantic HTML with proper `<button>` elements
- ✅ ARIA labels on all interactive elements
- ✅ Alt text for all images
- ✅ Focus indicators for keyboard navigation
- ✅ Respects `prefers-reduced-motion` media query
- ✅ Proper contrast ratios for WCAG compliance

## Testing

The component includes comprehensive unit tests covering:

- Component initialization
- Navigation (next, previous, goto)
- Auto-play functionality
- Template rendering
- User interactions
- Responsive behavior
- Accessibility features
- Edge cases

Run tests with:

```bash
ng test
```

## Example: Real Estate Carousel

```typescript
@Component({
  selector: 'app-property-carousel',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <zl-carousel 
      [items]="propertyImages"
      [height]="'500px'"
      [autoPlay]="true"
      [autoPlayInterval]="6000"
    ></zl-carousel>
  `,
})
export class PropertyCarouselComponent {
  propertyImages: CarouselItem[] = [
    {
      imageUrl: '/assets/property-1.jpg',
      alt: 'Living Room',
      title: 'Modern Living Room',
      description: 'Spacious living area with natural light',
    },
    {
      imageUrl: '/assets/property-2.jpg',
      alt: 'Kitchen',
      title: 'Updated Kitchen',
      description: 'Fully renovated with stainless steel appliances',
    },
    {
      imageUrl: '/assets/property-3.jpg',
      alt: 'Backyard',
      title: 'Private Backyard',
      description: 'Large deck perfect for entertaining',
    },
  ];
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Optimized fade transitions using CSS
- No unnecessary re-renders with OnPush change detection
- Auto-play can be disabled for better performance
- Images can be lazy-loaded by the parent component

## License

Copyright (c) 2025. All Rights Reserved.
