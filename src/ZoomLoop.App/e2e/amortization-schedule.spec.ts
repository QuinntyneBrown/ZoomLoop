import { test, expect } from '@playwright/test';

test.describe('Amortization Schedule Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo/amortization');
  });

  test('should display the amortization schedule demo page', async ({ page }) => {
    await expect(page.locator('h2')).toContainText('Amortization Schedule Demo');
  });

  test('should render multiple schedule examples', async ({ page }) => {
    const schedules = page.locator('zl-amortization-schedule');
    await expect(schedules).toHaveCount(3);
  });

  test('should show car loan example', async ({ page }) => {
    await expect(page.locator('h3').first()).toContainText('Car Loan Example');
    await expect(page.getByText('$25,000 loan at 3.9% APR for 60 months')).toBeVisible();
  });

  test('should show mortgage example', async ({ page }) => {
    await expect(page.locator('h3').nth(1)).toContainText('Mortgage Example');
    await expect(page.getByText('$400,000 loan at 3.5% APR for 360 months')).toBeVisible();
  });

  test('should show zero interest example', async ({ page }) => {
    await expect(page.locator('h3').nth(2)).toContainText('Zero Interest Example');
    await expect(page.getByText('$12,000 loan at 0% APR for 24 months')).toBeVisible();
  });

  test('should expand and collapse schedule on toggle click', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    // Initially collapsed
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await expect(firstSchedule.locator('.schedule-content')).not.toBeVisible();
    
    // Expand
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    await expect(firstSchedule.locator('.schedule-content')).toBeVisible();
    
    // Collapse
    await toggleButton.click();
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
    await expect(firstSchedule.locator('.schedule-content')).not.toBeVisible();
  });

  test('should display schedule summary when collapsed', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const summary = firstSchedule.locator('.toggle-summary');
    
    await expect(summary).toBeVisible();
    await expect(summary).toContainText('60 payments');
    await expect(summary).toContainText('Total Interest');
  });

  test('should display schedule table when expanded', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const table = firstSchedule.locator('.schedule-table');
    await expect(table).toBeVisible();
    
    // Check table headers
    await expect(table.locator('th').nth(0)).toContainText('Payment #');
    await expect(table.locator('th').nth(1)).toContainText('Payment');
    await expect(table.locator('th').nth(2)).toContainText('Principal');
    await expect(table.locator('th').nth(3)).toContainText('Interest');
    await expect(table.locator('th').nth(4)).toContainText('Balance');
  });

  test('should display correct number of payment rows', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const rows = firstSchedule.locator('.schedule-table tbody tr');
    await expect(rows).toHaveCount(60);
  });

  test('should display totals section', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const totals = firstSchedule.locator('.schedule-totals');
    await expect(totals).toBeVisible();
    await expect(totals).toContainText('Total Principal');
    await expect(totals).toContainText('Total Interest');
    await expect(totals).toContainText('Total Amount');
  });

  test('should format currency values correctly', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    // Check that values are formatted as currency
    const firstPayment = firstSchedule.locator('.schedule-table tbody tr').first();
    const paymentAmount = firstPayment.locator('td').nth(1);
    
    await expect(paymentAmount).toContainText('$');
  });

  test('should show decreasing balance over time', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const rows = firstSchedule.locator('.schedule-table tbody tr');
    const firstBalance = await rows.first().locator('td').nth(4).textContent();
    const lastBalance = await rows.last().locator('td').nth(4).textContent();
    
    // Convert to numbers for comparison
    const parseAmount = (text: string | null) => {
      if (!text) return 0;
      return parseFloat(text.replace(/[$,]/g, ''));
    };
    
    expect(parseAmount(firstBalance)).toBeGreaterThan(parseAmount(lastBalance));
  });

  test('should handle zero interest rate correctly', async ({ page }) => {
    const zeroInterestSchedule = page.locator('zl-amortization-schedule').nth(2);
    const toggleButton = zeroInterestSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const totals = zeroInterestSchedule.locator('.schedule-totals');
    await expect(totals).toContainText('$0.00'); // Total interest should be $0.00
  });

  test('should be keyboard accessible', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    // Focus the toggle button
    await toggleButton.focus();
    
    // Press Enter to toggle
    await page.keyboard.press('Enter');
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
    
    // Press Enter again to toggle back
    await page.keyboard.press('Enter');
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('should scroll table on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const tableWrapper = firstSchedule.locator('.schedule-table-wrapper');
    await expect(tableWrapper).toBeVisible();
    
    // Check that table wrapper has overflow-x style
    const overflow = await tableWrapper.evaluate(el => getComputedStyle(el).overflowX);
    expect(overflow).toBe('auto');
  });

  test('should handle large loan amounts', async ({ page }) => {
    const mortgageSchedule = page.locator('zl-amortization-schedule').nth(1);
    const toggleButton = mortgageSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const rows = mortgageSchedule.locator('.schedule-table tbody tr');
    await expect(rows).toHaveCount(360); // 30 years = 360 months
  });

  test('should animate content expansion', async ({ page }) => {
    const firstSchedule = page.locator('zl-amortization-schedule').first();
    const toggleButton = firstSchedule.locator('.schedule-toggle');
    
    await toggleButton.click();
    
    const content = firstSchedule.locator('.schedule-content');
    await expect(content).toBeVisible();
    
    // Check that animation class exists
    const hasAnimation = await content.evaluate(el => {
      const animation = getComputedStyle(el).animation;
      return animation && animation !== 'none';
    });
    
    expect(hasAnimation).toBeTruthy();
  });
});
