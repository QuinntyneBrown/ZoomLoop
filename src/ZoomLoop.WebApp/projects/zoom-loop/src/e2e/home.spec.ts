import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section', async ({ page }) => {
    await expect(page.locator('.home zl-hero')).toBeVisible();
  });

  test('should display the page title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Find Your Perfect Car');
  });

  test('should display featured vehicles section', async ({ page }) => {
    await expect(page.locator('.home__featured')).toBeVisible();
    await expect(page.locator('.home__section-title').first()).toContainText('Featured Vehicles');
  });

  test('should display vehicle cards', async ({ page }) => {
    await expect(page.locator('zl-vehicle-card').first()).toBeVisible();
  });

  test('should display browse by make section', async ({ page }) => {
    await expect(page.locator('.home__makes')).toBeVisible();
  });

  test('should navigate to cars page when clicking view all', async ({ page }) => {
    await page.click('a[routerLink="/cars"]');
    await expect(page).toHaveURL(/\/cars/);
  });

  test('should navigate to cars page when searching', async ({ page }) => {
    await page.fill('zl-search-bar input', 'Honda');
    await page.press('zl-search-bar input', 'Enter');
    await expect(page).toHaveURL(/\/cars.*q=Honda/);
  });

  test('should navigate to cars page when clicking a make', async ({ page }) => {
    await page.click('.home__make-card:first-child');
    await expect(page).toHaveURL(/\/cars.*make=/);
  });

  test('should display trust badges', async ({ page }) => {
    await expect(page.locator('zl-trust-badges')).toBeVisible();
  });

  test('should display how it works section', async ({ page }) => {
    await expect(page.locator('zl-how-it-works')).toBeVisible();
  });

  test('should display sell CTA section', async ({ page }) => {
    await expect(page.locator('.home__sell')).toBeVisible();
  });
});
