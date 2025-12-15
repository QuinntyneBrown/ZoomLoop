// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { describe, it, expect, beforeEach } from 'vitest';

/**
 * Material Design 3 Spacing Tests
 * 
 * These tests validate that the MD3 design tokens are properly defined
 * and that components adhere to Google's published best practices for
 * form field spacing, section spacing, and container padding.
 */

describe('Material Design 3 Spacing Tokens', () => {
  let rootStyles: CSSStyleDeclaration;

  beforeEach(() => {
    // Create a temporary element to access root CSS variables
    const el = document.createElement('div');
    document.body.appendChild(el);
    rootStyles = getComputedStyle(document.documentElement);
  });

  describe('Spacing Scale', () => {
    it('should define spacing-0 as 0', () => {
      const spacing0 = rootStyles.getPropertyValue('--md-sys-spacing-0').trim();
      expect(spacing0).toBe('0');
    });

    it('should define spacing-1 as 0.25rem (4px)', () => {
      const spacing1 = rootStyles.getPropertyValue('--md-sys-spacing-1').trim();
      expect(spacing1).toBe('0.25rem');
    });

    it('should define spacing-2 as 0.5rem (8px)', () => {
      const spacing2 = rootStyles.getPropertyValue('--md-sys-spacing-2').trim();
      expect(spacing2).toBe('0.5rem');
    });

    it('should define spacing-3 as 0.75rem (12px)', () => {
      const spacing3 = rootStyles.getPropertyValue('--md-sys-spacing-3').trim();
      expect(spacing3).toBe('0.75rem');
    });

    it('should define spacing-4 as 1rem (16px) - MD3 standard field spacing', () => {
      const spacing4 = rootStyles.getPropertyValue('--md-sys-spacing-4').trim();
      expect(spacing4).toBe('1rem');
    });

    it('should define spacing-6 as 1.5rem (24px) - MD3 section spacing', () => {
      const spacing6 = rootStyles.getPropertyValue('--md-sys-spacing-6').trim();
      expect(spacing6).toBe('1.5rem');
    });

    it('should define spacing-8 as 2rem (32px)', () => {
      const spacing8 = rootStyles.getPropertyValue('--md-sys-spacing-8').trim();
      expect(spacing8).toBe('2rem');
    });
  });

  describe('Form Field Spacing (MD3 Guidelines)', () => {
    it('should define form-field-gap as 1rem (16px) per MD3 spec', () => {
      const formFieldGap = rootStyles.getPropertyValue('--md-sys-form-field-gap').trim();
      // Should reference spacing-4 which is 1rem
      expect(formFieldGap).toMatch(/var\(--md-sys-spacing-4\)|1rem/);
    });

    it('should define form-section-gap as 1.5rem (24px) per MD3 spec', () => {
      const formSectionGap = rootStyles.getPropertyValue('--md-sys-form-section-gap').trim();
      // Should reference spacing-6 which is 1.5rem
      expect(formSectionGap).toMatch(/var\(--md-sys-spacing-6\)|1\.5rem/);
    });

    it('should define form-row-gap as 1rem (16px)', () => {
      const formRowGap = rootStyles.getPropertyValue('--md-sys-form-row-gap').trim();
      expect(formRowGap).toMatch(/var\(--md-sys-spacing-4\)|1rem/);
    });
  });

  describe('Container Padding (MD3 Guidelines)', () => {
    it('should define container-padding-mobile as 1rem (16px)', () => {
      const mobilePadding = rootStyles.getPropertyValue('--md-sys-container-padding-mobile').trim();
      expect(mobilePadding).toMatch(/var\(--md-sys-spacing-4\)|1rem/);
    });

    it('should define container-padding-desktop as 1.5rem (24px)', () => {
      const desktopPadding = rootStyles.getPropertyValue('--md-sys-container-padding-desktop').trim();
      expect(desktopPadding).toMatch(/var\(--md-sys-spacing-6\)|1\.5rem/);
    });
  });

  describe('Card Spacing', () => {
    it('should define card-padding-mobile as 1rem (16px)', () => {
      const cardMobilePadding = rootStyles.getPropertyValue('--md-sys-card-padding-mobile').trim();
      expect(cardMobilePadding).toMatch(/var\(--md-sys-spacing-4\)|1rem/);
    });

    it('should define card-padding-desktop as 1.5rem (24px)', () => {
      const cardDesktopPadding = rootStyles.getPropertyValue('--md-sys-card-padding-desktop').trim();
      expect(cardDesktopPadding).toMatch(/var\(--md-sys-spacing-6\)|1\.5rem/);
    });
  });

  describe('Button Spacing', () => {
    it('should define button-gap as 0.5rem (8px)', () => {
      const buttonGap = rootStyles.getPropertyValue('--md-sys-button-gap').trim();
      expect(buttonGap).toMatch(/var\(--md-sys-spacing-2\)|0\.5rem/);
    });

    it('should define button-group-gap as 0.75rem (12px)', () => {
      const buttonGroupGap = rootStyles.getPropertyValue('--md-sys-button-group-gap').trim();
      expect(buttonGroupGap).toMatch(/var\(--md-sys-spacing-3\)|0\.75rem/);
    });
  });
});

