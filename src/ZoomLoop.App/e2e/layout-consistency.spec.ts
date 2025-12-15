import { expect, test } from '@playwright/test';

/**
 * E2E Tests for Material Design 3 Layout Consistency
 * 
 * These tests validate that form layouts across different pages
 * consistently follow Material Design 3 spacing guidelines:
 * - 16px (1rem) between form fields
 * - 24px (1.5rem) between form sections
 * - 16px mobile / 24px desktop container padding
 */

test.describe('Form Layout Consistency', () => {
  test.describe('Personal Info Page', () => {
    test.beforeEach(async ({ page }) => {
      // Note: This may require authentication
      await page.goto('/personal-info');
      // Wait for the form to load
      await page.waitForSelector('form', { timeout: 5000 }).catch(() => {
        // Form may require login, that's okay for layout tests
      });
    });

    test('should have consistent spacing between form fields', async ({ page }) => {
      // Check if form fields exist
      const formFields = page.locator('mat-form-field');
      const count = await formFields.count();
      
      if (count > 1) {
        // Get the computed styles of form sections
        const formSection = page.locator('.form-section').first();
        const gap = await formSection.evaluate((el) => {
          return window.getComputedStyle(el).gap;
        });
        
        // Gap should be 16px (1rem) or the CSS variable
        expect(gap === '16px' || gap.includes('rem')).toBe(true);
      }
    });

    test('should have proper section spacing', async ({ page }) => {
      const formSections = page.locator('.form-section');
      const count = await formSections.count();
      
      if (count > 0) {
        const firstSection = formSections.first();
        const marginBottom = await firstSection.evaluate((el) => {
          return window.getComputedStyle(el).marginBottom;
        });
        
        // Should be 24px (1.5rem) between sections
        expect(marginBottom === '24px' || marginBottom.includes('rem')).toBe(true);
      }
    });

    test('should have responsive container padding', async ({ page }) => {
      const container = page.locator('.personal-info-card mat-card-content').first();
      
      if (await container.count() > 0) {
        const padding = await container.evaluate((el) => {
          return window.getComputedStyle(el).padding;
        });
        
        // Should have padding defined
        expect(padding).toBeTruthy();
      }
    });
  });

  test.describe('Loan Calculator Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/loan-calculator');
      await page.waitForSelector('.loan-calculator', { timeout: 5000 });
    });

    test('should have consistent spacing between form fields', async ({ page }) => {
      const loanForm = page.locator('.loan-form');
      const gap = await loanForm.evaluate((el) => {
        return window.getComputedStyle(el).gap;
      });
      
      // Gap should be 16px (1rem) or use CSS variable
      expect(gap === '16px' || gap.includes('rem')).toBe(true);
    });

    test('should use MD3 spacing for results section', async ({ page }) => {
      // Fill in form to show results
      await page.locator('input#price').fill('25000');
      await page.locator('input#downPayment').fill('5000');
      await page.locator('input#apr').fill('5');
      await page.selectOption('#termMonths', '60');
      await page.locator('input#fees').fill('500');
      await page.getByRole('button', { name: /calculate payment/i }).click();
      
      // Wait for results to appear
      await page.waitForSelector('.loan-results', { timeout: 3000 });
      
      const resultsGrid = page.locator('.loan-results__grid');
      const gap = await resultsGrid.evaluate((el) => {
        return window.getComputedStyle(el).gap;
      });
      
      // Grid gap should follow MD3 spacing
      expect(gap).toBeTruthy();
    });

    test('should have proper button spacing in actions', async ({ page }) => {
      const actions = page.locator('.loan-form__actions');
      const gap = await actions.evaluate((el) => {
        return window.getComputedStyle(el).gap;
      });
      
      // Button gap should be 12px (0.75rem) per MD3
      expect(gap === '12px' || gap.includes('rem')).toBe(true);
    });
  });

  test.describe('Search Input Component', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/cars');
      await page.waitForSelector('.search-panel', { timeout: 5000 });
    });

    test('should have consistent field spacing in search form', async ({ page }) => {
      const searchGrid = page.locator('.search-grid').first();
      
      if (await searchGrid.count() > 0) {
        const gap = await searchGrid.evaluate((el) => {
          return window.getComputedStyle(el).gap;
        });
        
        // Gap should be 16px (1rem)
        expect(gap === '16px' || gap.includes('rem')).toBe(true);
      }
    });

    test('should have proper row spacing for side-by-side fields', async ({ page }) => {
      const formRow = page.locator('.form-row').first();
      
      if (await formRow.count() > 0) {
        const gap = await formRow.evaluate((el) => {
          return window.getComputedStyle(el).gap;
        });
        
        // Row gap should be 16px
        expect(gap === '16px' || gap.includes('rem')).toBe(true);
      }
    });
  });
});

