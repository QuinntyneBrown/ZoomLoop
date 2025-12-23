# ZoomLoop Design Tokens

This directory contains the centralized design token system for the zoom-loop-components library. Design tokens provide a consistent, maintainable way to manage design decisions across all components.

## Table of Contents

- [Overview](#overview)
- [Files](#files)
- [Usage](#usage)
- [Color Tokens](#color-tokens)
- [Spacing Tokens](#spacing-tokens)
- [Typography Tokens](#typography-tokens)
- [Other Tokens](#other-tokens)
- [Mixins](#mixins)
- [Best Practices](#best-practices)

## Overview

Design tokens are the single source of truth for design decisions in the component library. They ensure:

- **Consistency**: All components use the same color palette, spacing, and typography
- **Maintainability**: Update styles globally by changing token values
- **Theming**: Easy theme customization through CSS custom properties
- **Scalability**: Add new components without duplicating values

## Files

```
styles/
├── _tokens.scss      # Core design tokens (colors, spacing, typography, etc.)
├── _mixins.scss      # Reusable SCSS mixins and utilities
├── _index.scss       # Main entry point (imports tokens and mixins)
└── README.md         # This documentation
```

## Usage

### Importing Design Tokens

Import the design tokens at the top of your component SCSS file:

```scss
@import '../styles/index';

.my-component {
  color: $color-primary;
  padding: $spacing-4;
  font-size: $font-size-base;
}
```

### Using CSS Custom Properties

CSS custom properties are available for runtime theming:

```css
.my-element {
  color: var(--zl-color-primary);
  padding: var(--zl-spacing-4);
}
```

## Color Tokens

### Primary Colors (Blue)

Used for primary actions, links, and brand elements.

```scss
$color-primary-50: #eff6ff;   // Lightest
$color-primary-100: #dbeafe;
$color-primary-500: #3b82f6;
$color-primary-800: #1e40af;  // Default primary
$color-primary-900: #1e3a8a;  // Darkest

// Semantic tokens
$color-primary: $color-primary-800;
$color-primary-hover: $color-primary-600;
$color-primary-active: $color-primary-900;
$color-primary-light: $color-primary-50;
```

### Success Colors (Green)

Used for success states, positive feedback, and confirmations.

```scss
$color-success-50: #f0fdf4;
$color-success-500: #22c55e;  // Default success
$color-success-800: #166534;

// Semantic tokens
$color-success: $color-success-500;
$color-success-hover: $color-success-600;
```

### Warning Colors (Amber/Orange)

Used for warnings and cautionary messages.

```scss
$color-warning-50: #fffbeb;
$color-warning-500: #f59e0b;  // Default warning
$color-warning-800: #92400e;

// Semantic tokens
$color-warning: $color-warning-500;
```

### Error/Danger Colors (Red)

Used for errors, destructive actions, and critical alerts.

```scss
$color-error-50: #fef2f2;
$color-error-500: #ef4444;
$color-error-600: #dc2626;    // Default danger
$color-error-800: #991b1b;

// Semantic tokens
$color-danger: $color-error-600;
$color-danger-hover: $color-error-700;
```

### Neutral Colors (Gray)

Used for text, borders, backgrounds, and UI elements.

```scss
$color-neutral-50: #f9fafb;   // Lightest background
$color-neutral-100: #f3f4f6;  // Light background
$color-neutral-200: #e5e7eb;  // Border light
$color-neutral-300: #d1d5db;  // Border
$color-neutral-500: #6b7280;  // Secondary text
$color-neutral-700: #374151;  // Body text
$color-neutral-900: #111827;  // Heading text
```

### Semantic Color Tokens

Use semantic tokens for better readability and intent:

```scss
// Text colors
$color-text-primary: $color-neutral-900;     // Main text
$color-text-secondary: $color-neutral-600;   // Secondary text
$color-text-muted: $color-neutral-400;       // Muted/disabled text
$color-text-inverse: $color-white;           // Text on dark backgrounds

// Background colors
$color-bg-primary: $color-white;             // Primary background
$color-bg-secondary: $color-neutral-50;      // Secondary background
$color-bg-tertiary: $color-neutral-100;      // Tertiary background
$color-bg-dark: $color-slate-900;            // Dark background

// Border colors
$color-border-primary: $color-neutral-200;   // Default border
$color-border-secondary: $color-neutral-300; // Emphasized border
$color-border-focus: $color-primary;         // Focus state border
$color-border-error: $color-error-500;       // Error state border
```

## Spacing Tokens

Consistent spacing scale based on 4px increments:

```scss
$spacing-0: 0;          // 0px
$spacing-1: 0.25rem;    // 4px
$spacing-2: 0.5rem;     // 8px
$spacing-3: 0.75rem;    // 12px
$spacing-4: 1rem;       // 16px
$spacing-5: 1.25rem;    // 20px
$spacing-6: 1.5rem;     // 24px
$spacing-8: 2rem;       // 32px
$spacing-10: 2.5rem;    // 40px
$spacing-12: 3rem;      // 48px
$spacing-16: 4rem;      // 64px
$spacing-20: 5rem;      // 80px
```

### Usage Examples

```scss
.component {
  padding: $spacing-4;           // 16px
  margin-bottom: $spacing-6;     // 24px
  gap: $spacing-2;               // 8px
}
```

## Typography Tokens

### Font Families

```scss
$font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-family-mono: 'Fira Code', 'Consolas', monospace;
```

### Font Sizes

```scss
$font-size-xs: 0.75rem;    // 12px
$font-size-sm: 0.875rem;   // 14px
$font-size-base: 1rem;     // 16px
$font-size-lg: 1.125rem;   // 18px
$font-size-xl: 1.25rem;    // 20px
$font-size-2xl: 1.5rem;    // 24px
$font-size-3xl: 1.875rem;  // 30px
$font-size-4xl: 2.25rem;   // 36px
$font-size-5xl: 3rem;      // 48px
```

### Font Weights

```scss
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

### Line Heights

```scss
$line-height-tight: 1.25;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;
```

### Typography Usage Example

```scss
.heading {
  font-family: $font-family-primary;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
}

.body-text {
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-normal;
}
```

## Other Tokens

### Border Radius

```scss
$radius-none: 0;
$radius-sm: 0.25rem;      // 4px
$radius-base: 0.375rem;   // 6px
$radius-md: 0.5rem;       // 8px
$radius-lg: 0.75rem;      // 12px
$radius-xl: 1rem;         // 16px
$radius-full: 9999px;     // Pill/circular
```

### Shadows

```scss
$shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
$shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);

// Focus ring shadows
$shadow-focus-primary: 0 0 0 3px rgba(30, 64, 175, 0.1);
$shadow-focus-success: 0 0 0 3px rgba(34, 197, 94, 0.1);
$shadow-focus-danger: 0 0 0 3px rgba(220, 38, 38, 0.1);
```

### Transitions

```scss
$transition-fast: 150ms ease-out;
$transition-base: 200ms ease-out;
$transition-slow: 300ms ease-out;
```

### Z-Index

```scss
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-tooltip: 1070;
```

### Breakpoints

```scss
$breakpoint-sm: 640px;
$breakpoint-md: 768px;
$breakpoint-lg: 1024px;
$breakpoint-xl: 1280px;
$breakpoint-2xl: 1536px;
```

## Mixins

The `_mixins.scss` file provides reusable utilities:

### Focus Ring Mixins

```scss
// Apply focus ring
@include focus-ring-primary;
@include focus-ring-success;
@include focus-ring-warning;
@include focus-ring-danger;

// Custom focus ring
@include focus-ring($color-primary);
```

### Button Variant Mixins

```scss
// Solid button
@include button-variant($bg-color, $hover-color, $active-color, $text-color);

// Outline button
@include button-outline-variant($color, $hover-bg, $active-bg);
```

### Badge Variant Mixin

```scss
@include badge-variant($bg-color, $text-color, $border-color);
```

### Layout Mixins

```scss
// Flexbox utilities
@include flex-center;        // Center items horizontally and vertically
@include flex-between;       // Space between with center alignment
@include flex-column;        // Flex column

// Card styles
@include card;               // Basic card with border and shadow
@include card-hover;         // Hoverable card with lift effect
```

### Text Utilities

```scss
@include truncate;           // Truncate text with ellipsis
@include line-clamp(2);      // Limit text to N lines
```

### Responsive Breakpoints

```scss
// Min-width breakpoints
@include sm { }   // >= 640px
@include md { }   // >= 768px
@include lg { }   // >= 1024px
@include xl { }   // >= 1280px

// Max-width breakpoints
@include max-sm { }  // < 640px
@include max-md { }  // < 768px
@include max-lg { }  // < 1024px
```

### Animation Mixins

```scss
@include fade-in;
@include slide-up;
@include hover-lift;         // Lift element on hover
@include spinner(16px, $color-primary);
```

### Accessibility

```scss
@include visually-hidden;    // Hide visually but keep accessible
@include focus-visible { }   // Style only keyboard focus
@include reduced-motion;     // Respect prefers-reduced-motion
```

## Best Practices

### 1. Always Use Design Tokens

❌ **Don't:**
```scss
.button {
  background: #1E40AF;
  padding: 16px;
  font-size: 14px;
}
```

✅ **Do:**
```scss
.button {
  background: $color-primary;
  padding: $spacing-4;
  font-size: $font-size-sm;
}
```

### 2. Use Semantic Tokens

❌ **Don't:**
```scss
.text {
  color: $color-neutral-900;
}
```

✅ **Do:**
```scss
.text {
  color: $color-text-primary;
}
```

### 3. Leverage Mixins

❌ **Don't:**
```scss
.button {
  display: flex;
  align-items: center;
  justify-content: center;
}
```

✅ **Do:**
```scss
.button {
  @include flex-center;
}
```

### 4. Use Responsive Mixins

❌ **Don't:**
```scss
@media (max-width: 768px) {
  .component { }
}
```

✅ **Do:**
```scss
@include max-md {
  .component { }
}
```

### 5. Component Variants with Mixins

✅ **Best Practice:**
```scss
.badge {
  &--primary {
    @include badge-variant($color-primary, $color-white);
  }

  &--success {
    @include badge-variant($color-success-100, $color-success-800);
  }
}
```

## Theming

CSS custom properties allow runtime theming:

```css
/* Override theme at runtime */
:root {
  --zl-color-primary: #6366f1;
  --zl-color-primary-hover: #4f46e5;
}

/* Dark theme example */
[data-theme="dark"] {
  --zl-color-bg-primary: #111827;
  --zl-color-text-primary: #f9fafb;
}
```

## Migration Guide

To migrate an existing component to use design tokens:

1. **Import the tokens:**
   ```scss
   @import '../styles/index';
   ```

2. **Replace hardcoded colors:**
   - Find: `#1E40AF` → Replace: `$color-primary`
   - Find: `#FFFFFF` → Replace: `$color-white`
   - Find: `#374151` → Replace: `$color-neutral-700` or `$color-text-primary`

3. **Replace spacing values:**
   - Find: `16px` → Replace: `$spacing-4`
   - Find: `8px` → Replace: `$spacing-2`

4. **Replace typography:**
   - Find: `'Inter', sans-serif` → Replace: `$font-family-primary`
   - Find: `14px` → Replace: `$font-size-sm`
   - Find: `font-weight: 600` → Replace: `$font-weight-semibold`

5. **Use mixins for common patterns:**
   - Replace focus states with `@include focus-ring-primary`
   - Replace button variants with `@include button-variant()`

## Examples

See the following components for reference implementations:

- [badge.component.scss](../badge/badge.component.scss) - Badge variants with design tokens
- [button.component.scss](../button/button.component.scss) - Button variants and sizes
- [input.component.scss](../input/input.component.scss) - Form input with states
- [toast.component.scss](../toast/toast.component.scss) - Toast notification types
- [trust-badges.component.scss](../trust-badges/trust-badges.component.scss) - Responsive layout

---

For questions or contributions, please refer to the main project documentation.
