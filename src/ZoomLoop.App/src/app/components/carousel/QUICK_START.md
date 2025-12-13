# Quick Start Guide - Carousel Component

## Import the Component

```typescript
import { CarouselComponent } from '@app/components';
```

## Basic Usage

```typescript
import { Component } from '@angular/core';
import { CarouselComponent, CarouselItem } from '@app/components';

@Component({
  selector: 'app-my-carousel',
  standalone: true,
  imports: [CarouselComponent],
  template: `<zl-carousel [items]="items"></zl-carousel>`,
})
export class MyCarouselComponent {
  items: CarouselItem[] = [
    {
      imageUrl: 'https://example.com/image1.jpg',
      alt: 'First image',
      title: 'Title 1',
      description: 'Description 1'
    },
    {
      imageUrl: 'https://example.com/image2.jpg',
      alt: 'Second image',
      title: 'Title 2',
      description: 'Description 2'
    },
  ];
}
```

## Common Configurations

### Disable Auto-Play
```html
<zl-carousel [items]="items" [autoPlay]="false"></zl-carousel>
```

### Change Height
```html
<zl-carousel [items]="items" [height]="'500px'"></zl-carousel>
```

### Adjust Auto-Play Speed
```html
<zl-carousel [items]="items" [autoPlayInterval]="3000"></zl-carousel>
```

### Hide Indicator Dots
```html
<zl-carousel [items]="items" [showIndicators]="false"></zl-carousel>
```

### Combine Multiple Options
```html
<zl-carousel 
  [items]="items"
  [autoPlay]="true"
  [autoPlayInterval]="4000"
  [height]="'600px'"
  [showIndicators]="true"
></zl-carousel>
```

## Files Included

| File | Purpose |
|------|---------|
| `carousel.component.ts` | Component logic and interface |
| `carousel.component.html` | Template structure |
| `carousel.component.scss` | Responsive styles |
| `carousel.component.spec.ts` | 51 unit tests |
| `carousel.example.ts` | Usage examples |
| `README.md` | Full documentation |
| `IMPLEMENTATION_SUMMARY.md` | Implementation details |

## Test Coverage

Run tests with:
```bash
ng test
```

Tests verify:
- ✅ Navigation (next, prev, goto)
- ✅ Auto-play functionality  
- ✅ Template rendering
- ✅ User interactions
- ✅ Responsive behavior
- ✅ Accessibility features
- ✅ Edge cases

## Key Features

- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with ARIA labels
- **Customizable**: All properties are configurable
- **Auto-play**: Automatic slide advancement with optional timer reset
- **Manual Controls**: Arrow buttons and indicator dots
- **Content Overlays**: Support for titles and descriptions

## Location

The carousel component is located at:
```
src/app/components/carousel/
```

And exported from:
```
src/app/components/index.ts
```

## Design Colors

- **Primary**: #ff4500 (Orange) - Buttons and active states
- **Background**: #1a1a1a (Dark) - Container background
- **Text**: #ffffff (White) - Text color

To customize, override SCSS variables in your component styles.

## Troubleshooting

### Items not showing?
- Check that `items` array is populated
- Verify `imageUrl` paths are correct

### Navigation not working?
- Check `autoPlay` setting - may need to be `false`
- Verify items array has more than one item

### Styles not applying?
- Ensure CommonModule is imported (it's already in the component)
- Check that SCSS variables are properly scoped

## Performance Tips

- Set `[autoPlay]="false"` if not needed
- Use optimized images or lazy-loading
- Consider virtualizing for very large item lists
- Use `OnPush` change detection in parent component

## Browser Support

- Chrome, Firefox, Safari, Edge (latest)
- iOS Safari, Chrome Android
- Requires ES2020+ JavaScript support

For additional help, see the full [README.md](README.md) documentation.