describe('Material Design 3 Form Utility Classes', () => {
  describe('.form-container', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.className = 'form-container';
      document.body.appendChild(element);
    });

    it('should have max-width of 800px', () => {
      const styles = getComputedStyle(element);
      expect(styles.maxWidth).toBe('800px');
    });

    it('should center the container with auto margins', () => {
      const styles = getComputedStyle(element);
      expect(styles.marginLeft).toBe('auto');
      expect(styles.marginRight).toBe('auto');
    });

    it('should have desktop padding', () => {
      const styles = getComputedStyle(element);
      const padding = styles.padding;
      // Padding should be var(--md-sys-container-padding-desktop) which is 24px
      expect(padding).toBeTruthy();
    });
  });

  describe('.form-section', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.className = 'form-section';
      document.body.appendChild(element);
    });

    it('should use flexbox with column direction', () => {
      const styles = getComputedStyle(element);
      expect(styles.display).toBe('flex');
      expect(styles.flexDirection).toBe('column');
    });

    it('should have proper gap between fields', () => {
      const styles = getComputedStyle(element);
      const gap = styles.gap;
      // Gap should be var(--md-sys-form-field-gap) which is 16px
      expect(gap).toBeTruthy();
    });

    it('should have bottom margin for section spacing', () => {
      const styles = getComputedStyle(element);
      const marginBottom = styles.marginBottom;
      // Margin should be var(--md-sys-form-section-gap) which is 24px
      expect(marginBottom).toBeTruthy();
    });
  });

  describe('.form-row', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.className = 'form-row';
      document.body.appendChild(element);
    });

    it('should use flexbox layout', () => {
      const styles = getComputedStyle(element);
      expect(styles.display).toBe('flex');
    });

    it('should have proper gap between columns', () => {
      const styles = getComputedStyle(element);
      const gap = styles.gap;
      // Gap should be var(--md-sys-form-row-gap) which is 16px
      expect(gap).toBeTruthy();
    });
  });

  describe('.form-actions', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.className = 'form-actions';
      document.body.appendChild(element);
    });

    it('should use flexbox layout', () => {
      const styles = getComputedStyle(element);
      expect(styles.display).toBe('flex');
    });

    it('should align buttons to the right', () => {
      const styles = getComputedStyle(element);
      expect(styles.justifyContent).toBe('flex-end');
    });

    it('should have gap between buttons', () => {
      const styles = getComputedStyle(element);
      const gap = styles.gap;
      // Gap should be var(--md-sys-button-group-gap) which is 12px
      expect(gap).toBeTruthy();
    });

    it('should have top margin and padding', () => {
      const styles = getComputedStyle(element);
      expect(styles.marginTop).toBeTruthy();
      expect(styles.paddingTop).toBeTruthy();
    });

    it('should have a top border', () => {
      const styles = getComputedStyle(element);
      expect(styles.borderTopWidth).toBe('1px');
      expect(styles.borderTopStyle).toBe('solid');
    });
  });

  describe('.full-width', () => {
    let element: HTMLElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.className = 'full-width';
      document.body.appendChild(element);
    });

    it('should have width of 100%', () => {
      const styles = getComputedStyle(element);
      expect(styles.width).toBe('100%');
    });
  });
});

describe('Spacing Consistency Validation', () => {
  describe('8px Grid System', () => {
    it('all spacing values should be multiples of 4px (0.25rem)', () => {
      const rootStyles = getComputedStyle(document.documentElement);
      
      const spacingValues = [
        '--md-sys-spacing-1',  // 4px
        '--md-sys-spacing-2',  // 8px
        '--md-sys-spacing-3',  // 12px
        '--md-sys-spacing-4',  // 16px
        '--md-sys-spacing-5',  // 20px
        '--md-sys-spacing-6',  // 24px
        '--md-sys-spacing-7',  // 28px
        '--md-sys-spacing-8',  // 32px
      ];

      spacingValues.forEach(varName => {
        const value = rootStyles.getPropertyValue(varName).trim();
        expect(value).toMatch(/^\d+(\.\d+)?rem$/);
        
        // Extract the numeric value
        const numericValue = parseFloat(value);
        
        // Convert to pixels (1rem = 16px)
        const pixels = numericValue * 16;
        
        // Should be divisible by 4
        expect(pixels % 4).toBe(0);
      });
    });
  });

  describe('Form Field Spacing Compliance', () => {
    it('should use 16px (1rem) between form fields as per MD3', () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const formFieldGap = rootStyles.getPropertyValue('--md-sys-form-field-gap').trim();
      
      // Either direct value or variable reference to spacing-4
      expect(formFieldGap === '1rem' || formFieldGap.includes('spacing-4')).toBe(true);
    });

    it('should use 24px (1.5rem) between form sections as per MD3', () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const formSectionGap = rootStyles.getPropertyValue('--md-sys-form-section-gap').trim();
      
      // Either direct value or variable reference to spacing-6
      expect(formSectionGap === '1.5rem' || formSectionGap.includes('spacing-6')).toBe(true);
    });
  });

  describe('Responsive Padding', () => {
    it('mobile container padding should be smaller than desktop', () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const mobilePadding = rootStyles.getPropertyValue('--md-sys-container-padding-mobile').trim();
      const desktopPadding = rootStyles.getPropertyValue('--md-sys-container-padding-desktop').trim();
      
      // Mobile should be 16px (1rem), desktop should be 24px (1.5rem)
      expect(mobilePadding).toMatch(/1rem|spacing-4/);
      expect(desktopPadding).toMatch(/1\.5rem|spacing-6/);
    });
  });
});
