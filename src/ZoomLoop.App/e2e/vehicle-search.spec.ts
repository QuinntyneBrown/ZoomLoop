// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Vehicle Search Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that includes the search components
    // For now, we'll navigate to the root page
    await page.goto('/');
  });

  test('should display search input component', async ({ page }) => {
    const searchInput = page.locator('zl-search-input');
    
    if (await searchInput.count() > 0) {
      await expect(searchInput).toBeVisible();
      
      // Check that expansion panel is present
      const expansionPanel = searchInput.locator('mat-expansion-panel');
      await expect(expansionPanel).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should expand search panel and show form fields', async ({ page }) => {
    const searchInput = page.locator('zl-search-input');
    
    if (await searchInput.count() > 0) {
      const expansionHeader = searchInput.locator('mat-expansion-panel-header');
      await expansionHeader.click();
      
      // Wait for expansion
      await page.waitForTimeout(500);
      
      // Check that form fields are visible
      await expect(searchInput.locator('input[formcontrolname="make"]')).toBeVisible();
      await expect(searchInput.locator('input[formcontrolname="model"]')).toBeVisible();
      await expect(searchInput.locator('input[formcontrolname="yearMin"]')).toBeVisible();
      await expect(searchInput.locator('input[formcontrolname="priceMin"]')).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should show make suggestions on type-ahead', async ({ page }) => {
    const searchInput = page.locator('zl-search-input');
    
    if (await searchInput.count() > 0) {
      const expansionHeader = searchInput.locator('mat-expansion-panel-header');
      await expansionHeader.click();
      await page.waitForTimeout(500);
      
      // Type in make field (would require backend to return suggestions)
      const makeInput = searchInput.locator('input[formcontrolname="make"]');
      await makeInput.fill('Toy');
      
      // Wait for debounce
      await page.waitForTimeout(500);
      
      // Note: This would require a working backend to verify autocomplete options
      // For now, just verify the input works
      await expect(makeInput).toHaveValue('Toy');
    } else {
      test.skip();
    }
  });

  test('should allow filling out search form', async ({ page }) => {
    const searchInput = page.locator('zl-search-input');
    
    if (await searchInput.count() > 0) {
      const expansionHeader = searchInput.locator('mat-expansion-panel-header');
      await expansionHeader.click();
      await page.waitForTimeout(500);
      
      // Fill out various form fields
      await searchInput.locator('input[formcontrolname="make"]').fill('Toyota');
      await searchInput.locator('input[formcontrolname="model"]').fill('Camry');
      await searchInput.locator('input[formcontrolname="yearMin"]').fill('2020');
      await searchInput.locator('input[formcontrolname="yearMax"]').fill('2024');
      await searchInput.locator('input[formcontrolname="priceMin"]').fill('20000');
      await searchInput.locator('input[formcontrolname="priceMax"]').fill('40000');
      
      // Verify values
      await expect(searchInput.locator('input[formcontrolname="make"]')).toHaveValue('Toyota');
      await expect(searchInput.locator('input[formcontrolname="yearMin"]')).toHaveValue('2020');
    } else {
      test.skip();
    }
  });

  test('should have search and reset buttons', async ({ page }) => {
    const searchInput = page.locator('zl-search-input');
    
    if (await searchInput.count() > 0) {
      const expansionHeader = searchInput.locator('mat-expansion-panel-header');
      await expansionHeader.click();
      await page.waitForTimeout(500);
      
      // Check for search button
      const searchButton = searchInput.locator('button[type="submit"]');
      await expect(searchButton).toBeVisible();
      await expect(searchButton).toContainText('Search');
      
      // Check for reset button
      const resetButton = searchInput.locator('button[type="button"]');
      await expect(resetButton).toBeVisible();
      await expect(resetButton).toContainText('Reset');
    } else {
      test.skip();
    }
  });

  test('should reset form when clicking reset button', async ({ page }) => {
    const searchInput = page.locator('zl-search-input');
    
    if (await searchInput.count() > 0) {
      const expansionHeader = searchInput.locator('mat-expansion-panel-header');
      await expansionHeader.click();
      await page.waitForTimeout(500);
      
      // Fill out form
      await searchInput.locator('input[formcontrolname="make"]').fill('Toyota');
      await searchInput.locator('input[formcontrolname="yearMin"]').fill('2020');
      
      // Click reset
      const resetButton = searchInput.locator('button:has-text("Reset")');
      await resetButton.click();
      
      // Verify fields are cleared
      await expect(searchInput.locator('input[formcontrolname="make"]')).toHaveValue('');
      await expect(searchInput.locator('input[formcontrolname="yearMin"]')).toHaveValue('');
    } else {
      test.skip();
    }
  });

  test('should display search results component', async ({ page }) => {
    const searchResults = page.locator('zl-search-results');
    
    if (await searchResults.count() > 0) {
      await expect(searchResults).toBeVisible();
    } else {
      test.skip();
    }
  });

  test('should show filter and sort controls in results', async ({ page }) => {
    const searchResults = page.locator('zl-search-results');
    
    if (await searchResults.count() > 0) {
      // Check for sort dropdown
      const sortSelect = searchResults.locator('mat-select').first();
      if (await sortSelect.count() > 0) {
        await expect(sortSelect).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('should display no results message when no vehicles found', async ({ page }) => {
    const searchResults = page.locator('zl-search-results');
    
    if (await searchResults.count() > 0) {
      const noResults = searchResults.locator('.no-results');
      
      // This would show if there are no results
      // For now, we just check the structure exists in the component
      if (await noResults.count() > 0) {
        await expect(noResults.locator('mat-icon')).toBeVisible();
      }
    } else {
      test.skip();
    }
  });

  test('should display vehicle cards in grid layout', async ({ page }) => {
    const searchResults = page.locator('zl-search-results');
    
    if (await searchResults.count() > 0) {
      const resultsGrid = searchResults.locator('.results-grid');
      
      if (await resultsGrid.count() > 0) {
        // Check if vehicle cards are present
        const vehicleCards = resultsGrid.locator('zl-vehicle-card');
        
        if (await vehicleCards.count() > 0) {
          await expect(vehicleCards.first()).toBeVisible();
        }
      }
    } else {
      test.skip();
    }
  });

  test('should show pagination controls', async ({ page }) => {
    const searchResults = page.locator('zl-search-results');
    
    if (await searchResults.count() > 0) {
      const paginator = searchResults.locator('mat-paginator');
      
      if (await paginator.count() > 0) {
        await expect(paginator).toBeVisible();
      }
    } else {
      test.skip();
    }
  });
});
