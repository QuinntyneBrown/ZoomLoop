// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Vehicle Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cars/1');
  });

  test('should display the breadcrumb', async ({ page }) => {
    await expect(page.locator('.vehicle-detail__breadcrumb')).toBeVisible();
  });

  test('should display vehicle title', async ({ page }) => {
    await expect(page.locator('.vehicle-detail__title')).toBeVisible();
  });

  test('should display vehicle price', async ({ page }) => {
    await expect(page.locator('.vehicle-detail__price-amount')).toBeVisible();
  });

  test('should display image gallery', async ({ page }) => {
    await expect(page.locator('zl-image-gallery')).toBeVisible();
  });

  test('should display vehicle specs', async ({ page }) => {
    await expect(page.locator('.vehicle-detail__specs')).toBeVisible();
    await expect(page.locator('.vehicle-detail__spec').first()).toBeVisible();
  });

  test('should display finance calculator', async ({ page }) => {
    await expect(page.locator('zl-finance-calculator')).toBeVisible();
  });

  test('should display trust badges', async ({ page }) => {
    await expect(page.locator('zl-trust-badges')).toBeVisible();
  });

  test('should toggle favorite', async ({ page }) => {
    const btn = page.locator('.vehicle-detail__favorite-btn');
    await btn.click();
    await expect(btn).toContainText('Saved');
  });

  test('should navigate back via breadcrumb', async ({ page }) => {
    await page.click('.vehicle-detail__breadcrumb a[routerLink="/cars"]');
    await expect(page).toHaveURL(/\/cars$/);
  });

  test('should display delivery info', async ({ page }) => {
    await expect(page.locator('.vehicle-detail__delivery')).toBeVisible();
  });

  test('should display badges', async ({ page }) => {
    await expect(page.locator('.vehicle-detail__badges')).toBeVisible();
  });
});
