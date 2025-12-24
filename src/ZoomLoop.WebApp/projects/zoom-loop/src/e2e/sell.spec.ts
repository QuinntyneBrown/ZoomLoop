// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Sell Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sell');
  });

  test('should display the hero section', async ({ page }) => {
    await expect(page.locator('.sell__hero')).toBeVisible();
    await expect(page.locator('.sell__hero-title')).toContainText('Sell or Trade-In');
  });

  test('should display the vehicle form', async ({ page }) => {
    await expect(page.locator('.sell__form')).toBeVisible();
  });

  test('should display year select', async ({ page }) => {
    await expect(page.locator('select').first()).toBeVisible();
  });

  test('should display make select', async ({ page }) => {
    await expect(page.locator('select').nth(1)).toBeVisible();
  });

  test('should display condition options', async ({ page }) => {
    await expect(page.locator('.sell__conditions')).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await expect(page.locator('zl-how-it-works')).toBeVisible();
  });

  test('should display trust badges', async ({ page }) => {
    await expect(page.locator('zl-trust-badges')).toBeVisible();
  });

  test('should fill step 1 and proceed', async ({ page }) => {
    await page.selectOption('select:first-of-type', '2022');
    await page.selectOption('select:nth-of-type(2)', 'Honda');
    await page.fill('input[placeholder*="Civic"]', 'Civic');
    await page.fill('input[type="number"]', '50000');
    await page.click('zl-button');
    await expect(page.locator('.sell__step-title')).toContainText('contact');
  });

  test('should go back to previous step', async ({ page }) => {
    await page.selectOption('select:first-of-type', '2022');
    await page.selectOption('select:nth-of-type(2)', 'Honda');
    await page.fill('input[placeholder*="Civic"]', 'Civic');
    await page.fill('input[type="number"]', '50000');
    await page.click('zl-button');
    await page.click('zl-button:first-of-type');
    await expect(page.locator('.sell__step-title')).toContainText('vehicle');
  });

  test('should complete the flow and show valuation', async ({ page }) => {
    // Step 1
    await page.selectOption('select:first-of-type', '2022');
    await page.selectOption('select:nth-of-type(2)', 'Honda');
    await page.fill('input[placeholder*="Civic"]', 'Civic');
    await page.fill('input[type="number"]', '50000');
    await page.click('zl-button');

    // Step 2
    await page.fill('input[placeholder="John"]', 'John');
    await page.fill('input[placeholder="Doe"]', 'Doe');
    await page.fill('input[type="email"]', 'john@example.com');
    await page.click('zl-button:last-of-type');

    // Wait for valuation
    await expect(page.locator('.sell__valuation-amount')).toBeVisible({ timeout: 5000 });
  });
});
