// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect, Page } from '@playwright/test';

const mockVehicles = [
  {
    vehicleId: '1',
    vin: 'ABC123',
    stockNumber: 'STK001',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    trim: 'Touring',
    mileage: 24500,
    exteriorColor: 'Sonic Gray',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 28995,
    isNew: false,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1619682817481-e994891cd1f5?w=800',
    listedDate: '2024-01-15T00:00:00Z'
  },
  {
    vehicleId: '2',
    vin: 'DEF456',
    stockNumber: 'STK002',
    make: 'Toyota',
    model: 'RAV4',
    year: 2023,
    trim: 'XLE',
    mileage: 15200,
    exteriorColor: 'Magnetic Gray',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 36995,
    isNew: false,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1568844293986-8c37f5e9a9f0?w=800',
    listedDate: '2024-01-10T00:00:00Z'
  },
  {
    vehicleId: '3',
    vin: 'GHI789',
    stockNumber: 'STK003',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    trim: 'XLT',
    mileage: 45000,
    exteriorColor: 'Agate Black',
    interiorColor: 'Gray',
    transmission: 'automatic',
    doors: 4,
    price: 42995,
    isNew: false,
    isCertified: true,
    accidentFree: false,
    primaryImageUrl: 'https://images.unsplash.com/photo-1605410109664-0e55de912496?w=800',
    listedDate: '2024-01-05T00:00:00Z'
  },
  {
    vehicleId: '4',
    vin: 'JKL012',
    stockNumber: 'STK004',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    trim: 'Preferred',
    mileage: 28900,
    exteriorColor: 'Amazon Gray',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 31495,
    isNew: false,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=800',
    listedDate: '2024-01-08T00:00:00Z'
  },
  {
    vehicleId: '5',
    vin: 'MNO345',
    stockNumber: 'STK005',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    trim: 'Long Range',
    mileage: 12000,
    exteriorColor: 'Pearl White',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 52995,
    isNew: true,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    listedDate: '2024-01-12T00:00:00Z'
  },
  {
    vehicleId: '6',
    vin: 'PQR678',
    stockNumber: 'STK006',
    make: 'Mazda',
    model: 'CX-5',
    year: 2020,
    trim: 'GT',
    mileage: 52000,
    exteriorColor: 'Soul Red',
    interiorColor: 'Parchment',
    transmission: 'automatic',
    doors: 4,
    price: 27995,
    isNew: false,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1551830820-330a71b99659?w=800',
    listedDate: '2024-01-03T00:00:00Z'
  },
  {
    vehicleId: '7',
    vin: 'STU901',
    stockNumber: 'STK007',
    make: 'BMW',
    model: 'X3',
    year: 2022,
    trim: 'xDrive30i',
    mileage: 22000,
    exteriorColor: 'Alpine White',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 48995,
    isNew: false,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
    listedDate: '2024-01-09T00:00:00Z'
  },
  {
    vehicleId: '8',
    vin: 'VWX234',
    stockNumber: 'STK008',
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    trim: 'SX',
    mileage: 8500,
    exteriorColor: 'Gravity Gray',
    interiorColor: 'Black',
    transmission: 'automatic',
    doors: 4,
    price: 38995,
    isNew: true,
    isCertified: true,
    accidentFree: true,
    primaryImageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    listedDate: '2024-01-14T00:00:00Z'
  }
];

async function setupApiMocks(page: Page, vehicleFilter?: (v: typeof mockVehicles[0]) => boolean) {
  await page.route('**/api/vehicle/search', async route => {
    const request = route.request();
    const postData = request.postDataJSON() as { filters?: { makes?: string[] }; page?: number; pageSize?: number };

    let filteredVehicles = [...mockVehicles];

    if (postData?.filters?.makes?.length) {
      filteredVehicles = filteredVehicles.filter(v =>
        postData.filters!.makes!.includes(v.make)
      );
    }

    if (vehicleFilter) {
      filteredVehicles = filteredVehicles.filter(vehicleFilter);
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: filteredVehicles,
        total: filteredVehicles.length,
        page: postData?.page ?? 1,
        pageSize: postData?.pageSize ?? 12
      })
    });
  });

  await page.route('**/api/vehicle/*', async route => {
    const url = route.request().url();
    const vehicleId = url.split('/').pop();
    const vehicle = mockVehicles.find(v => v.vehicleId === vehicleId);

    if (vehicle) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ vehicle })
      });
    } else {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Vehicle not found' })
      });
    }
  });
}

test.describe('Cars Page', () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto('/cars');
    await page.waitForSelector('zl-vehicle-card', { timeout: 10000 });
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

  test('should display vehicle cards from API', async ({ page }) => {
    const vehicleCards = page.locator('zl-vehicle-card');
    await expect(vehicleCards.first()).toBeVisible();
    await expect(vehicleCards).toHaveCount(8);
  });

  test('should filter by make via API', async ({ page }) => {
    await page.click('.cars__filter-option:first-child input');
    await page.waitForResponse(resp =>
      resp.url().includes('/api/vehicle/search') && resp.status() === 200
    );
    await expect(page.locator('.cars__results-count')).toBeVisible();
  });

  test('should clear filters', async ({ page }) => {
    await page.click('.cars__filter-option:first-child input');
    await page.waitForResponse(resp =>
      resp.url().includes('/api/vehicle/search') && resp.status() === 200
    );
    await page.click('.cars__clear-btn');
    await page.waitForResponse(resp =>
      resp.url().includes('/api/vehicle/search') && resp.status() === 200
    );
    await expect(page.locator('.cars__clear-btn')).not.toBeVisible();
  });

  test('should search vehicles via API', async ({ page }) => {
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

  test('should make HTTP request to search endpoint', async ({ page }) => {
    const searchRequest = page.waitForRequest(request =>
      request.url().includes('/api/vehicle/search') &&
      request.method() === 'POST'
    );

    await page.reload();
    const request = await searchRequest;

    expect(request.method()).toBe('POST');
    expect(request.url()).toContain('/api/vehicle/search');
  });

  test('should receive paginated response from API', async ({ page }) => {
    const response = await page.waitForResponse(resp =>
      resp.url().includes('/api/vehicle/search') && resp.status() === 200
    );

    const body = await response.json();
    expect(body).toHaveProperty('items');
    expect(body).toHaveProperty('total');
    expect(body).toHaveProperty('page');
    expect(body).toHaveProperty('pageSize');
    expect(Array.isArray(body.items)).toBe(true);
  });
});

test.describe('Cars Page - API Integration', () => {
  test('should send correct filter parameters to API', async ({ page }) => {
    await setupApiMocks(page);

    const searchRequestPromise = page.waitForRequest(request =>
      request.url().includes('/api/vehicle/search') &&
      request.method() === 'POST'
    );

    await page.goto('/cars?make=Honda');
    const request = await searchRequestPromise;
    const postData = request.postDataJSON();

    expect(postData).toHaveProperty('filters');
    expect(postData).toHaveProperty('page');
    expect(postData).toHaveProperty('pageSize');
  });

  test('should handle empty search results gracefully', async ({ page }) => {
    await page.route('**/api/vehicle/search', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          total: 0,
          page: 1,
          pageSize: 12
        })
      });
    });

    await page.goto('/cars');
    await expect(page.locator('.cars__results-count')).toContainText('0 vehicles found');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/api/vehicle/search', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/cars');
    await expect(page.locator('.cars__results-count')).toContainText('0 vehicles found');
  });
});
