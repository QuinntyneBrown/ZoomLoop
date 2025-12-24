// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Cars Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cars');
  });

  test('should display the search header', async ({ page }) => {
    await expect(page.locator('.cars__header')).toBeVisible();
  });

  test('should display the search bar', async ({ page }) => {
    await expect(page.locator('zl-search-bar')).toBeVisible();
  });

  test('should display the filter sidebar', async ({ page }) => {
    await expect(page.locator('.cars__sidebar')).toBeVisible();
  });

  test('should display vehicle count', async ({ page }) => {
    await expect(page.locator('.cars__results-count')).toBeVisible();
    await expect(page.locator('.cars__results-count')).toContainText('vehicles found');
  });

  test('should display vehicle cards', async ({ page }) => {
    await expect(page.locator('zl-vehicle-card').first()).toBeVisible();
  });

  test('should filter by make', async ({ page }) => {
    await page.click('.cars__filter-option:first-child input');
    await expect(page.locator('.cars__results-count')).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    await page.click('.cars__filter-option:first-child input');
    await page.click('.cars__clear-btn');
    await expect(page.locator('.cars__clear-btn')).not.toBeVisible();
  });

  test('should search vehicles', async ({ page }) => {
    await page.fill('zl-search-bar input', 'Toyota');
    await page.press('zl-search-bar input', 'Enter');
    await expect(page).toHaveURL(/q=Toyota/);
  });

  test('should navigate to vehicle detail when clicking card', async ({ page }) => {
    await page.click('zl-vehicle-card a');
    await expect(page).toHaveURL(/\/cars\/\d+/);
  });

  test('should toggle favorite', async ({ page }) => {
    const favoriteBtn = page.locator('zl-vehicle-card').first().locator('[class*="favorite"]');
    await favoriteBtn.click();
  });
});
