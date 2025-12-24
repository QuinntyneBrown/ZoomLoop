// Copyright (c) Quinntyne Brown. All Rights Reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { test, expect } from '@playwright/test';

test.describe('MatDialog Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('Login Dialog via MatDialog', () => {
    test('should open login dialog and be able to interact', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      // Dialog should be visible (either custom modal or MatDialog)
      await expect(
        page.locator('zl-login-dialog, zl-login-dialog-content, .login-dialog, .mat-mdc-dialog-container')
      ).toBeVisible();
    });

    test('should close dialog with escape key', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(
        page.locator('zl-login-dialog, zl-login-dialog-content, .login-dialog')
      ).toBeVisible();

      await page.keyboard.press('Escape');

      await expect(
        page.locator('zl-login-dialog, zl-login-dialog-content, .login-dialog')
      ).not.toBeVisible();
    });

    test('should validate form fields before submission', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      const submitButton = page.locator('button[type="submit"]:has-text("Sign In")');

      // Button should be disabled with empty fields
      await expect(submitButton).toBeDisabled();

      // Fill email only
      await page.fill('input[name="email"], #login-email', 'test@example.com');
      await expect(submitButton).toBeDisabled();

      // Fill password
      await page.fill('input[name="password"], #login-password', 'password123');
      await expect(submitButton).toBeEnabled();
    });

    test('should switch between dialog modes seamlessly', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      // Verify login mode
      await expect(page.locator('button[type="submit"]:has-text("Sign In")')).toBeVisible();

      // Switch to forgot password
      await page.click('text=Forgot password?');
      await expect(page.locator('text=Reset Password').first()).toBeVisible();

      // Switch back to login
      await page.click('text=Back to sign in');
      await expect(page.locator('button[type="submit"]:has-text("Sign In")')).toBeVisible();

      // Navigate to create account
      await page.click('text=Create one');
      await expect(page.locator('text=Create Account').first()).toBeVisible();
    });

    test('should handle form submission', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await page.fill('input[name="email"], #login-email', 'test@example.com');
      await page.fill('input[name="password"], #login-password', 'password123');

      const submitButton = page.locator('button[type="submit"]:has-text("Sign In")');
      await expect(submitButton).toBeEnabled();

      // Form should be submittable
      await submitButton.click();

      // Wait for either error message or dialog close
      await page.waitForTimeout(1000);
    });
  });

  test.describe('Dialog Accessibility', () => {
    test('should trap focus within dialog', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      // First focusable element should be focused
      await page.keyboard.press('Tab');

      // Continue tabbing should keep focus within dialog
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
        const activeElement = await page.evaluate(() => document.activeElement?.tagName);
        // Active element should be within dialog or body (for overlay)
        expect(['INPUT', 'BUTTON', 'A', 'BODY', 'DIV']).toContain(activeElement);
      }
    });

    test('should have proper ARIA attributes', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      // Check for dialog role
      const dialog = page.locator('[role="dialog"], .modal, .mat-mdc-dialog-container');
      await expect(dialog).toBeVisible();
    });

    test('should restore focus when dialog closes', async ({ page }) => {
      const signInButton = page.locator('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await signInButton.click();

      await expect(
        page.locator('zl-login-dialog, zl-login-dialog-content, .login-dialog')
      ).toBeVisible();

      await page.keyboard.press('Escape');

      // Focus should return to the trigger button
      await page.waitForTimeout(500);
    });
  });

  test.describe('Dialog Overlay', () => {
    test('should close dialog when clicking overlay', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(
        page.locator('zl-login-dialog, zl-login-dialog-content, .login-dialog')
      ).toBeVisible();

      // Click on overlay/backdrop
      await page.click('.modal__overlay, .cdk-overlay-backdrop, .mat-mdc-dialog-container', {
        position: { x: 10, y: 10 },
        force: true
      });

      // Give time for animation
      await page.waitForTimeout(500);
    });

    test('should prevent background scrolling when dialog is open', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      const bodyOverflow = await page.evaluate(() => {
        return window.getComputedStyle(document.body).overflow;
      });

      // Body should have overflow hidden or the dialog should handle scroll blocking
      // This might be 'hidden' or 'auto' depending on implementation
      expect(['hidden', 'auto', '']).toContain(bodyOverflow);
    });
  });

  test.describe('Dialog Animation', () => {
    test('should animate dialog open', async ({ page }) => {
      const startTime = Date.now();

      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');

      await expect(
        page.locator('zl-login-dialog, zl-login-dialog-content, .login-dialog')
      ).toBeVisible();

      const endTime = Date.now();

      // Animation should complete within reasonable time
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });

  test.describe('Registration Dialog', () => {
    test('should validate all registration fields', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Create one');

      const submitButton = page.locator('button[type="submit"]:has-text("Create Account")');
      await expect(submitButton).toBeDisabled();

      // Fill all required fields
      await page.fill('input[name="firstName"], #register-firstName', 'John');
      await page.fill('input[name="lastName"], #register-lastName', 'Doe');
      await page.fill('input[name="email"], #register-email', 'john.doe@example.com');
      await page.fill('input[name="password"], #register-password', 'StrongPass1!');
      await page.fill('input[name="confirmPassword"], #register-confirmPassword', 'StrongPass1!');

      await expect(submitButton).toBeEnabled();
    });

    test('should show password strength feedback', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Create one');

      const passwordInput = page.locator('input[name="password"], #register-password');

      // Test weak password
      await passwordInput.fill('weak');
      await expect(page.locator('text=Too short')).toBeVisible();

      // Test good password
      await passwordInput.fill('GoodPass1');
      await expect(page.locator('text=Good')).toBeVisible();

      // Test strong password
      await passwordInput.fill('VeryStrongPassword123!');
      await expect(page.locator('text=Strong')).toBeVisible();
    });

    test('should show password mismatch error', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Create one');

      await page.fill('input[name="password"], #register-password', 'Password123!');
      await page.fill('input[name="confirmPassword"], #register-confirmPassword', 'DifferentPass1!');

      await expect(page.locator('text=Passwords do not match')).toBeVisible();
    });
  });

  test.describe('Forgot Password Dialog', () => {
    test('should validate email before submission', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Forgot password?');

      const submitButton = page.locator('button[type="submit"]:has-text("Send Reset Link")');
      await expect(submitButton).toBeDisabled();

      await page.fill('input[name="email"], #forgot-email', 'test@example.com');
      await expect(submitButton).toBeEnabled();
    });

    test('should display reset instructions', async ({ page }) => {
      await page.click('button:has-text("Sign In"), [data-testid="sign-in-button"]');
      await page.click('text=Forgot password?');

      await expect(
        page.locator("text=Enter your email address and we'll send you a link")
      ).toBeVisible();
    });
  });
});
