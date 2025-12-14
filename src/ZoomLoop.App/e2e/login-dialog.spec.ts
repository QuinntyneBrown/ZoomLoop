import { expect, test } from '@playwright/test';

test.describe('Login Dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays Sign In button in navbar', async ({ page }) => {
    await expect(page.locator('zl-navbar').getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('opens login dialog when Sign In button is clicked', async ({ page }) => {
    // Initially dialog should not be visible
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Click Sign In button in navbar
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();

    // Dialog should now be visible
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: /sign in to zoomloop/i })).toBeVisible();
  });

  test('closes dialog when close button is clicked', async ({ page }) => {
    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click close button
    await page.getByRole('button', { name: /close dialog/i }).click();

    // Dialog should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('closes dialog when backdrop is clicked', async ({ page }) => {
    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click backdrop (the area outside the dialog) - CDK uses .cdk-overlay-backdrop
    await page.locator('.cdk-overlay-backdrop').click({ position: { x: 0, y: 0 } });

    // Dialog should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('does not close dialog when clicking inside dialog', async ({ page }) => {
    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click inside the dialog
    await page.locator('.login-dialog').click();

    // Dialog should still be visible
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('displays login form inside dialog', async ({ page }) => {
    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();

    // Check for form fields
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByLabel(/remember me/i)).toBeVisible();
    await expect(page.locator('form').getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('validates form fields in dialog', async ({ page }) => {
    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();

    const submitButton = page.locator('form').getByRole('button', { name: /sign in/i });

    // Submit button should be disabled initially
    await expect(submitButton).toBeDisabled();

    // Fill username only
    await page.getByLabel(/username/i).fill('testuser');
    await expect(submitButton).toBeDisabled();

    // Fill password
    await page.getByLabel(/password/i).fill('testpass');

    // Submit button should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('successfully logs in and closes dialog with mocked response', async ({ page }) => {
    // Mock the login API response
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-jwt-token-123456'
        })
      });
    });

    // Mock the current user API response
    await page.route('**/api/user/current', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            username: 'testuser',
            roles: []
          }
        })
      });
    });

    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Fill in credentials
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpass');

    // Submit the form
    await page.locator('form').getByRole('button', { name: /sign in/i }).click();

    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });
  });

  test('stores JWT token in localStorage after successful login', async ({ page }) => {
    // Mock the login API response
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-jwt-token-123456'
        })
      });
    });

    // Mock the current user API response
    await page.route('**/api/user/current', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            username: 'testuser',
            roles: []
          }
        })
      });
    });

    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();

    // Fill in credentials
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpass');

    // Submit the form
    await page.locator('form').getByRole('button', { name: /sign in/i }).click();

    // Wait a bit for the async operation
    await page.waitForTimeout(1000);

    // Check that JWT is stored in localStorage
    const storage = await page.evaluate(() => {
      const storageData = localStorage.getItem('zoomloop');
      return storageData ? JSON.parse(storageData) : null;
    });

    expect(storage).toBeTruthy();
    const accessToken = storage?.find((item: any) => item.name === 'zoomloop:accessTokenKey');
    expect(accessToken).toBeTruthy();
    expect(accessToken.value).toBe('mock-jwt-token-123456');
  });

  test('includes JWT token in subsequent HTTP requests', async ({ page }) => {
    let requestHeaders: Record<string, string> = {};

    // Mock the login API response
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-jwt-token-123456'
        })
      });
    });

    // Mock the current user API response
    await page.route('**/api/user/current', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            username: 'testuser',
            roles: []
          }
        })
      });
    });

    // Capture a subsequent request to check headers
    await page.route('**/api/vehicles', async (route) => {
      requestHeaders = route.request().headers();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ vehicles: [] })
      });
    });

    // Open the dialog and login
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpass');
    await page.locator('form').getByRole('button', { name: /sign in/i }).click();

    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

    // Make a request to trigger the interceptor
    await page.evaluate(() => {
      return fetch('/api/vehicles');
    });

    // Wait a bit for the request to complete
    await page.waitForTimeout(500);

    // Check that Authorization header is present
    expect(requestHeaders['authorization']).toBe('Bearer mock-jwt-token-123456');
  });

  test('stores credentials when Remember Me is checked', async ({ page }) => {
    // Mock the login API response
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-jwt-token-123456'
        })
      });
    });

    // Mock the current user API response
    await page.route('**/api/user/current', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            username: 'testuser',
            roles: []
          }
        })
      });
    });

    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();

    // Fill in credentials and check Remember Me
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpass');
    await page.getByLabel(/remember me/i).check();

    // Submit the form
    await page.locator('form').getByRole('button', { name: /sign in/i }).click();

    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

    // Check that credentials are stored in localStorage
    const storage = await page.evaluate(() => {
      const storageData = localStorage.getItem('zoomloop');
      return storageData ? JSON.parse(storageData) : null;
    });

    const loginCredentials = storage?.find((item: any) => item.name === 'zoomloop:loginCredentialsKey');
    expect(loginCredentials).toBeTruthy();
    expect(loginCredentials.value).toEqual({
      username: 'testuser',
      password: 'testpass',
      rememberMe: true
    });
  });

  test('does not store credentials when Remember Me is not checked', async ({ page }) => {
    // Mock the login API response
    await page.route('**/api/user/token', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          accessToken: 'mock-jwt-token-123456'
        })
      });
    });

    // Mock the current user API response
    await page.route('**/api/user/current', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: 1,
            username: 'testuser',
            roles: []
          }
        })
      });
    });

    // Open the dialog
    await page.locator('zl-navbar').getByRole('button', { name: /sign in/i }).click();

    // Fill in credentials without checking Remember Me
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpass');

    // Submit the form
    await page.locator('form').getByRole('button', { name: /sign in/i }).click();

    // Wait for dialog to close
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 5000 });

    // Check that credentials are NOT stored in localStorage
    const storage = await page.evaluate(() => {
      const storageData = localStorage.getItem('zoomloop');
      return storageData ? JSON.parse(storageData) : null;
    });

    const loginCredentials = storage?.find((item: any) => item.name === 'zoomloop:loginCredentialsKey');
    expect(loginCredentials?.value).toBeNull();
  });
});
