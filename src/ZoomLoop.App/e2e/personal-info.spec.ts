import { expect, test } from '@playwright/test';

test.describe('Personal Info Page', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting token in localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'mock-token');
    });

    // Mock the profile API responses
    await page.route('/api/profile/current', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          profile: {
            profileImageUrl: 'https://example.com/photo.jpg',
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '555-1234',
            dateOfBirth: '1990-01-01',
            homeAddress: {
              address1: '123 Main St',
              address2: 'Apt 4B',
              city: 'New York',
              province: 'NY',
              postalCode: '10001'
            }
          }
        })
      });
    });

    await page.goto('/personal-info');
  });

  test('displays personal info form', async ({ page }) => {
    // Check for page title
    await expect(page.getByRole('heading', { name: /personal information/i })).toBeVisible();

    // Check for form sections
    await expect(page.getByRole('heading', { name: /basic information/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /home address/i })).toBeVisible();
  });

  test('loads and displays existing profile data', async ({ page }) => {
    // Wait for the form to load
    await page.waitForSelector('input[formcontrolname="firstName"]', { state: 'visible' });

    // Check that form fields are populated with existing data
    await expect(page.locator('input[formcontrolname="firstName"]')).toHaveValue('John');
    await expect(page.locator('input[formcontrolname="lastName"]')).toHaveValue('Doe');
    await expect(page.locator('input[formcontrolname="phoneNumber"]')).toHaveValue('555-1234');
  });

  test('loads and displays address data', async ({ page }) => {
    // Wait for the form to load
    await page.waitForSelector('input[formcontrolname="address1"]', { state: 'visible' });

    // Check that address fields are populated
    await expect(page.locator('input[formcontrolname="address1"]')).toHaveValue('123 Main St');
    await expect(page.locator('input[formcontrolname="address2"]')).toHaveValue('Apt 4B');
    await expect(page.locator('input[formcontrolname="city"]')).toHaveValue('New York');
    await expect(page.locator('input[formcontrolname="province"]')).toHaveValue('NY');
    await expect(page.locator('input[formcontrolname="postalCode"]')).toHaveValue('10001');
  });

  test('validates required fields', async ({ page }) => {
    // Wait for the form to load
    await page.waitForSelector('input[formcontrolname="firstName"]', { state: 'visible' });

    // Clear a required field
    await page.locator('input[formcontrolname="firstName"]').clear();
    await page.locator('input[formcontrolname="firstName"]').blur();

    // Check for validation error
    await expect(page.getByText(/first name is required/i)).toBeVisible();
  });

  test('can update profile information', async ({ page }) => {
    // Mock the update API call
    let updateCalled = false;
    await page.route('/api/profile', async (route) => {
      if (route.request().method() === 'PUT') {
        updateCalled = true;
        const requestBody = route.request().postDataJSON();
        
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            profile: requestBody.profile
          })
        });
      } else {
        await route.continue();
      }
    });

    // Wait for the form to load
    await page.waitForSelector('input[formcontrolname="firstName"]', { state: 'visible' });

    // Update some fields
    await page.locator('input[formcontrolname="firstName"]').fill('Jane');
    await page.locator('input[formcontrolname="lastName"]').fill('Smith');
    await page.locator('input[formcontrolname="city"]').fill('Boston');

    // Submit the form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Wait for success message
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible({ timeout: 5000 });
    
    // Verify API was called
    expect(updateCalled).toBe(true);
  });

  test('can cancel and navigate away', async ({ page }) => {
    // Wait for the form to load
    await page.waitForSelector('button:has-text("Cancel")', { state: 'visible' });

    // Click cancel button
    await page.getByRole('button', { name: /cancel/i }).click();

    // Should navigate to home page
    await expect(page).toHaveURL('/');
  });

  test('shows error message on save failure', async ({ page }) => {
    // Mock the update API to fail
    await page.route('/api/profile', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Server error'
          })
        });
      } else {
        await route.continue();
      }
    });

    // Wait for the form to load
    await page.waitForSelector('input[formcontrolname="firstName"]', { state: 'visible' });

    // Make a change
    await page.locator('input[formcontrolname="firstName"]').fill('Jane');

    // Submit the form
    await page.getByRole('button', { name: /save changes/i }).click();

    // Wait for error message
    await expect(page.getByText(/failed to update profile/i)).toBeVisible({ timeout: 5000 });
  });

  test('requires authentication to access', async ({ page }) => {
    // Clear authentication
    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
    });

    // Try to navigate to personal info page
    await page.goto('/personal-info');

    // Should redirect to login page
    await expect(page).toHaveURL('/login');
  });
});
