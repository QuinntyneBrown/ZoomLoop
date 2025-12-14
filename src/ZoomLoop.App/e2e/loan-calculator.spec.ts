import { expect, test } from '@playwright/test';

// Helper function to select a native option by term value
async function selectMatOption(page: any, selectId: string, optionText: string) {
  const termValue = optionText.split(' ')[0];
  await page.locator(`#${selectId}`).selectOption(termValue);
}

test.describe('Loan Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/loan-calculator');
  });

  test('displays the loan calculator form', async ({ page }) => {
    // Check for page title
    await expect(page.getByRole('heading', { name: /loan calculator/i })).toBeVisible();
    
    // Check for all required form fields
    await expect(page.locator('input#price')).toBeVisible();
    await expect(page.locator('input#downPayment')).toBeVisible();
    await expect(page.locator('input#apr')).toBeVisible();
    await expect(page.locator('#termMonths')).toBeVisible();
    await expect(page.locator('input#fees')).toBeVisible();
  });

  test('validates price field - must be greater than 0', async ({ page }) => {
    const priceInput = page.locator('input#price');
    
    // Fill with invalid price (0)
    await priceInput.fill('0');
    await priceInput.blur();
    
    // Check for error message
    await expect(page.locator('#price-error')).toBeVisible();
    await expect(page.locator('#price-error')).toContainText(/must be at least/i);
  });

  test('validates price field - required', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /calculate payment/i });
    
    // Button should be disabled initially (form is empty/invalid)
    await expect(submitButton).toBeDisabled();
    
    // Fill other fields but leave price empty
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    
    // Button should still be disabled because price is required
    await expect(submitButton).toBeDisabled();
  });

  test('validates down payment cannot exceed price', async ({ page }) => {
    const priceInput = page.locator('input#price');
    const downPaymentInput = page.locator('input#downPayment');
    
    // Fill with valid price
    await priceInput.fill('25000');
    
    // Fill with down payment exceeding price
    await downPaymentInput.fill('30000');
    await downPaymentInput.blur();
    
    // Check for error message
    await expect(page.locator('#downPayment-error')).toBeVisible();
    await expect(page.locator('#downPayment-error')).toContainText(/cannot exceed price/i);
  });

  test('validates APR within configured bounds', async ({ page }) => {
    const aprInput = page.locator('input#apr');
    
    // Fill with APR exceeding max (30%)
    await aprInput.fill('35');
    await aprInput.blur();
    
    // Check for error message
    await expect(page.locator('#apr-error')).toBeVisible();
    await expect(page.locator('#apr-error')).toContainText(/cannot exceed/i);
  });

  test('validates APR minimum bound', async ({ page }) => {
    const aprInput = page.locator('input#apr');
    
    // Fill with negative APR
    await aprInput.fill('-1');
    await aprInput.blur();
    
    // Check for error message
    await expect(page.locator('#apr-error')).toBeVisible();
    await expect(page.locator('#apr-error')).toContainText(/must be at least/i);
  });

  test('validates term selection from allowed values', async ({ page }) => {
    const options = page.locator('#termMonths option');

    await expect(options.filter({ hasText: /12 months/ })).toHaveCount(1);
    await expect(options.filter({ hasText: /24 months/ })).toHaveCount(1);
    await expect(options.filter({ hasText: /36 months/ })).toHaveCount(1);
    await expect(options.filter({ hasText: /48 months/ })).toHaveCount(1);
    await expect(options.filter({ hasText: /60 months/ })).toHaveCount(1);
    await expect(options.filter({ hasText: /72 months/ })).toHaveCount(1);
    await expect(options.filter({ hasText: /84 months/ })).toHaveCount(1);
  });

  test('validates fees are non-negative', async ({ page }) => {
    const feesInput = page.locator('input#fees');
    
    // Fill with negative fees
    await feesInput.fill('-100');
    await feesInput.blur();
    
    // Check for error message
    await expect(page.locator('#fees-error')).toBeVisible();
    await expect(page.locator('#fees-error')).toContainText(/must be at least/i);
  });

  test('calculates loan with valid inputs', async ({ page }) => {
    // Fill in all fields with valid values
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    
    // Submit the form
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Check that results are displayed
    await expect(page.getByText(/monthly payment/i)).toBeVisible();
    await expect(page.getByText(/total loan amount/i)).toBeVisible();
    await expect(page.getByText(/total interest/i)).toBeVisible();
    await expect(page.getByText(/total cost/i)).toBeVisible();
    
    // Verify that the monthly payment is displayed and is a valid number
    const resultsSection = page.locator('.loan-results');
    await expect(resultsSection).toBeVisible();
    
    // Check that the monthly payment value is shown
    const monthlyPaymentValue = resultsSection.locator('.loan-results__value--large');
    await expect(monthlyPaymentValue).toBeVisible();
    const paymentText = await monthlyPaymentValue.textContent();
    expect(paymentText).toMatch(/\$\d+/); // Should contain a dollar amount
  });

  test('prevents NaN outputs', async ({ page }) => {
    // Fill in fields that might cause NaN
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    
    // Submit the form
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Check that results don't contain NaN
    const resultsSection = page.locator('.loan-results');
    const resultsText = await resultsSection.textContent();
    expect(resultsText).not.toContain('NaN');
  });

  test('prevents Infinity outputs', async ({ page }) => {
    // Fill in valid fields
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    
    // Submit the form
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Check that results don't contain Infinity
    const resultsSection = page.locator('.loan-results');
    const resultsText = await resultsSection.textContent();
    expect(resultsText).not.toContain('Infinity');
  });

  test('handles zero APR correctly', async ({ page }) => {
    // Fill in fields with 0% APR
    await page.locator('input#price').fill('24000');
    await page.locator('input#downPayment').fill('0');
    await page.locator('input#apr').fill('0');
    await selectMatOption(page, 'termMonths', '48 months');
    await page.locator('input#fees').fill('0');
    
    // Submit the form
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Check that results are displayed
    const resultsSection = page.locator('.loan-results');
    await expect(resultsSection).toBeVisible();
    
    // Monthly payment should be 24000 / 48 = 500
    const monthlyPaymentValue = resultsSection.locator('.loan-results__value--large');
    const paymentText = await monthlyPaymentValue.textContent();
    expect(paymentText).toContain('500.00');
  });

  test('displays error messages with proper ARIA attributes', async ({ page }) => {
    const priceInput = page.locator('input#price');
    
    // Trigger validation error
    await priceInput.fill('0');
    await priceInput.blur();
    
    // Check ARIA attributes
    await expect(priceInput).toHaveAttribute('aria-invalid', 'true');
    await expect(priceInput).toHaveAttribute('aria-describedby', 'price-error');
    
    // Check error has role="alert"
    const errorElement = page.locator('#price-error');
    await expect(errorElement).toHaveAttribute('role', 'alert');
  });

  test('shows inline errors on blur', async ({ page }) => {
    const priceInput = page.locator('input#price');
    
    // Focus and blur without entering value
    await priceInput.focus();
    await priceInput.blur();
    
    // Error should not appear on just blur without touching
    // Let's submit to trigger validation
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Now error should be visible
    await expect(page.locator('#price-error')).toBeVisible();
  });

  test('clears errors when valid value is entered', async ({ page }) => {
    const priceInput = page.locator('input#price');
    
    // Enter invalid value
    await priceInput.fill('0');
    await priceInput.blur();
    
    // Error should be visible
    await expect(page.locator('#price-error')).toBeVisible();
    
    // Enter valid value
    await priceInput.fill('25000');
    await priceInput.blur();
    
    // Error should be hidden (or not exist)
    await expect(page.locator('#price-error')).not.toBeVisible();
  });

  test('resets form and results', async ({ page }) => {
    // Fill in form and calculate
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Verify results are shown
    await expect(page.locator('.loan-results')).toBeVisible();
    
    // Click reset
    await page.getByRole('button', { name: /reset/i }).click();
    
    // Verify form is cleared
    await expect(page.locator('input#price')).toHaveValue('');
    await expect(page.locator('input#downPayment')).toHaveValue('');
    await expect(page.locator('input#apr')).toHaveValue('');
    await expect(page.locator('input#fees')).toHaveValue('');
    
    // Verify results are hidden
    await expect(page.locator('.loan-results')).not.toBeVisible();
  });

  test('shows friendly error message for invalid calculation state', async ({ page }) => {
    // This test ensures the engine shows friendly messages for invalid states
    // Fill fields with invalid negative values
    await page.locator('input#price').fill('-1000');
    await page.locator('input#price').blur();
    
    await page.locator('input#downPayment').fill('-500');
    await page.locator('input#downPayment').blur();
    
    await page.locator('input#apr').fill('-5');
    await page.locator('input#apr').blur();
    
    await page.locator('input#fees').fill('-100');
    await page.locator('input#fees').blur();
    
    // Multiple errors should be shown after blur
    await expect(page.locator('#price-error')).toBeVisible();
    await expect(page.locator('#downPayment-error')).toBeVisible();
    await expect(page.locator('#apr-error')).toBeVisible();
    await expect(page.locator('#fees-error')).toBeVisible();
  });

  test('calculate button is disabled when form is invalid', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /calculate payment/i });
    
    // Initially, button should be disabled (form is empty/invalid)
    await expect(submitButton).toBeDisabled();
    
    // Fill in all fields with valid values
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    
    // Button should now be enabled
    await expect(submitButton).toBeEnabled();
  });

  test('has proper heading structure for accessibility', async ({ page }) => {
    // Check for main heading
    const mainHeading = page.getByRole('heading', { level: 1, name: /loan calculator/i });
    await expect(mainHeading).toBeVisible();
    
    // Fill in form and calculate to show results
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Check for results heading
    const resultsHeading = page.getByRole('heading', { level: 2, name: /your loan summary/i });
    await expect(resultsHeading).toBeVisible();
  });

  test('results section has proper ARIA region', async ({ page }) => {
    // Fill in form and calculate
    await page.locator('input#price').fill('25000');
    await page.locator('input#downPayment').fill('5000');
    await page.locator('input#apr').fill('5');
    await selectMatOption(page, 'termMonths', '60 months');
    await page.locator('input#fees').fill('500');
    await page.getByRole('button', { name: /calculate payment/i }).click();
    
    // Check that results section has proper ARIA role
    const resultsRegion = page.locator('[role="region"][aria-label*="results"]');
    await expect(resultsRegion).toBeVisible();
  });
});
