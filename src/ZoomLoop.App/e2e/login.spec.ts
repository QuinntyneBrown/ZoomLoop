import { expect, test } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('displays login form', async ({ page }) => {
    // Check for login title
    await expect(page.getByRole('heading', { name: /sign in to zoomloop/i })).toBeVisible();

    // Check for form fields
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /sign in/i });

    // Initially, the button should be disabled
    await expect(submitButton).toBeDisabled();

    // Fill in username only
    await page.getByLabel(/username/i).fill('testuser');
    await expect(submitButton).toBeDisabled();

    // Fill in password
    await page.getByLabel(/password/i).fill('testpass');
    
    // Now button should be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('clears form fields when empty', async ({ page }) => {
    const usernameInput = page.getByLabel(/username/i);
    const passwordInput = page.getByLabel(/password/i);
    const submitButton = page.getByRole('button', { name: /sign in/i });

    // Fill both fields
    await usernameInput.fill('testuser');
    await passwordInput.fill('testpass');
    await expect(submitButton).toBeEnabled();

    // Clear username
    await usernameInput.clear();
    await expect(submitButton).toBeDisabled();
  });

  test('shows validation errors on blur', async ({ page }) => {
    const usernameInput = page.getByLabel(/username/i);
    const passwordInput = page.getByLabel(/password/i);

    // Focus and blur username without filling
    await usernameInput.focus();
    await usernameInput.blur();
    await expect(page.getByText(/username is required/i)).toBeVisible();

    // Focus and blur password without filling
    await passwordInput.focus();
    await passwordInput.blur();
    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('remember me checkbox works', async ({ page }) => {
    const rememberMeCheckbox = page.getByLabel(/remember me/i);

    // Initially unchecked
    await expect(rememberMeCheckbox).not.toBeChecked();

    // Check it
    await rememberMeCheckbox.check();
    await expect(rememberMeCheckbox).toBeChecked();

    // Uncheck it
    await rememberMeCheckbox.uncheck();
    await expect(rememberMeCheckbox).not.toBeChecked();
  });

  test('form inputs accept text', async ({ page }) => {
    const usernameInput = page.getByLabel(/username/i);
    const passwordInput = page.getByLabel(/password/i);

    await usernameInput.fill('testuser123');
    await expect(usernameInput).toHaveValue('testuser123');

    await passwordInput.fill('securePassword456!');
    await expect(passwordInput).toHaveValue('securePassword456!');
  });

  test('password field masks input', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
