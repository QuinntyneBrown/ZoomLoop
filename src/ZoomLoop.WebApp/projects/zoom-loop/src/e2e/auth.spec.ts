// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Login Dialog', () => {
    test('should open login dialog when clicking Sign In button', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('zl-login-dialog, .login-dialog')).toBeVisible();
      await expect(page.locator('text=Sign In').first()).toBeVisible();
    });

    test('should display email and password fields in login form', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('input[name="email"], #login-email')).toBeVisible();
      await expect(page.locator('input[name="password"], #login-password')).toBeVisible();
    });

    test('should display remember me checkbox', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('input[name="rememberMe"], input[type="checkbox"]:near(:text("Remember me"))')).toBeVisible();
    });

    test('should display forgot password link', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('text=Forgot password?')).toBeVisible();
    });

    test('should display create account link', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('text=Create one')).toBeVisible();
    });

    test('should have submit button disabled with empty fields', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      const submitButton = page.locator('button[type="submit"]:has-text("Sign In")');
      await expect(submitButton).toBeDisabled();
    });

    test('should enable submit button when email and password are filled', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await page.fill('input[name="email"], #login-email', 'test@example.com');
      await page.fill('input[name="password"], #login-password', 'password123');

      const submitButton = page.locator('button[type="submit"]:has-text("Sign In")');
      await expect(submitButton).toBeEnabled();
    });

    test('should close dialog when clicking close button or overlay', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await expect(page.locator('zl-login-dialog, .login-dialog')).toBeVisible();

      await page.click('[data-testid="modal-close"], .modal__close, button[aria-label="Close"]');

      await expect(page.locator('zl-login-dialog, .login-dialog')).not.toBeVisible();
    });

    test('should toggle password visibility', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      const passwordInput = page.locator('input[name="password"], #login-password');
      const toggleButton = page.locator('.login-dialog__password-toggle, button:has-text("Show")');

      await expect(passwordInput).toHaveAttribute('type', 'password');

      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');

      await page.locator('.login-dialog__password-toggle, button:has-text("Hide")').click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Registration Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Create one');
    });

    test('should switch to registration form when clicking Create one', async ({ page }) => {
      await expect(page.locator('text=Create Account').first()).toBeVisible();
    });

    test('should display all required registration fields', async ({ page }) => {
      await expect(page.locator('input[name="firstName"], #register-firstName')).toBeVisible();
      await expect(page.locator('input[name="lastName"], #register-lastName')).toBeVisible();
      await expect(page.locator('input[name="email"], #register-email')).toBeVisible();
      await expect(page.locator('input[name="phone"], #register-phone')).toBeVisible();
      await expect(page.locator('input[name="password"], #register-password')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"], #register-confirmPassword')).toBeVisible();
    });

    test('should show password strength indicator', async ({ page }) => {
      const passwordInput = page.locator('input[name="password"], #register-password');

      await passwordInput.fill('weak');
      await expect(page.locator('text=Too short')).toBeVisible();

      await passwordInput.fill('weakpass');
      await expect(page.locator('text=Weak')).toBeVisible();

      await passwordInput.fill('StrongPass1');
      await expect(page.locator('text=Good')).toBeVisible();

      await passwordInput.fill('StrongPassword123!');
      await expect(page.locator('text=Strong')).toBeVisible();
    });

    test('should show password mismatch error', async ({ page }) => {
      await page.fill('input[name="password"], #register-password', 'Password123!');
      await page.fill('input[name="confirmPassword"], #register-confirmPassword', 'DifferentPass1!');

      await expect(page.locator('text=Passwords do not match')).toBeVisible();
    });

    test('should have disabled submit with invalid form', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]:has-text("Create Account")');
      await expect(submitButton).toBeDisabled();
    });

    test('should enable submit when all fields are valid', async ({ page }) => {
      await page.fill('input[name="firstName"], #register-firstName', 'John');
      await page.fill('input[name="lastName"], #register-lastName', 'Doe');
      await page.fill('input[name="email"], #register-email', 'john.doe@example.com');
      await page.fill('input[name="password"], #register-password', 'StrongPass1!');
      await page.fill('input[name="confirmPassword"], #register-confirmPassword', 'StrongPass1!');

      const submitButton = page.locator('button[type="submit"]:has-text("Create Account")');
      await expect(submitButton).toBeEnabled();
    });

    test('should display marketing opt-in checkbox', async ({ page }) => {
      await expect(page.locator('input[name="marketingOptIn"]')).toBeVisible();
      await expect(page.locator('text=Send me news, updates, and promotions')).toBeVisible();
    });

    test('should have link to switch back to login', async ({ page }) => {
      await expect(page.locator('text=Already have an account?')).toBeVisible();

      await page.click('text=Sign in');

      await expect(page.locator('button[type="submit"]:has-text("Sign In")')).toBeVisible();
    });
  });

  test.describe('Forgot Password Form', () => {
    test.beforeEach(async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Forgot password?');
    });

    test('should switch to forgot password form', async ({ page }) => {
      await expect(page.locator('text=Reset Password').first()).toBeVisible();
    });

    test('should display reset password description', async ({ page }) => {
      await expect(page.locator("text=Enter your email address and we'll send you a link")).toBeVisible();
    });

    test('should display email field', async ({ page }) => {
      await expect(page.locator('input[name="email"], #forgot-email')).toBeVisible();
    });

    test('should have disabled submit with empty email', async ({ page }) => {
      const submitButton = page.locator('button[type="submit"]:has-text("Send Reset Link")');
      await expect(submitButton).toBeDisabled();
    });

    test('should enable submit when email is filled', async ({ page }) => {
      await page.fill('input[name="email"], #forgot-email', 'test@example.com');

      const submitButton = page.locator('button[type="submit"]:has-text("Send Reset Link")');
      await expect(submitButton).toBeEnabled();
    });

    test('should have link to go back to sign in', async ({ page }) => {
      await expect(page.locator('text=Back to sign in')).toBeVisible();

      await page.click('text=Back to sign in');

      await expect(page.locator('button[type="submit"]:has-text("Sign In")')).toBeVisible();
    });
  });

  test.describe('Form Mode Switching', () => {
    test('should preserve dialog state when switching modes', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await page.click('text=Create one');
      await expect(page.locator('text=Create Account').first()).toBeVisible();

      await page.click('text=Sign in');
      await expect(page.locator('button[type="submit"]:has-text("Sign In")')).toBeVisible();

      await page.click('text=Forgot password?');
      await expect(page.locator('text=Reset Password').first()).toBeVisible();
    });
  });

  test.describe('Header Authentication State', () => {
    test('should show Sign In button when not authenticated', async ({ page }) => {
      await expect(page.locator('button:has-text("Sign In"), [data-testid="sign-in-button"]')).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('login form should have proper labels', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('label[for="login-email"]')).toBeVisible();
      await expect(page.locator('label[for="login-password"]')).toBeVisible();
    });

    test('registration form should have proper labels', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Create one');

      await expect(page.locator('label[for="register-firstName"]')).toBeVisible();
      await expect(page.locator('label[for="register-lastName"]')).toBeVisible();
      await expect(page.locator('label[for="register-email"]')).toBeVisible();
      await expect(page.locator('label[for="register-password"]')).toBeVisible();
      await expect(page.locator('label[for="register-confirmPassword"]')).toBeVisible();
    });

    test('inputs should have proper autocomplete attributes', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(page.locator('#login-email')).toHaveAttribute('autocomplete', 'email');
      await expect(page.locator('#login-password')).toHaveAttribute('autocomplete', 'current-password');
    });
  });
});
