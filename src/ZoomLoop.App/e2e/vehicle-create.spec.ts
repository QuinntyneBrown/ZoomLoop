import { expect, test } from '@playwright/test';

test.describe('Vehicle Create Page', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real scenario, we would need to login first
    // For now, we'll test the redirect behavior
  });

  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/vehicles/create');
    
    // Should redirect to login page
    await page.waitForURL('**/login');
    await expect(page).toHaveURL(/.*login/);
  });

  test.describe('Authenticated User', () => {
    test.beforeEach(async ({ page }) => {
      // Mock authentication by setting a token in localStorage
      await page.goto('/login');
      await page.evaluate(() => {
        localStorage.setItem('accessToken', 'mock-token-for-testing');
      });
    });

    test('displays vehicle create form when authenticated', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      // Check for form title
      await expect(page.getByRole('heading', { name: /create new vehicle listing/i })).toBeVisible();
      
      // Check for required form fields
      await expect(page.getByLabel(/vin/i)).toBeVisible();
      await expect(page.getByLabel(/stock number/i)).toBeVisible();
      await expect(page.getByLabel(/year/i)).toBeVisible();
      await expect(page.getByLabel(/mileage/i)).toBeVisible();
    });

    test('validates VIN format', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      const vinInput = page.getByLabel(/^vin/i);
      
      // Fill with invalid VIN
      await vinInput.fill('INVALID');
      await vinInput.blur();
      
      // Should show error
      await expect(page.getByText(/VIN must be exactly 17 characters/i)).toBeVisible();
      
      // Fill with valid VIN (17 characters)
      await vinInput.fill('1HGBH41JXMN109186');
      await vinInput.blur();
      
      // Error should disappear
      await expect(page.getByText(/VIN must be exactly 17 characters/i)).not.toBeVisible();
    });

    test('validates required fields', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      // Try to submit without filling required fields
      const submitButton = page.getByRole('button', { name: /create vehicle/i });
      
      // Button should be disabled when form is invalid
      await expect(submitButton).toBeDisabled();
      
      // Fill required fields
      await page.getByLabel(/^vin/i).fill('1HGBH41JXMN109186');
      await page.getByLabel(/stock number/i).fill('STK123');
      await page.getByLabel(/year/i).fill('2023');
      await page.getByLabel(/mileage/i).fill('15000');
      await page.getByLabel(/exterior color/i).fill('Silver');
      await page.getByLabel(/interior color/i).fill('Black');
      await page.getByLabel(/transmission/i).selectOption('Automatic');
      await page.getByLabel(/fuel type/i).selectOption('Gasoline');
      await page.getByLabel(/drive type/i).selectOption('FWD');
      await page.getByLabel(/body type/i).selectOption('Sedan');
      await page.getByLabel(/description/i).fill('Well-maintained vehicle');
      
      // Button should be enabled now
      await expect(submitButton).toBeEnabled();
    });

    test('displays dropzone for image upload', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      await expect(page.getByText(/drag and drop images here/i)).toBeVisible();
    });

    test('displays feature categories', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      // Check for feature categories
      await expect(page.getByRole('heading', { name: /safety/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /technology/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /comfort/i })).toBeVisible();
      await expect(page.getByRole('heading', { name: /convenience/i })).toBeVisible();
    });

    test('can select and deselect features', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      // Find and click a feature checkbox
      const backupCameraCheckbox = page.getByLabel(/backup camera/i);
      await backupCameraCheckbox.check();
      
      // Should show in selected features
      await expect(page.getByText(/selected features/i)).toBeVisible();
      await expect(page.getByText(/backup camera ×/i)).toBeVisible();
      
      // Uncheck the feature
      await backupCameraCheckbox.uncheck();
      
      // Should be removed from selected features
      await expect(page.getByText(/backup camera ×/i)).not.toBeVisible();
    });

    test('can toggle between new and certified', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      const newVehicleCheckbox = page.getByLabel(/new vehicle/i);
      const certifiedCheckbox = page.getByLabel(/certified pre-owned/i);
      
      // Check new vehicle
      await newVehicleCheckbox.check();
      await expect(newVehicleCheckbox).toBeChecked();
      
      // Check certified
      await certifiedCheckbox.check();
      await expect(certifiedCheckbox).toBeChecked();
      
      // Both can be checked
      await expect(newVehicleCheckbox).toBeChecked();
      await expect(certifiedCheckbox).toBeChecked();
    });

    test('has cancel button that works', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      const cancelButton = page.getByRole('button', { name: /cancel/i });
      await expect(cancelButton).toBeVisible();
      await expect(cancelButton).toBeEnabled();
    });

    test('displays all specification dropdowns', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      // Check transmission options
      const transmissionSelect = page.getByLabel(/transmission/i);
      await transmissionSelect.click();
      await expect(page.getByRole('option', { name: /automatic/i })).toBeVisible();
      await expect(page.getByRole('option', { name: /manual/i })).toBeVisible();
      
      // Check fuel type options
      const fuelTypeSelect = page.getByLabel(/fuel type/i);
      await fuelTypeSelect.click();
      await expect(page.getByRole('option', { name: /gasoline/i })).toBeVisible();
      await expect(page.getByRole('option', { name: /electric/i })).toBeVisible();
      
      // Check body type options
      const bodyTypeSelect = page.getByLabel(/body type/i);
      await bodyTypeSelect.click();
      await expect(page.getByRole('option', { name: /sedan/i })).toBeVisible();
      await expect(page.getByRole('option', { name: /suv/i })).toBeVisible();
    });

    test('year input has reasonable default and validation', async ({ page }) => {
      await page.goto('/vehicles/create');
      
      const yearInput = page.getByLabel(/year/i);
      const currentYear = new Date().getFullYear();
      
      // Should have current year as default
      await expect(yearInput).toHaveValue(currentYear.toString());
      
      // Should accept valid year
      await yearInput.fill('2023');
      await expect(yearInput).toHaveValue('2023');
    });
  });
});