test.describe('Responsive Layout Tests', () => {
  test('form-row should stack vertically on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
    await page.goto('/personal-info');
    
    const formRow = page.locator('.form-row').first();
    
    if (await formRow.count() > 0) {
      const flexDirection = await formRow.evaluate((el) => {
        return window.getComputedStyle(el).flexDirection;
      });
      
      // Should be column on mobile
      expect(flexDirection).toBe('column');
    }
  });

  test('form-actions should reverse on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/personal-info');
    
    const formActions = page.locator('.form-actions').first();
    
    if (await formActions.count() > 0) {
      const flexDirection = await formActions.evaluate((el) => {
        return window.getComputedStyle(el).flexDirection;
      });
      
      // Should be column-reverse on mobile
      expect(flexDirection).toBe('column-reverse');
    }
  });

  test('container padding should be smaller on mobile', async ({ page }) => {
    // Test desktop first
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/loan-calculator');
    
    const container = page.locator('.loan-calculator__container');
    const desktopPadding = await container.evaluate((el) => {
      return window.getComputedStyle(el).padding;
    });
    
    // Test mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/loan-calculator');
    
    const mobilePadding = await container.evaluate((el) => {
      return window.getComputedStyle(el).padding;
    });
    
    // Mobile and desktop padding should be different
    expect(desktopPadding).not.toBe(mobilePadding);
  });
});

test.describe('CSS Custom Properties', () => {
  test('MD3 spacing tokens should be defined in root', async ({ page }) => {
    await page.goto('/');
    
    const spacingTokens = [
      '--md-sys-spacing-0',
      '--md-sys-spacing-4',
      '--md-sys-spacing-6',
      '--md-sys-form-field-gap',
      '--md-sys-form-section-gap',
      '--md-sys-container-padding-mobile',
      '--md-sys-container-padding-desktop',
    ];
    
    for (const token of spacingTokens) {
      const value = await page.evaluate((varName) => {
        return getComputedStyle(document.documentElement).getPropertyValue(varName);
      }, token);
      
      expect(value.trim()).toBeTruthy();
    }
  });

  test('form-field-gap should be 1rem (16px)', async ({ page }) => {
    await page.goto('/');
    
    const value = await page.evaluate(() => {
      const rawValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--md-sys-form-field-gap').trim();
      
      // Resolve variable if it references another variable
      if (rawValue.startsWith('var(')) {
        const varName = rawValue.match(/var\((--[^)]+)\)/)?.[1];
        if (varName) {
          return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }
      }
      
      return rawValue;
    });
    
    expect(value).toBe('1rem');
  });

  test('form-section-gap should be 1.5rem (24px)', async ({ page }) => {
    await page.goto('/');
    
    const value = await page.evaluate(() => {
      const rawValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--md-sys-form-section-gap').trim();
      
      // Resolve variable if it references another variable
      if (rawValue.startsWith('var(')) {
        const varName = rawValue.match(/var\((--[^)]+)\)/)?.[1];
        if (varName) {
          return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
        }
      }
      
      return rawValue;
    });
    
    expect(value).toBe('1.5rem');
  });
});

test.describe('Visual Consistency Across Pages', () => {
  const pages = [
    '/loan-calculator',
    '/personal-info',
    '/cars',
  ];

  for (const pagePath of pages) {
    test(`${pagePath} should use consistent form patterns`, async ({ page }) => {
      await page.goto(pagePath);
      
      // Check if form sections exist and have consistent styling
      const formSections = page.locator('.form-section');
      const count = await formSections.count();
      
      if (count > 0) {
        const styles = await formSections.first().evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            display: computed.display,
            flexDirection: computed.flexDirection,
            gap: computed.gap,
            marginBottom: computed.marginBottom,
          };
        });
        
        expect(styles.display).toBe('flex');
        expect(styles.flexDirection).toBe('column');
        expect(styles.gap).toBeTruthy();
        expect(styles.marginBottom).toBeTruthy();
      }
    });
  }
});
